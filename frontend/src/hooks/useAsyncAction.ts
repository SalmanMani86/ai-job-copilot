import { useCallback, useState } from "react";

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

  const run = useCallback(
    async (...args: Args) => {
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

  return { ...state, run };
}
