import { useCallback } from 'react';
import { toast } from 'sonner';

type ErrorHandler = (error: unknown, context?: string) => void;

export function useApiErrorHandler() {
  const handleError = useCallback<ErrorHandler>((error, context = '') => {
    console.error(`API Error${context ? ` (${context})` : ''}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    toast.error(errorMessage);
    
    // You can add more sophisticated error handling here, like:
    // - Logging to an error tracking service
    // - Handling specific error codes differently
    // - Triggering error boundaries for critical errors
    
    return errorMessage;
  }, []);
  
  const withErrorHandling = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error, context);
        return undefined;
      }
    };
  }, [handleError]);
  
  return {
    handleError,
    withErrorHandling,
  };
}

export default useApiErrorHandler;
