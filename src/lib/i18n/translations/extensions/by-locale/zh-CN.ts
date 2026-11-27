// src/lib/i18n/translations/extensions/by-locale/zh-CN.ts v5.3.0
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: '关闭', closeNotification: '关闭通知', notifications: '通知', changeLanguage: '更改语言', selectLanguage: '选择语言' },
    learn: { strokeDemoLabel: '笔顺演示区域' },
    practice: { canvasLabel: '田字格书写画布', keyboardLabel: '笔顺输入（键盘替代路径）', keyboardHint: '按顺序输入笔画编号，例如 1 2 3，用空格或逗号分隔。' },
  },
  cloud: { title: '云同步', desc: '请妥善保管同步码——任何持有它的人都能访问你的学习进度。', code: '同步码', generate: '生成', copy: '复制', upload: '上传到云端', download: '从云端恢复', uploadDone: '进度已上传', downloadDone: '进度已恢复', failed: '云同步失败', notConfigured: '云同步暂不可用', noProgress: '本地暂无可上传的进度', copyFailed: '复制失败——同步码已选中，请按 Ctrl/Cmd+C 手动复制', confirmTitle: '替换当前同步码？', confirmDesc: '生成新同步码后，旧云端进度将无法访问。确定继续吗？', confirmOk: '替换并复制', errors: { notConfigured: '云同步暂不可用', invalidJson: '请求数据格式无效', invalidCode: '同步码无效', invalidBackup: '备份数据无效', rateLimited: '请求过于频繁，请稍后再试', usePost: '云同步请求请使用 POST 方法', notFound: '该同步码暂无云端进度', tooLarge: '备份数据超过大小限制', emptyBackup: '云端备份中没有进度数据', emptyProgress: '拒绝用空进度覆盖云端数据', readFailed: '读取云端进度失败', writeFailed: '写入云端进度失败' } },
  geo: {
    factsTitle: '关于 HanziMaster',
    factsLead:
      'HanziMaster 是面向零基础学习者的免费汉字学习应用，纯前端运行：无需账号，也不上传学习数据。',
    fact1: '12 个基础汉字：一、二、三、人、大、小、口、日、月、山、水、火。',
    fact2: '每个字都有笔顺演示、拼音、词语、例句与田字格书写练习，并配拼音测验。',
    fact3: '支持 11 种界面语言与深色模式；学习进度只保存在本机浏览器，免费使用。',
    faqTitle: '常见问题',
    q1: '需要注册或付费吗？',
    a1: '不需要。HanziMaster 完全免费、无需账号，学习进度保存在浏览器 localStorage 中。',
    q2: '可以学到哪些内容？',
    a2: '12 个基础汉字的字形、拼音、笔顺、词语与例句，以及田字格书写练习和拼音测验。',
    q3: '学习数据会上传或用于 AI 评分吗？',
    a3: '不会。应用没有 AI 评分或服务端学习记录，笔顺是静态 SVG 演示；统计脚本仅在您同意后加载。',
  },
  legal: {
    privacyTitle: '隐私政策', termsTitle: '服务条款',
    privacyLink: '隐私政策', termsLink: '服务条款',
    consentTitle: '统计与隐私',
    consentBody: '仅在您同意后加载统计脚本。详情见隐私政策。',
    accept: '接受', reject: '拒绝',
    disclaimerShort: '仅供学习参考，请以权威字典为准。',
    legalHeading: '法律信息',
  },
  meanings: { one: '一', two: '二', three: '三', person: '人', big: '大', small: '小', mouth: '口', sunDay: '日 / 白天', moonMonth: '月 / 月份', mountain: '山', water: '水', fire: '火' },
  privacy: {
    privacyTitle: '隐私与数据', privacyDesc: '管理本设备上的统计同意状态。',
    withdrawConsent: '撤回统计同意', consentUpdated: '统计同意状态已更新。',
  },
  progress: { exportLabel: '导出学习进度', importLabel: '导入学习进度', importInvalid: '备份文件无效或已损坏', importDone: '学习进度已导入', persistFailed: '学习进度未能保存到当前浏览器，请检查隐私模式或存储空间。' },
  pwa: {
    installTitle: '安装汉字大师',
    installAction: '添加到主屏幕',
    offlineTitle: '当前处于离线状态',
    offlineHint: '联网后即可继续学习；本机保存的学习进度不会丢失。',
  },
  quiz: { correctAnswer: '正确答案' },
  seo: {
    title: 'HanziMaster 汉字大师 — 汉字笔顺与书写练习',
    description:
      '通过笔顺演示、田字格书写与拼音测验学习 12 个基础汉字；免费、无需注册、进度仅存本机，支持 11 种语言。',
    ogTitle: 'HanziMaster 汉字大师',
    ogDescription: '从一笔一划开始，掌握 12 个基础汉字。',
    learnTitle: '学习 12 个基础汉字',
    practiceTitle: '田字格书写练习',
    privacyTitle: '隐私政策',
    termsTitle: '服务条款',
  },
  settings: {
    title: '设置',
    description: '个性化外观、反馈与数据。',
    appearance: '外观',
    language: '语言',
    feedback: '反馈',
    haptics: '震动反馈',
    hapticsDesc: '答对或答错时震动提示',
    motion: '动效',
    reduceMotion: '减少动效',
    reduceMotionDesc: '关闭滚动与界面动画',
    data: '数据',
    resetProgress: '重置学习进度',
    resetDesc: '所有本地学习进度将被永久清除，此操作无法撤销。',
    resetYes: '确认重置',
    resetDone: '学习进度已重置',
  },
};
