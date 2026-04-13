// src/hooks/useLockout.js
// Drop this in src/hooks/ — used by all three login pages

import { useState, useEffect, useRef } from "react";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300; // 5 minutes

export function useLockout() {
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null); // timestamp in ms
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  useEffect(() => {
    if (!isLocked) {
      setSecondsLeft(0);
      clearInterval(timerRef.current);
      return;
    }

    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        clearInterval(timerRef.current);
      } else {
        setSecondsLeft(remaining);
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockedUntil]);

  const recordFailure = (serverSecondsRemaining = null) => {
    // If backend tells us exactly how long the lock is, trust that
    if (serverSecondsRemaining) {
      setLockedUntil(Date.now() + serverSecondsRemaining * 1000);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000);
    }
  };

  const recordSuccess = () => {
    setAttempts(0);
    setLockedUntil(null);
    clearInterval(timerRef.current);
  };

  const attemptsLeft = Math.max(MAX_ATTEMPTS - attempts, 0);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return {
    isLocked,
    secondsLeft,
    attemptsLeft,
    attempts,
    formatTime,
    recordFailure,
    recordSuccess,
  };
}