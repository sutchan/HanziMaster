// src/content/privacy.ts v5.2.59

export interface LegalSection {
  id: string;
  title: string;
  titleEn: string;
  paragraphs: string[];
  paragraphsEn: string[];
}

/**
 * 隐私政策正文。内容严格对应应用实际行为：
 * localStorage 偏好与进度、同意后才加载 GA4、可选的云同步 API（同步码即凭证）、
 * Google Fonts 构建期获取、无账户体系。双语正文并列展示。
 */
export const PRIVACY_UPDATED = '2026-11-23';

export const privacySections: LegalSection[] = [
  {
    id: 'privacy-overview',
    title: '概述',
    titleEn: 'Overview',
    paragraphs: [
      'HanziMaster 汉字大师是本地优先的汉字学习应用。我们没有账户体系；学习进度默认只保存在你的设备上。应用提供一个可选的云同步端点：只有当你主动生成同步码并点击「上传」时，学习进度才会被发送到云端存储。',
      '本政策说明应用在你的设备上保存了什么、在何种条件下加载第三方统计脚本、云同步如何工作，以及你可以如何控制这些数据。',
    ],
    paragraphsEn: [
      'HanziMaster is a local-first Chinese character learning app. There are no accounts; progress stays on your device by default. An optional cloud sync endpoint exists: progress is sent to cloud storage only when you actively generate a sync code and choose "Upload".',
      'This policy describes what is stored on your device, when third-party analytics is loaded, how cloud sync works, and how you control this data.',
    ],
  },
  {
    id: 'privacy-local-storage',
    title: '本地存储',
    titleEn: 'Local Storage',
    paragraphs: [
      '应用使用浏览器 localStorage 保存界面主题（浅色/深色/跟随系统）、界面语言、学习进度（练习记录、连胜天数、正确率、周活动），以及你主动启用的云同步码、PWA 安装提示忽略标记与统计同意状态。',
      '这些数据默认只保存在当前浏览器与当前设备上，不会自动同步。清除浏览器站点数据即可删除本地全部数据；你也可以通过设置中的导入导出功能主动备份或删除进度。',
    ],
    paragraphsEn: [
      'The app uses browser localStorage for theme preference (light/dark/system), interface language, learning progress (practice records, streaks, accuracy, weekly activity), and — if you enable them — your cloud sync code, the PWA install dismissal flag, and analytics consent.',
      'By default this data stays on the current browser and device and is never synced automatically. Clearing site data removes all local data; you can also export, import, or delete progress from Settings.',
    ],
  },
  {
    id: 'privacy-cloud-sync',
    title: '云同步（可选）',
    titleEn: 'Cloud Sync (Optional)',
    paragraphs: [
      '云同步完全自愿：只有当你生成同步码并主动上传时，进度备份才会写入私有云存储。同步码是访问该备份的唯一凭证，等同于密码——任何持有它的人都能读取或覆盖对应进度。请不要公开分享同步码。',
      '同步码仅以 32 位随机十六进制字符串形式存在，不会上传到统计服务；读取请求使用 POST 请求体传递，避免出现在服务器访问日志中。删除同步码仅删除本地凭证，若要彻底清除云端副本，请在更换同步码前联系站点维护者。',
    ],
    paragraphsEn: [
      'Cloud sync is entirely optional: a progress backup is written to private cloud storage only after you generate a sync code and explicitly upload. The sync code is the only credential for that backup, equivalent to a password — anyone holding it can read or overwrite the progress. Do not share it publicly.',
      'The code is a random 32-character hex string and is never sent to analytics. Read requests pass the code in the POST body so it does not appear in server access logs. Removing the code locally does not delete the remote copy.',
    ],
  },
  {
    id: 'privacy-analytics',
    title: '统计与第三方脚本',
    titleEn: 'Analytics and Third-Party Scripts',
    paragraphs: [
      '在未作出选择之前，应用不会加载任何统计脚本。只有在你通过同意横幅明确选择「接受」后，才会加载 Google Analytics 4（脚本来自 Google 的域名），用于了解页面访问与功能使用情况。',
      '你可以随时选择「拒绝」或清除站点数据来撤销同意；撤销后统计脚本不再加载。统计脚本由第三方提供，其数据处理适用 Google 自身的隐私政策。',
      '界面字体由 next/font/google 在构建期获取并由应用自身托管式加载，不用于识别用户。',
    ],
    paragraphsEn: [
      'No analytics script is loaded until you make a choice. Only after you explicitly select "Accept" in the consent banner does the app load Google Analytics 4 from Google domains to understand page visits and feature usage.',
      'You can withdraw consent at any time by choosing "Reject" or clearing site data; after that the analytics script is no longer loaded. Analytics is operated by a third party and subject to Google privacy policy.',
      'Fonts are fetched by next/font/google at build time and are not used to identify users.',
    ],
  },
  {
    id: 'privacy-permissions',
    title: '浏览器能力',
    titleEn: 'Browser Capabilities',
    paragraphs: [
      '书写练习使用 Canvas 与指针事件处理你的笔迹；笔迹仅用于当前页面的即时展示，不会上传。发音功能使用浏览器内置的语音合成能力，由你的设备本地处理。',
      '应用不请求摄像头、麦克风、地理位置或通知权限。',
    ],
    paragraphsEn: [
      'Writing practice uses Canvas and pointer events; strokes are rendered locally and never uploaded. Pronunciation uses the browser built-in speech synthesis on your device.',
      'The app does not request camera, microphone, geolocation, or notification permissions.',
    ],
  },
  {
    id: 'privacy-children',
    title: '儿童与教育用途',
    titleEn: 'Children and Educational Use',
    paragraphs: [
      '本应用面向通用汉字学习，不刻意收集可识别个人身份的信息。若由监护人指导未成年人使用，建议同时检查浏览器与第三方统计设置。',
      '政策更新时我们会修改页面顶部的更新日期。',
    ],
    paragraphsEn: [
      'The app is a general-purpose learning tool and does not intentionally collect personally identifiable information. Guardians supervising minors should review browser and analytics settings as well.',
      'Updates to this policy change the date shown at the top of the page.',
    ],
  },
];
