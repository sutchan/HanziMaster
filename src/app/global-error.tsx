// src/app/global-error.tsx v5.2.58
'use client';

import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { DEFAULT_LOCALE, isRtlLocale, isSupportedLocale, type SupportedLocale } from '@/lib/site';

/** 根级错误边界：必须自带 html/body，且不依赖任何 Provider。 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 根错误边界不套 Provider：初始值与全站默认语言一致，再由 html lang / cookie 恢复，避免 RTL 用户看到 LTR 错误页
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      captureException(error);
    }
    try {
      const fromDocument = document.documentElement.lang;
      const raw = document.cookie.match(/(?:^|;\s*)hanzi-master-locale=([^;]+)/)?.[1];
      const fromCookie = raw ? decodeURIComponent(raw) : '';
      if (isSupportedLocale(fromDocument)) setLocale(fromDocument);
      else if (isSupportedLocale(fromCookie)) setLocale(fromCookie);
    } catch {
      // cookie 值畸形时保留默认语言
    }
  }, [error]);

  return (
    <html lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}>
      <body id="global-error-body" className="flex min-h-screen items-center justify-center bg-white p-6 text-slate-900">
        <div id="global-error-panel" role="alert" className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">应用出现错误</h1>
          <p lang="en" className="mt-2 text-sm text-slate-600">Something went wrong.</p>
          <button
            id="global-error-retry"
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-rose-600 px-5 py-2 text-sm text-white"
          >
            重试 / Retry
          </button>
        </div>
      </body>
    </html>
  );
}
