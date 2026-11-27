// src/lib/i18n/translations/extensions/by-locale/types.ts v5.3.0
// 单语言扩展片段的聚合类型：仅 type import，不引入任何运行时语言数据。
import type { A11yTexts } from '../a11y';
import type { CloudTexts } from '../cloud';
import type { GeoTexts } from '../geo';
import type { LegalTexts } from '../legal';
import type { MeaningTexts } from '../meanings';
import type { PrivacyTexts } from '../privacy';
import type { ProgressTexts } from '../progress';
import type { PwaTexts } from '../pwa';
import type { QuizText } from '../quiz';
import type { SeoTexts } from '../seo';
import type { SettingsTexts } from '../settings';

/** 一个 locale 所需的全部扩展文案；键与 extendTranslations 的合并逻辑一一对应。 */
export interface LocaleExtensions {
  a11y: A11yTexts;
  cloud: CloudTexts;
  geo: GeoTexts;
  legal: LegalTexts;
  meanings: MeaningTexts;
  privacy: PrivacyTexts;
  progress: ProgressTexts;
  pwa: PwaTexts;
  quiz: QuizText;
  seo: SeoTexts;
  settings: SettingsTexts;
}
