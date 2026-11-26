// src/lib/i18n/translations/extensions/by-locale/de.ts v5.2.61
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: 'Schließen', closeNotification: 'Benachrichtigung schließen', notifications: 'Benachrichtigungen', changeLanguage: 'Sprache ändern', selectLanguage: 'Sprache auswählen' },
    learn: { strokeDemoLabel: 'Demonstration der Strichfolge' },
    practice: { canvasLabel: 'Schreibfläche', keyboardLabel: 'Strichfolge (Tastaturalternative)', keyboardHint: 'Strichnummern in der richtigen Reihenfolge eingeben, z. B. 1 2 3, getrennt durch Leerzeichen oder Kommas.' },
  },
  cloud: { title: 'Cloud-Synchronisierung', desc: 'Halte deinen Code geheim — jeder damit kann auf deinen Fortschritt zugreifen.', code: 'Synchronisierungscode', generate: 'Erzeugen', copy: 'Kopieren', upload: 'In die Cloud hochladen', download: 'Aus der Cloud wiederherstellen', uploadDone: 'Fortschritt hochgeladen', downloadDone: 'Fortschritt wiederhergestellt', failed: 'Synchronisierung fehlgeschlagen', notConfigured: 'Synchronisierung nicht verfügbar', noProgress: 'Kein lokaler Fortschritt zum Hochladen' },
  geo: {
    factsTitle: 'Über HanziMaster',
    factsLead:
      'HanziMaster ist eine kostenlose, reine Browser-App für Einsteiger in chinesische Zeichen. Ohne Konto und ohne serverseitige Lerndaten.',
    fact1: '12 grundlegende Zeichen: 一 二 三 人 大 小 口 日 月 山 水 火.',
    fact2:
      'Zu jedem Zeichen gibt es Strichfolgen-Animationen, Pinyin, Wörter, Beispielsätze und Tian-zi-ge-Schreibübungen sowie Pinyin-Quiz.',
    fact3:
      '11 Oberflächensprachen, Dunkelmodus und Fortschritt ausschließlich im localStorage dieses Browsers.',
    faqTitle: 'Häufige Fragen',
    q1: 'Brauche ich ein Konto oder muss ich bezahlen?',
    a1: 'Nein. HanziMaster ist kostenlos und ohne Konto nutzbar. Der Fortschritt bleibt im localStorage deines Browsers.',
    q2: 'Was kann ich lernen?',
    a2: '12 grundlegende chinesische Zeichen mit Strichfolge, Pinyin, Wörtern und Beispielsätzen, plus Tian-zi-ge-Schreibübung und Pinyin-Quiz.',
    q3: 'Werden Lerndaten hochgeladen oder von einer KI bewertet?',
    a3: 'Nein. Es gibt keine KI-Bewertung und keine serverseitige Lernhistorie. Die Strichfolge ist eine statische SVG-Demonstration; Statistik-Skripte laden nur nach Zustimmung.',
  },
  legal: {
    privacyTitle: 'Datenschutzerklärung', termsTitle: 'Nutzungsbedingungen',
    privacyLink: 'Datenschutz', termsLink: 'Nutzungsbedingungen',
    consentTitle: 'Analyse und Datenschutz',
    consentBody: 'Analyse-Skripte werden erst nach Ihrer Zustimmung geladen. Siehe Datenschutzerklärung.',
    accept: 'Akzeptieren', reject: 'Ablehnen',
    disclaimerShort: 'Nur zu Lernzwecken; mit maßgeblichen Wörterbüchern prüfen.',
    legalHeading: 'Rechtliches',
  },
  meanings: { one: 'eins', two: 'zwei', three: 'drei', person: 'Mensch', big: 'groß', small: 'klein', mouth: 'Mund', sunDay: 'Sonne / Tag', moonMonth: 'Mond / Monat', mountain: 'Berg', water: 'Wasser', fire: 'Feuer' },
  privacy: {
    privacyTitle: 'Datenschutz & Daten', privacyDesc: 'Verwalte die Analyse-Zustimmung auf diesem Gerät.',
    withdrawConsent: 'Analyse-Zustimmung widerrufen', consentUpdated: 'Analyse-Zustimmung aktualisiert.',
  },
  progress: { exportLabel: 'Fortschritt exportieren', importLabel: 'Fortschritt importieren', importInvalid: 'Ungültige oder beschädigte Sicherungsdatei', importDone: 'Fortschritt erfolgreich importiert', persistFailed: 'Der Fortschritt konnte in diesem Browser nicht gespeichert werden. Prüfen Sie den privaten Modus oder den Speicherplatz.' },
  pwa: {
    installTitle: 'HanziMaster installieren',
    installAction: 'Zum Startbildschirm hinzufügen',
    offlineTitle: 'Sie sind offline',
    offlineHint: 'Verbinden Sie sich erneut, um fortzufahren; Ihr lokaler Lernfortschritt bleibt auf diesem Gerät gespeichert.',
  },
  quiz: { correctAnswer: 'Richtige Antwort' },
  seo: {
    title: 'HanziMaster — Chinesische Zeichen mit Strichfolge lernen',
    description:
      'Lerne 12 grundlegende chinesische Zeichen mit Strichfolgen-Animationen, Tian-zi-ge-Schreibübung, Pinyin-Quiz und lokalem Fortschritt. Kostenlos, ohne Konto, 11 Sprachen.',
    ogTitle: 'HanziMaster 汉字大师',
    ogDescription: '12 grundlegende Zeichen, Strich für Strich meistern.',
    learnTitle: '12 chinesische Zeichen lernen',
    practiceTitle: 'Chinesische Schreibübung',
    privacyTitle: 'Datenschutzerklärung',
    termsTitle: 'Nutzungsbedingungen',
  },
  settings: {
    title: 'Einstellungen',
    description: 'Erscheinungsbild, Feedback und Daten anpassen.',
    appearance: 'Darstellung',
    language: 'Sprache',
    feedback: 'Feedback',
    haptics: 'Vibrationsfeedback',
    hapticsDesc: 'Bei richtigen und falschen Antworten vibrieren',
    motion: 'Bewegung',
    reduceMotion: 'Bewegung reduzieren',
    reduceMotionDesc: 'Scroll- und Oberflächenanimationen deaktivieren',
    data: 'Daten',
    resetProgress: 'Lernfortschritt zurücksetzen',
    resetDesc: 'Der gesamte lokale Lernfortschritt wird dauerhaft gelöscht. Dies kann nicht rückgängig gemacht werden.',
    resetYes: 'Ja, zurücksetzen',
    resetDone: 'Lernfortschritt wurde zurückgesetzt',
  },
};
