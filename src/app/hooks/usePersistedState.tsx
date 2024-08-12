import { useState, useEffect } from "react";

function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Get the stored value from localStorage or use the initial value if not present
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  };

  const [state, setState] = useState<T>(getInitialValue);

  useEffect(() => {
    // Update localStorage whenever the state changes
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
