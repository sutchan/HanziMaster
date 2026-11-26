// src/lib/i18n/translations/extensions/by-locale/pt-BR.ts v5.2.61
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: 'Fechar', closeNotification: 'Fechar notificação', notifications: 'Notificações', changeLanguage: 'Alterar idioma', selectLanguage: 'Selecionar idioma' },
    learn: { strokeDemoLabel: 'Demonstração da ordem dos traços' },
    practice: { canvasLabel: 'Área de escrita', keyboardLabel: 'Ordem dos traços (alternativa por teclado)', keyboardHint: 'Digite os números dos traços em ordem, ex.: 1 2 3, separados por espaços ou vírgulas.' },
  },
  cloud: { title: 'Sincronização na nuvem', desc: 'Mantenha seu código em segredo — qualquer pessoa com ele pode acessar seu progresso.', code: 'Código de sincronização', generate: 'Gerar', copy: 'Copiar', upload: 'Enviar para a nuvem', download: 'Restaurar da nuvem', uploadDone: 'Progresso enviado', downloadDone: 'Progresso restaurado', failed: 'Falha na sincronização', notConfigured: 'Sincronização indisponível', noProgress: 'Nenhum progresso local para enviar', copyFailed: 'Falha ao copiar — o código está selecionado, pressione Ctrl/Cmd+C para copiar manualmente', confirmTitle: 'Substituir o código de sincronização atual?', confirmDesc: 'Um novo código tornará o progresso antigo na nuvem inacessível. Continuar?', confirmOk: 'Substituir e copiar', errors: { notConfigured: 'Sincronização indisponível', invalidJson: 'Dados da requisição inválidos', invalidCode: 'Código de sincronização inválido', invalidBackup: 'Backup inválido', rateLimited: 'Muitas requisições; tente novamente mais tarde', usePost: 'Use POST para requisições de sincronização', notFound: 'Nenhum progresso na nuvem para este código', tooLarge: 'O backup excede o limite de tamanho', emptyBackup: 'O backup na nuvem não contém progresso', emptyProgress: 'Recusa sobrescrever o progresso na nuvem com dados vazios', readFailed: 'Falha ao ler o progresso na nuvem', writeFailed: 'Falha ao gravar o progresso na nuvem' } },
  geo: {
    factsTitle: 'Sobre o HanziMaster',
    factsLead:
      'HanziMaster é um aplicativo gratuito que funciona apenas no navegador para quem está começando a aprender caracteres chineses. Sem conta e sem dados de aprendizado em servidor.',
    fact1: '12 caracteres fundamentais: 一 二 三 人 大 小 口 日 月 山 水 火.',
    fact2:
      'Cada caractere tem animação da ordem dos traços, pinyin, palavras, frases de exemplo e escrita em grade Tian-zi-ge, além de quizzes de pinyin.',
    fact3:
      '11 idiomas de interface, modo escuro e progresso salvo somente neste navegador (localStorage).',
    faqTitle: 'Perguntas frequentes',
    q1: 'Preciso de conta ou pagar?',
    a1: 'Não. O HanziMaster é gratuito e não exige conta. O progresso fica no localStorage do seu navegador.',
    q2: 'O que posso aprender?',
    a2: '12 caracteres chineses fundamentais com ordem dos traços, pinyin, palavras e frases de exemplo, além de escrita Tian-zi-ge e quizzes de pinyin.',
    q3: 'Meus dados são enviados ou avaliados por IA?',
    a3: 'Não. Não há avaliação por IA nem histórico em servidor. A ordem dos traços é uma demonstração SVG estática; estatísticas carregam apenas após consentimento.',
  },
  legal: {
    privacyTitle: 'Política de Privacidade', termsTitle: 'Termos de Serviço',
    privacyLink: 'Privacidade', termsLink: 'Termos',
    consentTitle: 'Análise e privacidade',
    consentBody: 'Os scripts de análise só carregam após sua aceitação. Veja a Política de Privacidade.',
    accept: 'Aceitar', reject: 'Recusar',
    disclaimerShort: 'Apenas para estudo; confirme em dicionários de referência.',
    legalHeading: 'Informações legais',
  },
  meanings: { one: 'um', two: 'dois', three: 'três', person: 'pessoa', big: 'grande', small: 'pequeno', mouth: 'boca', sunDay: 'sol / dia', moonMonth: 'lua / mês', mountain: 'montanha', water: 'água', fire: 'fogo' },
  privacy: {
    privacyTitle: 'Privacidade e dados', privacyDesc: 'Gerencie o consentimento de análise neste dispositivo.',
    withdrawConsent: 'Retirar consentimento de análise', consentUpdated: 'Consentimento de análise atualizado.',
  },
  progress: { exportLabel: 'Exportar progresso', importLabel: 'Importar progresso', importInvalid: 'Arquivo de backup inválido ou corrompido', importDone: 'Progresso importado com sucesso', persistFailed: 'Não foi possível salvar o progresso neste navegador. Verifique o modo privado ou o espaço de armazenamento.' },
  pwa: {
    installTitle: 'Instalar o HanziMaster',
    installAction: 'Adicionar à tela inicial',
    offlineTitle: 'Você está offline',
    offlineHint: 'Reconecte-se para continuar; seu progresso local continua salvo neste dispositivo.',
  },
  quiz: { correctAnswer: 'Resposta correta' },
  seo: {
    title: 'HanziMaster — Aprenda caracteres chineses com ordem de traços',
    description:
      'Aprenda 12 caracteres chineses básicos com animações de traços, escrita em grade Tian-zi-ge, quizzes de pinyin e progresso local. Grátis, sem conta, 11 idiomas.',
    ogTitle: 'HanziMaster 汉字大师',
    ogDescription: 'Domine 12 caracteres chineses básicos, um traço de cada vez.',
    learnTitle: 'Aprenda 12 caracteres chineses',
    practiceTitle: 'Prática de escrita chinesa',
    privacyTitle: 'Política de privacidade',
    termsTitle: 'Termos de uso',
  },
  settings: {
    title: 'Configurações',
    description: 'Personalize aparência, feedback e dados.',
    appearance: 'Aparência',
    language: 'Idioma',
    feedback: 'Feedback',
    haptics: 'Vibração',
    hapticsDesc: 'Vibra ao acertar ou errar',
    motion: 'Movimento',
    reduceMotion: 'Reduzir movimento',
    reduceMotionDesc: 'Desativa animações de rolagem e interface',
    data: 'Dados',
    resetProgress: 'Redefinir progresso de aprendizado',
    resetDesc: 'Todo o progresso local será removido permanentemente. Não pode ser desfeito.',
    resetYes: 'Sim, redefinir',
    resetDone: 'Progresso de aprendizado redefinido',
  },
};
