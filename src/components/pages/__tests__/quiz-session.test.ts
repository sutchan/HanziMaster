// src/components/pages/__tests__/quiz-session.test.ts v5.2.61
// OPT-18：测验显式 reducer 的重进复位语义（学习页 / 练习页）。
import { describe, expect, it } from 'vitest';
import {
  INITIAL_LEARN_QUIZ,
  INITIAL_PRACTICE_QUIZ,
  learnQuizReducer,
  practiceQuizReducer,
} from '../quiz-session';

describe('OPT-18 learnQuizReducer', () => {
  it('重进时清除上一次答案与结果', () => {
    const answered = learnQuizReducer(
      { ...INITIAL_LEARN_QUIZ, open: true, answer: 'dà', correct: false },
      { type: 'close' }
    );
    expect(answered).toEqual(INITIAL_LEARN_QUIZ);
    expect(learnQuizReducer(answered, { type: 'open' })).toEqual({ ...INITIAL_LEARN_QUIZ, open: true });
  });

  it('提交后答案不可再改，自动关闭回到空态', () => {
    const opened = learnQuizReducer(INITIAL_LEARN_QUIZ, { type: 'open' });
    const typed = learnQuizReducer(opened, { type: 'answer', value: 'dà' });
    const submitted = learnQuizReducer(typed, { type: 'submit', correct: true });
    expect(submitted.correct).toBe(true);
    expect(learnQuizReducer(submitted, { type: 'answer', value: 'x' })).toEqual(submitted);
    expect(learnQuizReducer(submitted, { type: 'submit', correct: false })).toEqual(submitted);
    expect(learnQuizReducer(submitted, { type: 'autoClose' })).toEqual(INITIAL_LEARN_QUIZ);
  });
});

describe('OPT-18 practiceQuizReducer', () => {
  it('reset 同时清空结果、答案与计时相关的作答态', () => {
    const answered = practiceQuizReducer(INITIAL_PRACTICE_QUIZ, {
      type: 'answer', answer: '大', correct: true,
    });
    expect(answered).toMatchObject({ correctCount: 1, answered: true, selectedAnswer: '大' });
    expect(practiceQuizReducer(answered, { type: 'reset' })).toEqual(INITIAL_PRACTICE_QUIZ);
  });

  it('下一题保留累计计数但清空当前答案，末尾 reset 归零', () => {
    const answered = practiceQuizReducer(INITIAL_PRACTICE_QUIZ, {
      type: 'answer', answer: '大', correct: false,
    });
    const next = practiceQuizReducer(answered, { type: 'next', total: 3 });
    expect(next).toMatchObject({ currentIndex: 1, wrongCount: 1, answered: false, selectedAnswer: '' });
    expect(practiceQuizReducer(next, { type: 'reset' })).toEqual(INITIAL_PRACTICE_QUIZ);
  });
});
