// src/app/error.tsx v5.2.58
'use client';

import { useEffect } from 'react';
import { captureException } from '@sentry/nextjs';
import { ErrorState } from '@/components/state/state-views';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('页面级错误边界捕获异常', { error, digest: error.digest });
    // 与 learn / practice / global-error 边界一致：生产环境上报，避免根段异常从 Sentry 丢失
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      captureException(error);
    }
  }, [error]);

  return <ErrorState className="min-h-[60vh]" onRetry={reset} />;
}
