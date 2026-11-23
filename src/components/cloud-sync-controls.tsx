// src/components/cloud-sync-controls.tsx v5.2.58
// 云同步入口：同步码生成/复制、上传与恢复；localStorage 仍是主存储，云端失败不影响本地进度。
'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import { useToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { safeGetItem, trySetItem } from '@/lib/storage';
import { getDefaultProgress, type ProgressData } from '@/lib/progress-utils';
import { createProgressBackup, parseProgressBackup } from '@/lib/progress-transfer';
import { PROGRESS_STORAGE_KEY, PROGRESS_IMPORTED_EVENT } from '@/hooks/use-progress';
import {
  SYNC_CODE_STORAGE_KEY, generateSyncCode, isSyncCode,
} from '@/lib/cloud-sync';

const readCode = (): string => {
  const saved = safeGetItem<string>(SYNC_CODE_STORAGE_KEY, '');
  return typeof saved === 'string' && isSyncCode(saved) ? saved : '';
};

const hasProgress = (p: ProgressData): boolean =>
  p.learnedCharIds.length > 0 || p.quizResults.length > 0 || Object.keys(p.dailyActivity).length > 0;

export function CloudSyncControls() {
  const { t } = useLocale();
  const toast = useToast();
  const [code, setCode] = useState(readCode);
  const [busy, setBusy] = useState(false);

  const saveCode = (next: string) => {
    setCode(next);
    // 同步码丢失会导致云端数据失去访问入口，写入失败必须提示
    if (!trySetItem(SYNC_CODE_STORAGE_KEY, next)) {
      toast.error(t('common.errorDesc'));
    }
  };

  const handleGenerate = () => {
    // 覆盖已有同步码会让旧云端数据失去访问入口，先确认
    if (isSyncCode(code) && window.confirm && !window.confirm(`${t('cloud.generate')}? ${t('cloud.desc')}`)) return;
    const next = generateSyncCode();
    if (!next) {
      toast.error(t('cloud.failed'));
      return;
    }
    saveCode(next);
    void navigator.clipboard?.writeText(next).catch(() => undefined);
  };

  const handleCopy = () => {
    if (!code) return;
    void navigator.clipboard?.writeText(code).catch(() => undefined);
  };

  // 同步码只经 POST 请求体传递，不进入 URL / 访问日志。
  const request = async (backup?: string) => {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backup === undefined ? { code } : { code, backup }),
    });
    if (response.status === 503) throw new Error('not_configured');
    if (!response.ok) throw new Error('request_failed');
    return response.json() as Promise<{ backup?: string }>;
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
      await request(backup);
      toast.success(t('cloud.uploadDone'));
    } catch (err) {
      toast.error(err instanceof Error && err.message === 'not_configured'
        ? t('cloud.notConfigured') : t('cloud.failed'));
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    if (!isSyncCode(code)) return;
    setBusy(true);
    try {
      const data = await request();
      if (!data.backup) throw new Error('request_failed');
      const progress = parseProgressBackup(data.backup);
      if (!trySetItem(PROGRESS_STORAGE_KEY, progress)) throw new Error('storage_failed');
      window.dispatchEvent(new Event(PROGRESS_IMPORTED_EVENT));
      toast.success(t('cloud.downloadDone'));
    } catch (err) {
      toast.error(err instanceof Error && err.message === 'not_configured'
        ? t('cloud.notConfigured') : t('cloud.failed'));
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
        value={code}
        onChange={(e) => saveCode(e.target.value.trim().toLowerCase())}
        placeholder={t('cloud.code')}
        aria-label={t('cloud.code')}
        maxLength={32}
        spellCheck={false}
        className="h-10 w-full rounded-lg border border-ink-200 bg-card px-3 font-mono text-sm dark:border-ink-700 dark:bg-ink-900"
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
    </div>
  );
}
