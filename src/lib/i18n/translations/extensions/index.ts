// src/lib/i18n/translations/extensions/index.ts v5.3.0
// 扩展合并逻辑：只接收已加载的单语言片段，避免静态导入全部语言扩展（OPT-02）。
import type { LocaleExtensions } from './by-locale/types';
import { extensions as enExtensions } from './by-locale/en';

/** 基准语言包结构；扩展模块单独成文件，避免任一语言文件超过 200 行。 */
type BaseTranslations = typeof import('../en').en;

/**
 * 把合规、无障碍、汉字释义、设置、SEO 与 GEO 扩展合并进基准语言包。
 * 默认使用英文片段（首屏兜底）；其余语言由 loadTranslations 动态导入后显式传入。
 * locale 参数保留给既有调用方，叶子键集合由同一函数保证一致（i18n.test.ts 校验）。
 */
export function extendTranslations(
  base: BaseTranslations,
  locale: string,
  ext: LocaleExtensions = enExtensions,
) {
  void locale;
  return {
    ...base,
    seo: ext.seo,
    geo: ext.geo,
    pwa: ext.pwa,
    progress: ext.progress,
    cloud: ext.cloud,
    common: { ...base.common, ...ext.a11y.common },
    learn: { ...base.learn, strokeDemoLabel: ext.a11y.learn.strokeDemoLabel },
    practice: {
      ...base.practice,
      canvasLabel: ext.a11y.practice.canvasLabel,
      keyboardLabel: ext.a11y.practice.keyboardLabel,
      keyboardHint: ext.a11y.practice.keyboardHint,
      correctAnswer: ext.quiz.correctAnswer,
      meanings: ext.meanings,
    },
    settings: { ...ext.settings, ...ext.privacy },
    legal: ext.legal,
  };
}
