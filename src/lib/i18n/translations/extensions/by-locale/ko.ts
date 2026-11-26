// src/lib/i18n/translations/extensions/by-locale/ko.ts v5.2.61
// 单个语言的全部扩展片段；loadTranslations 只动态导入当前语言，避免全量扩展入主包。
import type { LocaleExtensions } from './types';

export const extensions: LocaleExtensions = {
  a11y: {
    common: { close: '닫기', closeNotification: '알림 닫기', notifications: '알림', changeLanguage: '언어 변경', selectLanguage: '언어 선택' },
    learn: { strokeDemoLabel: '획순 시연 영역' },
    practice: { canvasLabel: '쓰기 캔버스', keyboardLabel: '획순 입력 (키보드 대체 경로)', keyboardHint: '획 번호를 순서대로 입력하세요. 예: 1 2 3 (공백 또는 쉼표로 구분).' },
  },
  cloud: { title: '클라우드 동기화', desc: '동기화 코드는 비밀로 유지하세요. 코드를 가진 사람은 누구나 진행 상황에 접근할 수 있습니다.', code: '동기화 코드', generate: '생성', copy: '복사', upload: '클라우드에 업로드', download: '클라우드에서 복원', uploadDone: '진행 상황을 업로드했습니다', downloadDone: '진행 상황을 복원했습니다', failed: '동기화에 실패했습니다', notConfigured: '클라우드 동기화를 사용할 수 없습니다', noProgress: '업로드할 로컬 진행 상황이 없습니다' },
  geo: {
    factsTitle: 'HanziMaster 소개',
    factsLead:
      'HanziMaster는 한자를 처음 배우는 사람을 위한 무료 브라우저 앱입니다. 모든 기능이 브라우저에서 실행되며 계정이나 학습 데이터 전송이 필요 없습니다.',
    fact1: '기초 한자 12자: 一 二 三 人 大 小 口 日 月 山 水 火.',
    fact2: '각 글자에 필순 시연, 병음, 단어, 예문, 전자격 쓰기 연습이 있고 병음 퀴즈도 제공됩니다.',
    fact3:
      '11개 인터페이스 언어와 다크 모드를 지원하며, 학습 기록은 이 브라우저의 localStorage에만 저장됩니다.',
    faqTitle: '자주 묻는 질문',
    q1: '가입하거나 비용을 내야 하나요?',
    a1: '아니요. HanziMaster는 무료이며 계정이 필요 없습니다. 학습 기록은 브라우저 localStorage에 저장됩니다.',
    q2: '무엇을 배울 수 있나요?',
    a2: '기초 한자 12자의 자형·병음·필순·단어·예문과 전자격 쓰기 연습, 병음 퀴즈를 배울 수 있습니다.',
    q3: '학습 데이터가 업로드되거나 AI가 채점하나요?',
    a3: '아니요. AI 채점이나 서버 측 학습 기록이 없으며 필순은 정적 SVG 시연입니다. 통계 스크립트는 동의 후에만 로드됩니다.',
  },
  legal: {
    privacyTitle: '개인정보 처리방침', termsTitle: '이용 약관',
    privacyLink: '개인정보', termsLink: '약관',
    consentTitle: '분석 및 개인정보',
    consentBody: '동의한 경우에만 분석 스크립트가 로드됩니다. 개인정보 처리방침을 참고하세요.',
    accept: '동의', reject: '거부',
    disclaimerShort: '학습 참고용이며, 권위 있는 사전으로 확인하세요.',
    legalHeading: '법적 정보',
  },
  meanings: { one: '하나', two: '둘', three: '셋', person: '사람', big: '크다', small: '작다', mouth: '입', sunDay: '해 / 날', moonMonth: '달 / 달', mountain: '산', water: '물', fire: '불' },
  privacy: {
    privacyTitle: '개인정보 및 데이터', privacyDesc: '이 기기의 분석 동의를 관리합니다.',
    withdrawConsent: '분석 동의 철회', consentUpdated: '분석 동의가 업데이트되었습니다.',
  },
  progress: { exportLabel: '학습 진행 내보내기', importLabel: '학습 진행 가져오기', importInvalid: '백업 파일이 유효하지 않거나 손상되었습니다', importDone: '학습 진행을 가져왔습니다', persistFailed: '이 브라우저에 진행 상황을 저장할 수 없습니다. 프라이빗 모드나 저장 공간을 확인하세요.' },
  pwa: {
    installTitle: 'HanziMaster 설치',
    installAction: '홈 화면에 추가',
    offlineTitle: '오프라인 상태입니다',
    offlineHint: '다시 연결하면 계속할 수 있습니다. 이 기기에 저장된 학습 진행 상황은 유지됩니다.',
  },
  quiz: { correctAnswer: '정답' },
  seo: {
    title: 'HanziMaster 漢字大師 — 한자 필순과 쓰기 연습',
    description:
      '필순 시연, 전자격 쓰기, 병음 퀴즈로 기초 한자 12자를 학습합니다. 무료·가입 불필요·기록은 기기에만 저장, 11개 언어 지원.',
    ogTitle: 'HanziMaster 漢字大師',
    ogDescription: '한 획씩, 기초 한자 12자를 익힙니다.',
    learnTitle: '기초 한자 12자 배우기',
    practiceTitle: '한자 쓰기 연습',
    privacyTitle: '개인정보 처리방침',
    termsTitle: '이용 약관',
  },
  settings: {
    title: '설정',
    description: '외관, 피드백, 데이터를 개인화합니다.',
    appearance: '외관',
    language: '언어',
    feedback: '피드백',
    haptics: '진동 피드백',
    hapticsDesc: '정답·오답 시 진동으로 알려줍니다',
    motion: '모션',
    reduceMotion: '모션 줄이기',
    reduceMotionDesc: '스크롤 및 화면 애니메이션을 끕니다',
    data: '데이터',
    resetProgress: '학습 진도 초기화',
    resetDesc: '로컬 학습 진도가 모두 영구 삭제되며 되돌릴 수 없습니다.',
    resetYes: '초기화합니다',
    resetDone: '학습 진도가 초기화되었습니다',
  },
};
