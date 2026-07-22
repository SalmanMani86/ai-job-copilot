import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncActionState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useAsyncAction<Args extends unknown[], T>(action: (...args: Args) => Promise<T>) {
  const [state, setState] = useState<AsyncActionState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.isLoading) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isLoading]);

  const run = useCallback(
    async (...args: Args) => {
      setElapsedSeconds(0);
      setState({ data: null, error: null, isLoading: true });
      try {
        const data = await action(...args);
        setState({ data, error: null, isLoading: false });
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setState({ data: null, error: message, isLoading: false });
      }
    },
    [action]
  );

  return { ...state, elapsedSeconds, run };
}
