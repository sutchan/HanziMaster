// src/lib/i18n/translations/extensions/by-locale/fr.ts v5.3.0
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: 'Fermer', closeNotification: 'Fermer la notification', notifications: 'Notifications', changeLanguage: 'Changer de langue', selectLanguage: 'Choisir la langue' },
    learn: { strokeDemoLabel: 'Démonstration de l’ordre des traits' },
    practice: { canvasLabel: 'Zone d’écriture', keyboardLabel: 'Ordre des traits (alternative clavier)', keyboardHint: 'Saisissez les numéros de traits dans l’ordre, p. ex. 1 2 3, séparés par des espaces ou des virgules.' },
  },
  cloud: { title: 'Synchronisation cloud', desc: 'Gardez votre code privé — toute personne le connaissant peut accéder à votre progression.', code: 'Code de synchronisation', generate: 'Générer', copy: 'Copier', upload: 'Envoyer vers le cloud', download: 'Restaurer depuis le cloud', uploadDone: 'Progression envoyée', downloadDone: 'Progression restaurée', failed: 'Échec de la synchronisation', notConfigured: 'Synchronisation indisponible', noProgress: 'Aucune progression locale à envoyer', copyFailed: 'Copie impossible — le code est sélectionné, appuyez sur Ctrl/Cmd+C pour le copier manuellement', confirmTitle: 'Remplacer le code de synchronisation actuel ?', confirmDesc: 'Un nouveau code rendra la progression cloud précédente inaccessible. Continuer ?', confirmOk: 'Remplacer et copier', errors: { notConfigured: 'Synchronisation indisponible', invalidJson: 'Données de requête invalides', invalidCode: 'Code de synchronisation invalide', invalidBackup: 'Sauvegarde invalide', rateLimited: 'Trop de requêtes, réessayez plus tard', usePost: 'Utilisez POST pour les requêtes de synchronisation', notFound: 'Aucune progression cloud pour ce code', tooLarge: 'La sauvegarde dépasse la taille maximale', emptyBackup: 'La sauvegarde cloud ne contient aucune progression', emptyProgress: 'Refus d’écraser la progression cloud avec des données vides', readFailed: 'Échec de la lecture de la progression cloud', writeFailed: 'Échec de l’écriture de la progression cloud' } },
  geo: {
    factsTitle: 'À propos de HanziMaster',
    factsLead:
      'HanziMaster est une application gratuite, entièrement dans le navigateur, pour débuter l’apprentissage des caractères chinois. Sans compte ni données d’apprentissage sur un serveur.',
    fact1: '12 caractères fondamentaux : 一 二 三 人 大 小 口 日 月 山 水 火.',
    fact2:
      'Chaque caractère propose l’animation de l’ordre des traits, le pinyin, des mots, des phrases d’exemple et l’écriture sur grille Tian-zi-ge, avec des quiz de pinyin.',
    fact3:
      '11 langues d’interface, mode sombre et progression stockée uniquement dans ce navigateur (localStorage).',
    faqTitle: 'Questions fréquentes',
    q1: 'Faut-il un compte ou payer ?',
    a1: 'Non. HanziMaster est gratuit et sans compte. La progression reste dans le localStorage de votre navigateur.',
    q2: 'Que peut-on apprendre ?',
    a2: '12 caractères chinois fondamentaux avec ordre des traits, pinyin, mots et phrases d’exemple, plus l’écriture Tian-zi-ge et des quiz de pinyin.',
    q3: 'Mes données sont-elles envoyées ou notées par une IA ?',
    a3: 'Non. Aucune notation par IA ni historique d’apprentissage sur serveur. L’ordre des traits est une démonstration SVG statique ; les statistiques ne se chargent qu’après consentement.',
  },
  legal: {
    privacyTitle: 'Politique de confidentialité', termsTitle: "Conditions d'utilisation",
    privacyLink: 'Confidentialité', termsLink: 'Conditions',
    consentTitle: 'Statistiques et confidentialité',
    consentBody: 'Les scripts de mesure ne se chargent qu’après votre accord. Voir la politique de confidentialité.',
    accept: 'Accepter', reject: 'Refuser',
    disclaimerShort: 'À titre pédagogique ; vérifiez avec des dictionnaires de référence.',
    legalHeading: 'Mentions légales',
  },
  meanings: { one: 'un', two: 'deux', three: 'trois', person: 'personne', big: 'grand', small: 'petit', mouth: 'bouche', sunDay: 'soleil / jour', moonMonth: 'lune / mois', mountain: 'montagne', water: 'eau', fire: 'feu' },
  privacy: {
    privacyTitle: 'Confidentialité et données', privacyDesc: 'Gérez le consentement aux statistiques sur cet appareil.',
    withdrawConsent: 'Retirer le consentement aux statistiques', consentUpdated: 'Consentement aux statistiques mis à jour.',
  },
  progress: { exportLabel: 'Exporter la progression', importLabel: 'Importer la progression', importInvalid: 'Fichier de sauvegarde invalide ou corrompu', importDone: 'Progression importée avec succès', persistFailed: 'Impossible d’enregistrer la progression dans ce navigateur. Vérifiez le mode privé ou l’espace de stockage.' },
  pwa: {
    installTitle: 'Installer HanziMaster',
    installAction: 'Ajouter à l’écran d’accueil',
    offlineTitle: 'Vous êtes hors ligne',
    offlineHint: 'Reconnectez-vous pour continuer ; votre progression locale reste enregistrée sur cet appareil.',
  },
  quiz: { correctAnswer: 'Bonne réponse' },
  seo: {
    title: 'HanziMaster — Apprendre les caractères chinois et l’ordre des traits',
    description:
      'Apprenez 12 caractères chinois fondamentaux avec animations de traits, écriture sur grille Tian-zi-ge, quiz pinyin et suivi local. Gratuit, sans compte, 11 langues.',
    ogTitle: 'HanziMaster 汉字大师',
    ogDescription: 'Maîtrisez 12 caractères chinois fondamentaux, trait après trait.',
    learnTitle: 'Apprendre 12 caractères chinois',
    practiceTitle: 'Pratique de l’écriture chinoise',
    privacyTitle: 'Politique de confidentialité',
    termsTitle: 'Conditions d’utilisation',
  },
  settings: {
    title: 'Paramètres',
    description: 'Personnalisez l’apparence, les retours et les données.',
    appearance: 'Apparence',
    language: 'Langue',
    feedback: 'Retours',
    haptics: 'Retour haptique',
    hapticsDesc: 'Vibre en cas de bonne ou mauvaise réponse',
    motion: 'Animations',
    reduceMotion: 'Réduire les animations',
    reduceMotionDesc: 'Désactive les animations de défilement et d’interface',
    data: 'Données',
    resetProgress: 'Réinitialiser la progression',
    resetDesc: 'Toute la progression locale sera définitivement effacée. Action irréversible.',
    resetYes: 'Oui, réinitialiser',
    resetDone: 'Progression réinitialisée',
  },
};
