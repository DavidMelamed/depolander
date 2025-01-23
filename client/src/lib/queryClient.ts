import { QueryClient } from "@tanstack/react-query";

const defaultRetryCondition = (failureCount: number, error: Error) => {
  // Only retry if it's a network error or 5xx server error
  if (error.message.includes('Network Error') || error.message.startsWith('5')) {
    return failureCount < 3;
  }
  return false;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        try {
          const res = await fetch(queryKey[0] as string, {
            credentials: "include",
          });

          if (!res.ok) {
            const errorText = await res.text();
            let errorMessage;

            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.error || errorText;
            } catch {
              errorMessage = errorText;
            }

            const error = new Error(errorMessage);
            (error as any).status = res.status;
            throw error;
          }

          const data = await res.json();
          return data;
        } catch (error) {
          if (error instanceof Error) {
            // Enhance error with status code if available
            if ((error as any).status >= 500) {
              error.message = `Server Error (${(error as any).status}): ${error.message}`;
            }
            throw error;
          }
          throw new Error('An unexpected error occurred');
        }
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: defaultRetryCondition,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: defaultRetryCondition,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  },
});