// src/hooks/use-pronunciation.ts v5.2.58
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// 汉字发音 Hook，基于 Web Speech API。
// 统一处理 isSpeaking 状态、不支持时的错误反馈，以及组件卸载时中断发音。
export function usePronunciation() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pronounceError, setPronounceError] = useState(false);
  // 能力检测：三态（null = 未检测），挂载后检测以避免 SSR/客户端 hydration 不一致（P2-16）
  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null);
  // 每次发音递增；cancel() 触发的旧 utterance 回调异步到达时据此忽略，避免污染新发音状态
  const utteranceId = useRef(0);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((hanzi: string) => {
    // 部分 WebView 只暴露 speechSynthesis、不暴露构造函数，直接 new 会抛 ReferenceError
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      setPronounceError(true);
      return;
    }
    setPronounceError(false);
    try {
      const id = ++utteranceId.current;
      const utterance = new SpeechSynthesisUtterance(hanzi);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      const isCurrent = () => id === utteranceId.current;
      utterance.onstart = () => {
        if (isCurrent()) setIsSpeaking(true);
      };
      utterance.onend = () => {
        if (isCurrent()) setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        if (!isCurrent()) return;
        setIsSpeaking(false);
        // 被主动取消/打断属正常流程，不应向用户报发音故障
        if (event && (event.error === 'canceled' || event.error === 'interrupted')) return;
        setPronounceError(true);
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // 构造或 speak 抛错时降级为错误提示，不把异常冒泡到点击处理器
      setIsSpeaking(false);
      setPronounceError(true);
    }
  }, []);

  // 组件卸载时中断正在播放的发音，避免延续到卸载后
  useEffect(() => {
    return () => {
      utteranceId.current++;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isSpeaking, pronounceError, speechSupported, speak };
}
