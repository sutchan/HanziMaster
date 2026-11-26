// src/lib/i18n/translations/extensions/by-locale/en.ts v5.2.61
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: 'Close', closeNotification: 'Dismiss notification', notifications: 'Notifications', changeLanguage: 'Change language', selectLanguage: 'Select language' },
    learn: { strokeDemoLabel: 'Stroke order demonstration' },
    practice: { canvasLabel: 'Tian-zi-ge writing canvas', keyboardLabel: 'Stroke order (keyboard alternative)', keyboardHint: 'Enter the stroke numbers in order, e.g. 1 2 3, separated by spaces or commas.' },
  },
  cloud: { title: 'Cloud sync', desc: 'Keep your sync code private — anyone with it can access your progress.', code: 'Sync code', generate: 'Generate', copy: 'Copy', upload: 'Upload to cloud', download: 'Restore from cloud', uploadDone: 'Progress uploaded', downloadDone: 'Progress restored', failed: 'Cloud sync failed', notConfigured: 'Cloud sync is not available yet', noProgress: 'No local progress to upload' },
  geo: {
    factsTitle: 'About HanziMaster',
    factsLead:
      'HanziMaster is a free, browser-only app for beginners learning Chinese characters. Everything runs in the browser: no account, no server-side learning data.',
    fact1: '12 foundational characters: 一 二 三 人 大 小 口 日 月 山 水 火.',
    fact2:
      'Each character has stroke-order animations, pinyin, words, example sentences and Tian-zi-ge writing practice, plus pinyin quizzes.',
    fact3:
      '11 interface languages, dark mode, and progress stored only in this browser (localStorage).',
    faqTitle: 'Frequently asked questions',
    q1: 'Do I need an account or have to pay?',
    a1: 'No. HanziMaster is free and requires no account. Learning progress stays in your browser localStorage.',
    q2: 'What can I learn?',
    a2: '12 foundational Chinese characters with stroke order, pinyin, words and example sentences, plus Tian-zi-ge writing practice and pinyin quizzes.',
    q3: 'Is my learning data uploaded or graded by AI?',
    a3: 'No. There is no AI grading or server-side learning record. Stroke order is a static SVG demonstration; analytics load only after you consent.',
  },
  legal: {
    privacyTitle: 'Privacy Policy', termsTitle: 'Terms of Service',
    privacyLink: 'Privacy', termsLink: 'Terms',
    consentTitle: 'Analytics and privacy',
    consentBody: 'Analytics scripts load only after you accept. See the Privacy Policy for details.',
    accept: 'Accept', reject: 'Reject',
    disclaimerShort: 'For learning reference; verify with authoritative dictionaries.',
    legalHeading: 'Legal',
  },
  meanings: { one: 'one', two: 'two', three: 'three', person: 'person', big: 'big', small: 'small', mouth: 'mouth', sunDay: 'sun / day', moonMonth: 'moon / month', mountain: 'mountain', water: 'water', fire: 'fire' },
  privacy: {
    privacyTitle: 'Privacy & Data', privacyDesc: 'Manage analytics consent for this device.',
    withdrawConsent: 'Withdraw analytics consent', consentUpdated: 'Analytics consent updated.',
  },
  progress: { exportLabel: 'Export progress', importLabel: 'Import progress', importInvalid: 'Invalid or corrupted backup file', importDone: 'Progress imported successfully', persistFailed: 'Progress could not be saved in this browser. Check private mode or storage space.' },
  pwa: {
    installTitle: 'Install HanziMaster',
    installAction: 'Add to home screen',
    offlineTitle: 'You are offline',
    offlineHint: 'Reconnect to continue; your local learning progress is still saved on this device.',
  },
  quiz: { correctAnswer: 'Correct answer' },
  seo: {
    title: 'HanziMaster — Learn Chinese Characters with Stroke Order',
    description:
      'Learn 12 foundational Chinese characters with stroke-order animations, Tian-zi-ge writing practice, pinyin quizzes and local progress. Free, no account, 11 languages.',
    ogTitle: 'HanziMaster 汉字大师',
    ogDescription: 'Master 12 foundational Chinese characters, one stroke at a time.',
    learnTitle: 'Learn 12 Chinese Characters',
    practiceTitle: 'Chinese Handwriting Practice',
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Service',
  },
  settings: {
    title: 'Settings',
    description: 'Personalize appearance, feedback and data.',
    appearance: 'Appearance',
    language: 'Language',
    feedback: 'Feedback',
    haptics: 'Vibration feedback',
    hapticsDesc: 'Vibrate on correct and incorrect answers',
    motion: 'Motion',
    reduceMotion: 'Reduce motion',
    reduceMotionDesc: 'Turn off scroll and interface animations',
    data: 'Data',
    resetProgress: 'Reset learning progress',
    resetDesc: 'All local learning progress will be permanently removed. This cannot be undone.',
    resetYes: 'Yes, reset',
    resetDone: 'Learning progress has been reset',
  },
};
