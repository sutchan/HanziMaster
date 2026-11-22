// src/lib/seo-metadata.ts v5.2.58
// 子页面共享的服务端 metadata：标题按语言取，canonical / hreflang / OG 由根 layout 统一生成。
import { cookies, headers } from 'next/headers';
import type { Metadata } from 'next';
import { LOCALE_COOKIE, resolveLocale } from './request-locale';
import { seoByLocale } from '@/lib/i18n/translations/extensions/seo';

export type PageSeoKey = 'learnTitle' | 'practiceTitle' | 'privacyTitle' | 'termsTitle';

export async function getPageSeo(key: PageSeoKey): Promise<Metadata> {
  // 与 layout.tsx 的 requestContext 同构：proxy 头缺失时按 cookie 回退，避免标题语言与 html lang 分叉
  const [requestHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const locale = resolveLocale(requestHeaders, cookieStore.get(LOCALE_COOKIE)?.value);
  const seo = seoByLocale[locale] ?? seoByLocale.en;
  return { title: seo[key], description: seo.description };
}
