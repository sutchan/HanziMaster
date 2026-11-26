// src/lib/i18n/translations/extensions/by-locale/ja.ts v5.2.61
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: '閉じる', closeNotification: '通知を閉じる', notifications: '通知', changeLanguage: '言語を変更', selectLanguage: '言語を選択' },
    learn: { strokeDemoLabel: '筆順デモ領域' },
    practice: { canvasLabel: '田字格・書き込みキャンバス', keyboardLabel: '筆順入力（キーボード代替）', keyboardHint: '筆画番号を順に入力してください（例：1 2 3）。スペースまたはカンマで区切ります。' },
  },
  cloud: { title: 'クラウド同期', desc: '同期コードは秘密にしてください。知る人は誰でも進捗にアクセスできます。', code: '同期コード', generate: '生成', copy: 'コピー', upload: 'クラウドにアップロード', download: 'クラウドから復元', uploadDone: '進捗をアップロードしました', downloadDone: '進捗を復元しました', failed: '同期に失敗しました', notConfigured: 'クラウド同期は利用できません', noProgress: 'アップロードするローカル進捗がありません', copyFailed: 'コピーできませんでした。同期コードを選択したので、Ctrl/Cmd+C で手動コピーしてください', confirmTitle: '現在の同期コードを置き換えますか？', confirmDesc: '新しいコードを生成すると、旧コードのクラウド進捗にアクセスできなくなります。続けますか？', confirmOk: '置き換えてコピー', errors: { notConfigured: 'クラウド同期は利用できません', invalidJson: 'リクエストデータが無効です', invalidCode: '同期コードが無効です', invalidBackup: 'バックアップデータが無効です', rateLimited: 'リクエストが多すぎます。しばらくしてからお試しください', usePost: '同期リクエストには POST を使用してください', notFound: 'このコードのクラウド進捗はありません', tooLarge: 'バックアップがサイズ上限を超えています', emptyBackup: 'クラウドバックアップに進捗がありません', emptyProgress: '空のデータでクラウド進捗を上書きできません', readFailed: 'クラウド進捗の読み取りに失敗しました', writeFailed: 'クラウド進捗の書き込みに失敗しました' } },
  geo: {
    factsTitle: 'HanziMaster について',
    factsLead:
      'HanziMaster は初めて漢字を学ぶ人向けの無料ブラウザアプリです。すべてブラウザ内で動作し、アカウントも学習データの送信も不要です。',
    fact1: '基礎漢字 12 字：一 二 三 人 大 小 口 日 月 山 水 火。',
    fact2:
      '各字に筆順演示、ピンイン、語句、例文、田字格の書写練習を用意し、ピンインクイズもあります。',
    fact3:
      '11 言語のインターフェースと深色モードに対応。進捗はこのブラウザの localStorage にのみ保存されます。',
    faqTitle: 'よくある質問',
    q1: '登録や料金は必要ですか？',
    a1: '不要です。HanziMaster は無料でアカウント不要、学習進捗はブラウザの localStorage に保存されます。',
    q2: '何を学べますか？',
    a2: '基礎漢字 12 字の字形・ピンイン・筆順・語句・例文に加え、田字格の書写練習とピンインクイズを学べます。',
    q3: '学習データは送信されますか？AI が採点しますか？',
    a3: 'いいえ。AI 採点やサーバー側の学習記録はありません。筆順は静的 SVG 演示で、統計スクリプトは同意後のみ読み込まれます。',
  },
  legal: {
    privacyTitle: 'プライバシーポリシー', termsTitle: '利用規約',
    privacyLink: 'プライバシー', termsLink: '利用規約',
    consentTitle: '解析とプライバシー',
    consentBody: '同意いただいた場合のみ解析スクリプトを読み込みます。詳細はプライバシーポリシーをご覧ください。',
    accept: '同意する', reject: '拒否する',
    disclaimerShort: '学習参考用です。権威ある辞書でご確認ください。',
    legalHeading: '法務情報',
  },
  meanings: { one: '一', two: '二', three: '三', person: '人', big: '大きい', small: '小さい', mouth: '口', sunDay: '日 / 太阳', moonMonth: '月 / 月', mountain: '山', water: '水', fire: '火' },
  privacy: {
    privacyTitle: 'プライバシーとデータ', privacyDesc: 'この端末の統計同意を管理します。',
    withdrawConsent: '統計同意を取り消す', consentUpdated: '統計同意を更新しました。',
  },
  progress: { exportLabel: '学習進捗をエクスポート', importLabel: '学習進捗をインポート', importInvalid: 'バックアップファイルが無効または破損しています', importDone: '学習進捗をインポートしました', persistFailed: 'このブラウザに進捗を保存できませんでした。プライベートモードや保存容量を確認してください。' },
  pwa: {
    installTitle: '漢字マスターをインストール',
    installAction: 'ホーム画面に追加',
    offlineTitle: 'オフラインです',
    offlineHint: '接続後に学習を再開できます。端末内の学習進捗は保持されています。',
  },
  quiz: { correctAnswer: '正解' },
  seo: {
    title: 'HanziMaster 漢字大師 — 漢字の筆順と書写練習',
    description:
      '筆順アニメーション、田字格の書写、ピンインクイズで基礎漢字 12 字を学習。無料・登録不要・進捗は端末内のみ、11 言語対応。',
    ogTitle: 'HanziMaster 漢字大師',
    ogDescription: '一画ずつ、基礎漢字 12 字を身につける。',
    learnTitle: '基礎漢字 12 字を学ぶ',
    practiceTitle: '漢字の書写練習',
    privacyTitle: 'プライバシーポリシー',
    termsTitle: '利用規約',
  },
  settings: {
    title: '設定',
    description: '外観・フィードバック・データをカスタマイズします。',
    appearance: '外観',
    language: '言語',
    feedback: 'フィードバック',
    haptics: 'バイブレーション',
    hapticsDesc: '正解・不正解時に振動します',
    motion: 'モーション',
    reduceMotion: '動きを減らす',
    reduceMotionDesc: 'スクロールや画面のアニメーションをオフにします',
    data: 'データ',
    resetProgress: '学習進捗をリセット',
    resetDesc: 'ローカルの学習進捗はすべて完全に消去され、元に戻せません。',
    resetYes: 'リセットする',
    resetDone: '学習進捗をリセットしました',
  },
};
