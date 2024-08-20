"use client";

import { useState, useEffect } from "react";

function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set the state from localStorage after hydration
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        setState(JSON.parse(storedValue));
      }
      setIsHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    // Update localStorage whenever the state changes after hydration
    if (isHydrated) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state, isHydrated]);

  return [state, setState];
}

export default usePersistentState;
