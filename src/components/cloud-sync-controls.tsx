// src/components/cloud-sync-controls.tsx v5.3.0
// 云同步入口：同步码生成/复制、上传与恢复；localStorage 仍是主存储，云端失败不影响本地进度。
'use client';

import { useRef, useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { useToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { CloudSyncConfirmDialog } from '@/components/cloud-sync-confirm-dialog';
import { safeGetItem, trySetItem } from '@/lib/storage';
import { getDefaultProgress, type ProgressData } from '@/lib/progress-utils';
import { createProgressBackup, parseProgressBackup } from '@/lib/progress-transfer';
import { PROGRESS_STORAGE_KEY, PROGRESS_IMPORTED_EVENT } from '@/hooks/use-progress';
import { SYNC_ERRORS, isSyncErrorCode } from '@/lib/api-errors';
import { copyWithFallback, postSyncRequest, SyncRequestError } from '@/lib/cloud-sync-client';
import type { TranslationKey } from '@/lib/i18n';
import {
  SYNC_CODE_STORAGE_KEY, generateSyncCode, isSyncCode,
} from '@/lib/cloud-sync';

const readCode = (): string => {
  const saved = safeGetItem<string>(SYNC_CODE_STORAGE_KEY, '');
  return typeof saved === 'string' && isSyncCode(saved) ? saved : '';
};

const hasProgress = (p: ProgressData): boolean =>
  p.learnedCharIds.length > 0 || p.quizResults.length > 0 || Object.keys(p.dailyActivity).length > 0;

/** 服务端错误码统一映射到 i18n key；客户端本地错误单独兜底，绝不比较 message 文本。 */
const errorKeyFor = (err: unknown): TranslationKey => {
  if (err instanceof SyncRequestError) {
    if (isSyncErrorCode(err.code)) return SYNC_ERRORS[err.code].messageKey;
    if (err.code === 'storage_failed') return 'common.errorDesc';
  }
  return 'cloud.failed';
};

export function CloudSyncControls() {
  const { t } = useLocale();
  const toast = useToast();
  const [code, setCode] = useState(readCode);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const codeInputRef = useRef<HTMLInputElement | null>(null);

  const saveCode = (next: string) => {
    setCode(next);
    setCopyFailed(false);
    // 同步码丢失会导致云端数据失去访问入口，写入失败必须提示
    if (!trySetItem(SYNC_CODE_STORAGE_KEY, next)) {
      toast.error(t('common.errorDesc'));
    }
  };

  /** 复制失败时保留选中态、高亮输入框并 toast 提示，避免静默失败导致手抄出错。 */
  const copyCode = async (value: string) => {
    const outcome = await copyWithFallback(value, codeInputRef.current);
    if (outcome === 'failed') {
      setCopyFailed(true);
      codeInputRef.current?.select();
      toast.error(t('cloud.copyFailed'));
      return;
    }
    setCopyFailed(false);
  };

  const generateAndCopy = async () => {
    const next = generateSyncCode();
    if (!next) {
      toast.error(t('cloud.failed'));
      return;
    }
    saveCode(next);
    await copyCode(next);
  };

  const handleGenerate = () => {
    // 覆盖已有同步码会让旧云端数据失去访问入口，先经受控弹窗确认
    if (isSyncCode(code)) {
      setConfirmOpen(true);
      return;
    }
    void generateAndCopy();
  };

  const handleCopy = () => {
    if (!code) return;
    void copyCode(code);
  };

  const handleUpload = async () => {
    if (!isSyncCode(code)) return;
    const progress = safeGetItem<ProgressData>(PROGRESS_STORAGE_KEY, getDefaultProgress());
    if (!hasProgress(progress)) {
      toast.error(t('cloud.noProgress'));
      return;
    }
    const backup = createProgressBackup(progress);
    setBusy(true);
    try {
      await postSyncRequest(code, backup);
      toast.success(t('cloud.uploadDone'));
    } catch (err) {
      toast.error(t(errorKeyFor(err)));
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    if (!isSyncCode(code)) return;
    setBusy(true);
    try {
      const data = await postSyncRequest(code);
      if (!data.backup) throw new SyncRequestError('request_failed');
      const progress = parseProgressBackup(data.backup);
      if (!trySetItem(PROGRESS_STORAGE_KEY, progress)) throw new SyncRequestError('storage_failed');
      window.dispatchEvent(new Event(PROGRESS_IMPORTED_EVENT));
      toast.success(t('cloud.downloadDone'));
    } catch (err) {
      toast.error(t(errorKeyFor(err)));
    } finally {
      setBusy(false);
    }
  };

  const ready = isSyncCode(code);

  return (
    <div id="cloud-sync-controls" className="space-y-2 rounded-xl border border-ink-200 p-3 dark:border-ink-700">
      <div>
        <p className="text-sm font-medium">{t('cloud.title')}</p>
        <p className="text-xs text-ink-500 dark:text-ink-400">{t('cloud.desc')}</p>
      </div>
      <input
        id="cloud-sync-code"
        ref={codeInputRef}
        value={code}
        onChange={(e) => saveCode(e.target.value.trim().toLowerCase())}
        placeholder={t('cloud.code')}
        aria-label={t('cloud.code')}
        aria-invalid={copyFailed}
        maxLength={32}
        spellCheck={false}
        className={`h-10 w-full rounded-lg border bg-card px-3 font-mono text-sm dark:bg-ink-900 ${copyFailed ? 'border-vermilion-500 ring-2 ring-vermilion-500/30' : 'border-ink-200 dark:border-ink-700'}`}
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" id="cloud-generate" variant="outline" size="sm" onClick={handleGenerate}>
          {t('cloud.generate')}
        </Button>
        <Button type="button" id="cloud-copy" variant="ghost" size="sm" onClick={handleCopy} disabled={!ready}>
          {t('cloud.copy')}
        </Button>
        <Button type="button" id="cloud-upload" variant="outline" size="sm" onClick={() => void handleUpload()} disabled={!ready || busy}>
          {t('cloud.upload')}
        </Button>
        <Button type="button" id="cloud-download" variant="outline" size="sm" onClick={() => void handleDownload()} disabled={!ready || busy}>
          {t('cloud.download')}
        </Button>
      </div>
      <CloudSyncConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen}
        onConfirm={() => void generateAndCopy()} />
    </div>
  );
}
