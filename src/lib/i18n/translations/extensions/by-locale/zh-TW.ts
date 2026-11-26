// src/lib/i18n/translations/extensions/by-locale/zh-TW.ts v5.2.61
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: '關閉', closeNotification: '關閉通知', notifications: '通知', changeLanguage: '變更語言', selectLanguage: '選擇語言' },
    learn: { strokeDemoLabel: '筆順示範區域' },
    practice: { canvasLabel: '田字格書寫畫布', keyboardLabel: '筆順輸入（鍵盤替代路徑）', keyboardHint: '依序輸入筆畫編號，例如 1 2 3，以空格或逗號分隔。' },
  },
  cloud: { title: '雲端同步', desc: '請妥善保管同步碼——任何持有它的人都能存取你的學習進度。', code: '同步碼', generate: '產生', copy: '複製', upload: '上傳到雲端', download: '從雲端還原', uploadDone: '進度已上傳', downloadDone: '進度已還原', failed: '雲端同步失敗', notConfigured: '雲端同步暫不可用', noProgress: '本機暫無可上傳的進度' },
  geo: {
    factsTitle: '關於 HanziMaster',
    factsLead:
      'HanziMaster 是面向零基礎學習者的免費漢字學習應用，純前端執行：不需帳號，也不上傳學習資料。',
    fact1: '12 個基礎漢字：一、二、三、人、大、小、口、日、月、山、水、火。',
    fact2: '每個字都有筆順演示、拼音、詞語、例句與田字格書寫練習，並附拼音測驗。',
    fact3: '支援 11 種介面語言與深色模式；學習進度只存於本機瀏覽器，免費使用。',
    faqTitle: '常見問題',
    q1: '需要註冊或付費嗎？',
    a1: '不需要。HanziMaster 完全免費、無需帳號，學習進度儲存在瀏覽器 localStorage 中。',
    q2: '可以學到哪些內容？',
    a2: '12 個基礎漢字的字形、拼音、筆順、詞語與例句，以及田字格書寫練習和拼音測驗。',
    q3: '學習資料會上傳或用於 AI 評分嗎？',
    a3: '不會。應用沒有 AI 評分或伺服端學習紀錄，筆順是靜態 SVG 演示；統計指令碼僅在您同意後載入。',
  },
  legal: {
    privacyTitle: '隱私權政策', termsTitle: '服務條款',
    privacyLink: '隱私權政策', termsLink: '服務條款',
    consentTitle: '統計與隱私',
    consentBody: '僅在您同意後載入統計指令碼。詳情見隱私權政策。',
    accept: '接受', reject: '拒絕',
    disclaimerShort: '僅供學習參考，請以權威字典為準。',
    legalHeading: '法律資訊',
  },
  meanings: { one: '一', two: '二', three: '三', person: '人', big: '大', small: '小', mouth: '口', sunDay: '日 / 白天', moonMonth: '月 / 月份', mountain: '山', water: '水', fire: '火' },
  privacy: {
    privacyTitle: '隱私與資料', privacyDesc: '管理此裝置上的統計同意狀態。',
    withdrawConsent: '撤回統計同意', consentUpdated: '統計同意狀態已更新。',
  },
  progress: { exportLabel: '匯出學習進度', importLabel: '匯入學習進度', importInvalid: '備份檔案無效或已損壞', importDone: '學習進度已匯入', persistFailed: '學習進度無法儲存至目前瀏覽器，請檢查隱私模式或儲存空間。' },
  pwa: {
    installTitle: '安裝漢字大師',
    installAction: '加入主畫面',
    offlineTitle: '目前處於離線狀態',
    offlineHint: '連線後即可繼續學習；本機儲存的學習進度不會遺失。',
  },
  quiz: { correctAnswer: '正確答案' },
  seo: {
    title: 'HanziMaster 漢字大師 — 漢字筆順與書寫練習',
    description:
      '透過筆順演示、田字格書寫與拼音測驗學習 12 個基礎漢字；免費、免註冊、進度只存本機，支援 11 種語言。',
    ogTitle: 'HanziMaster 漢字大師',
    ogDescription: '從一筆一劃開始，掌握 12 個基礎漢字。',
    learnTitle: '學習 12 個基礎漢字',
    practiceTitle: '田字格書寫練習',
    privacyTitle: '隱私政策',
    termsTitle: '服務條款',
  },
  settings: {
    title: '設定',
    description: '個人化外觀、回饋與資料。',
    appearance: '外觀',
    language: '語言',
    feedback: '回饋',
    haptics: '震動回饋',
    hapticsDesc: '答對或答錯時震動提示',
    motion: '動態效果',
    reduceMotion: '減少動態效果',
    reduceMotionDesc: '關閉捲動與介面動畫',
    data: '資料',
    resetProgress: '重設學習進度',
    resetDesc: '所有本機學習進度將被永久清除，此操作無法復原。',
    resetYes: '確認重設',
    resetDone: '學習進度已重設',
  },
};
