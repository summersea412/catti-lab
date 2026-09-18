import { useCallback, useEffect, useRef, useState } from 'react';

export const SLEEP_TIMEOUT_MS = 75000;
export const TYPING_IDLE_MS = 1200;

export default function useDesktopPetState() {
  const [currentState, setCurrentState] = useState('idle');
  const [testSleep, setTestSleep] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now);
  const [textareaFocused, setTextareaFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [, tick] = useState(0);
  const stateRef = useRef('idle');
  const focused = useRef(false);
  const composing = useRef(false);
  const sleepTimer = useRef(null);
  const typingTimer = useRef(null);
  const sleepDeadline = useRef(null);
  const typingDeadline = useRef(null);

  const clearSleep = useCallback(() => {
    clearTimeout(sleepTimer.current);
    sleepTimer.current = null;
    sleepDeadline.current = null;
  }, []);
  const clearTyping = useCallback(() => {
    clearTimeout(typingTimer.current);
    typingTimer.current = null;
    typingDeadline.current = null;
  }, []);
  const transition = useCallback(next => {
    stateRef.current = next;
    setCurrentState(next);
    tick(n => n + 1);
  }, []);
  const startIdleTimer = useCallback(() => {
    clearSleep();
    if (stateRef.current !== 'idle' || focused.current) return;
    const delay = testSleep ? 5000 : SLEEP_TIMEOUT_MS;
    sleepDeadline.current = Date.now() + delay;
    sleepTimer.current = setTimeout(() => {
      clearSleep();
      if (stateRef.current === 'idle' && !focused.current) transition('sleep');
    }, delay);
  }, [testSleep, clearSleep, transition]);

  const resetInactivity = useCallback(() => {
    setLastActivity(Date.now());
    if (stateRef.current === 'idle') startIdleTimer();
  }, [startIdleTimer]);
  const setFocus = useCallback(() => {
    focused.current = true;
    setTextareaFocused(true);
    composing.current = false;
    setIsComposing(false);
    clearSleep();
    clearTyping();
    setLastActivity(Date.now());
    transition('focus');
  }, [clearSleep, clearTyping, transition]);
  const setIdle = useCallback(() => {
    focused.current = false;
    setTextareaFocused(false);
    composing.current = false;
    setIsComposing(false);
    clearTyping();
    transition('idle');
    setLastActivity(Date.now());
    startIdleTimer();
  }, [clearTyping, transition, startIdleTimer]);
  const setSleep = useCallback(() => {
    if (focused.current || stateRef.current !== 'idle') return;
    clearSleep();
    clearTyping();
    transition('sleep');
  }, [clearSleep, clearTyping, transition]);

  const startTypingTimer = useCallback(() => {
    clearTyping();
    if (composing.current) return;
    typingDeadline.current = Date.now() + TYPING_IDLE_MS;
    typingTimer.current = setTimeout(() => {
      clearTyping();
      if (stateRef.current !== 'typing' || composing.current) return;
      if (focused.current) transition('focus');
      else {
        transition('idle');
        startIdleTimer();
      }
    }, TYPING_IDLE_MS);
  }, [clearTyping, transition, startIdleTimer]);
  const onInput = useCallback(() => {
    resetInactivity();
    if (!focused.current || !['focus', 'typing'].includes(stateRef.current)) return;
    clearSleep();
    transition('typing');
    startTypingTimer();
  }, [resetInactivity, clearSleep, transition, startTypingTimer]);
  const onCompositionStart = useCallback(() => {
    if (!focused.current) return;
    composing.current = true;
    setIsComposing(true);
    clearSleep();
    clearTyping();
    resetInactivity();
    transition('typing');
  }, [clearSleep, clearTyping, resetInactivity, transition]);
  const onCompositionEnd = useCallback(() => {
    composing.current = false;
    setIsComposing(false);
    if (focused.current && stateRef.current === 'typing') {
      resetInactivity();
      startTypingTimer();
    }
  }, [resetInactivity, startTypingTimer]);
  // Debug-only override. A subsequent actual focus/blur restores normal detection.
  const preview = useCallback(next => {
    clearSleep();
    clearTyping();
    composing.current = false;
    setIsComposing(false);
    transition(next);
    setLastActivity(Date.now());
    if (next === 'idle') startIdleTimer();
  }, [clearSleep, clearTyping, transition, startIdleTimer]);

  useEffect(() => {
    setLastActivity(Date.now());
    startIdleTimer();
    return clearSleep;
  }, [startIdleTimer, clearSleep]);
  useEffect(() => {
    const types = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    types.forEach(type => window.addEventListener(type, resetInactivity, { passive: true }));
    return () => types.forEach(type => window.removeEventListener(type, resetInactivity));
  }, [resetInactivity]);
  useEffect(() => {
    const interval = setInterval(() => tick(n => n + 1), 100);
    return () => { clearInterval(interval); clearSleep(); clearTyping(); };
  }, [clearSleep, clearTyping]);
  return {
    currentState, lastActivity, testSleep, setTestSleep, textareaFocused, isComposing,
    timerActive: sleepTimer.current !== null,
    sleepCountdown: sleepDeadline.current === null ? null : Math.max(0, sleepDeadline.current - Date.now()),
    typingTimerActive: typingTimer.current !== null,
    typingCountdown: typingDeadline.current === null ? null : Math.max(0, typingDeadline.current - Date.now()),
    setFocus, setIdle, setSleep, resetInactivity, onInput, onCompositionStart, onCompositionEnd, preview,
  };
}

