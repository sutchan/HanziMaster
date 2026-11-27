// src/lib/i18n/translations/extensions/by-locale/es.ts v5.3.0
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: 'Cerrar', closeNotification: 'Cerrar notificación', notifications: 'Notificaciones', changeLanguage: 'Cambiar idioma', selectLanguage: 'Seleccionar idioma' },
    learn: { strokeDemoLabel: 'Demostración del orden de trazos' },
    practice: { canvasLabel: 'Lienzo de escritura', keyboardLabel: 'Orden de trazos (alternativa de teclado)', keyboardHint: 'Escribe los números de trazo en orden, p. ej. 1 2 3, separados por espacios o comas.' },
  },
  cloud: { title: 'Sincronización en la nube', desc: 'Mantén tu código privado: cualquiera que lo tenga puede acceder a tu progreso.', code: 'Código de sincronización', generate: 'Generar', copy: 'Copiar', upload: 'Subir a la nube', download: 'Restaurar desde la nube', uploadDone: 'Progreso subido', downloadDone: 'Progreso restaurado', failed: 'Error de sincronización', notConfigured: 'Sincronización no disponible', noProgress: 'No hay progreso local para subir', copyFailed: 'No se pudo copiar: el código está seleccionado, pulsa Ctrl/Cmd+C para copiarlo manualmente', confirmTitle: '¿Reemplazar el código de sincronización actual?', confirmDesc: 'Un código nuevo dejará inaccessible el progreso anterior en la nube. ¿Continuar?', confirmOk: 'Reemplazar y copiar', errors: { notConfigured: 'Sincronización no disponible', invalidJson: 'Datos de solicitud no válidos', invalidCode: 'Código de sincronización no válido', invalidBackup: 'Copia de seguridad no válida', rateLimited: 'Demasiadas solicitudes; inténtalo de nuevo más tarde', usePost: 'Usa POST para las solicitudes de sincronización', notFound: 'No hay progreso en la nube para este código', tooLarge: 'La copia supera el límite de tamaño', emptyBackup: 'La copia en la nube no contiene progreso', emptyProgress: 'No se puede sobrescribir con datos vacíos', readFailed: 'No se pudo leer el progreso en la nube', writeFailed: 'No se pudo escribir el progreso en la nube' } },
  geo: {
    factsTitle: 'Acerca de HanziMaster',
    factsLead:
      'HanziMaster es una aplicación gratuita que funciona solo en el navegador para quienes empiezan a aprender caracteres chinos. Sin cuenta y sin datos de aprendizaje en un servidor.',
    fact1: '12 caracteres fundamentales: 一 二 三 人 大 小 口 日 月 山 水 火.',
    fact2:
      'Cada carácter incluye animación del orden de trazos, pinyín, palabras, frases de ejemplo y práctica de escritura en cuadrícula Tian-zi-ge, además de cuestionarios de pinyín.',
    fact3:
      '11 idiomas de interfaz, modo oscuro y progreso guardado únicamente en este navegador (localStorage).',
    faqTitle: 'Preguntas frecuentes',
    q1: '¿Necesito una cuenta o pagar?',
    a1: 'No. HanziMaster es gratuito y no requiere cuenta. El progreso se guarda en el localStorage de tu navegador.',
    q2: '¿Qué puedo aprender?',
    a2: '12 caracteres chinos fundamentales con orden de trazos, pinyín, palabras y frases de ejemplo, además de escritura en Tian-zi-ge y cuestionarios de pinyín.',
    q3: '¿Se suben mis datos o los evalúa una IA?',
    a3: 'No. No hay evaluación por IA ni registros de aprendizaje en un servidor. El orden de trazos es una demostración SVG estática; las estadísticas solo cargan si das tu consentimiento.',
  },
  legal: {
    privacyTitle: 'Política de privacidad', termsTitle: 'Términos del servicio',
    privacyLink: 'Privacidad', termsLink: 'Términos',
    consentTitle: 'Analítica y privacidad',
    consentBody: 'Los scripts de analítica se cargan solo si aceptas. Consulta la política de privacidad.',
    accept: 'Aceptar', reject: 'Rechazar',
    disclaimerShort: 'Solo para aprendizaje; verifica con diccionarios autorizados.',
    legalHeading: 'Información legal',
  },
  meanings: { one: 'uno', two: 'dos', three: 'tres', person: 'persona', big: 'grande', small: 'pequeño', mouth: 'boca', sunDay: 'sol / día', moonMonth: 'luna / mes', mountain: 'montaña', water: 'agua', fire: 'fuego' },
  privacy: {
    privacyTitle: 'Privacidad y datos', privacyDesc: 'Administra el consentimiento de análisis en este dispositivo.',
    withdrawConsent: 'Retirar consentimiento de análisis', consentUpdated: 'Consentimiento de análisis actualizado.',
  },
  progress: { exportLabel: 'Exportar progreso', importLabel: 'Importar progreso', importInvalid: 'Archivo de copia no válido o dañado', importDone: 'Progreso importado correctamente', persistFailed: 'No se pudo guardar el progreso en este navegador. Revise el modo privado o el espacio de almacenamiento.' },
  pwa: {
    installTitle: 'Instalar HanziMaster',
    installAction: 'Añadir a la pantalla de inicio',
    offlineTitle: 'Estás sin conexión',
    offlineHint: 'Vuelve a conectarte para continuar; tu progreso local sigue guardado en este dispositivo.',
  },
  quiz: { correctAnswer: 'Respuesta correcta' },
  seo: {
    title: 'HanziMaster — Aprende caracteres chinos con orden de trazos',
    description:
      'Aprende 12 caracteres chinos básicos con animaciones de trazos, escritura en cuadrícula Tian-zi-ge, cuestionarios de pinyín y progreso local. Gratis, sin cuenta, 11 idiomas.',
    ogTitle: 'HanziMaster 汉字大师',
    ogDescription: 'Domina 12 caracteres chinos básicos, trazo a trazo.',
    learnTitle: 'Aprende 12 caracteres chinos',
    practiceTitle: 'Práctica de escritura china',
    privacyTitle: 'Política de privacidad',
    termsTitle: 'Términos del servicio',
  },
  settings: {
    title: 'Ajustes',
    description: 'Personaliza la apariencia, los comentarios y los datos.',
    appearance: 'Apariencia',
    language: 'Idioma',
    feedback: 'Comentarios',
    haptics: 'Vibración',
    hapticsDesc: 'Vibra al acertar o fallar',
    motion: 'Animación',
    reduceMotion: 'Reducir animación',
    reduceMotionDesc: 'Desactiva las animaciones de desplazamiento e interfaz',
    data: 'Datos',
    resetProgress: 'Restablecer el progreso',
    resetDesc: 'Todo el progreso local se eliminará de forma permanente. No se puede deshacer.',
    resetYes: 'Sí, restablecer',
    resetDone: 'Progreso de aprendizaje restablecido',
  },
};
