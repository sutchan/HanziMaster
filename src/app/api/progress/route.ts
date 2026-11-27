// src/app/api/progress/route.ts v5.3.0
// 云同步端点：同步码仅经 POST 请求体传递（不进 URL/日志）；强制动态 + 限流 + 严格校验。
import { NextResponse, type NextRequest } from 'next/server';
import { isSyncCode } from '@/lib/cloud-sync';
import { SYNC_ERRORS, type SyncErrorCode } from '@/lib/api-errors';
import { syncConfigured, rateLimit, readCloudBackup, writeCloudBackup } from '@/lib/cloud-sync-server';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

function reject(code: SyncErrorCode) {
  // 状态码与英文兜底文案均来自 api-errors 单一来源，路由不再重复声明。
  const { status, fallbackMessage } = SYNC_ERRORS[code];
  return NextResponse.json(
    { error: code, message: fallbackMessage },
    { status, headers: { ...noStore, 'Retry-After': status === 429 ? '60' : '0' } },
  );
}

/**
 * 统一读取入口：同步码只从 JSON body 读取。
 * 原 GET ?code= 通道已移除，避免能力凭证落入服务器/CDN 访问日志。
 */
export async function POST(request: NextRequest) {
  if (!syncConfigured()) return reject('not_configured');

  let body: { code?: unknown; backup?: unknown };
  try {
    body = await request.json();
  } catch {
    return reject('invalid_json');
  }
  if (typeof body.code !== 'string' || !isSyncCode(body.code)) return reject('invalid_code');
  if (!rateLimit(body.code)) return reject('rate_limited');

  const writing = body.backup !== undefined;
  if (writing && (typeof body.backup !== 'string' || !body.backup)) {
    return reject('invalid_backup');
  }
  const result = writing
    ? await writeCloudBackup(body.code, body.backup as string)
    : await readCloudBackup(body.code);

  if (!result.ok) return reject(result.code);
  return NextResponse.json(writing ? { ok: true } : { backup: result.backup }, { headers: noStore });
}

/** 旧版 GET 通道永久关闭：凭证不得出现在 URL 中。 */
export async function GET() {
  return reject('use_post');
}
