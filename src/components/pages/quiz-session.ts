// src/components/pages/quiz-session.ts v5.3.0
// OPT-18：学习页/练习页测验会话的显式 reducer；重进统一走 INITIAL 状态，避免旧结果与计时残留。

export interface LearnQuizState {
  open: boolean;
  answer: string;
  correct: boolean | null;
}

export const INITIAL_LEARN_QUIZ: LearnQuizState = { open: false, answer: '', correct: null };

export type LearnQuizAction =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'reset' }
  | { type: 'answer'; value: string }
  | { type: 'submit'; correct: boolean }
  | { type: 'autoClose' };

export function learnQuizReducer(state: LearnQuizState, action: LearnQuizAction): LearnQuizState {
  switch (action.type) {
    // 每次打开都从空态起算，重进不继承上一次的答案/结果
    case 'open':
      return { ...INITIAL_LEARN_QUIZ, open: true };
    case 'close':
    case 'reset':
    case 'autoClose':
      return INITIAL_LEARN_QUIZ;
    case 'answer':
      return state.correct === null ? { ...state, answer: action.value } : state;
    case 'submit':
      return state.correct === null && state.answer.trim()
        ? { ...state, correct: action.correct }
        : state;
  }
}

export interface PracticeQuizState {
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  answered: boolean;
  selectedAnswer: string;
}

export const INITIAL_PRACTICE_QUIZ: PracticeQuizState = {
  currentIndex: 0,
  correctCount: 0,
  wrongCount: 0,
  answered: false,
  selectedAnswer: '',
};

export type PracticeQuizAction =
  | { type: 'reset' }
  | { type: 'next'; total: number }
  | { type: 'answer'; answer: string; correct: boolean };

export function practiceQuizReducer(state: PracticeQuizState, action: PracticeQuizAction): PracticeQuizState {
  switch (action.type) {
    case 'reset':
      return INITIAL_PRACTICE_QUIZ;
    case 'next':
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % Math.max(1, action.total),
        answered: false,
        selectedAnswer: '',
      };
    case 'answer':
      return state.answered
        ? state
        : {
            ...state,
            correctCount: state.correctCount + (action.correct ? 1 : 0),
            wrongCount: state.wrongCount + (action.correct ? 0 : 1),
            answered: true,
            selectedAnswer: action.answer,
          };
  }
}
