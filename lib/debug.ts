/**
 * Debug utilities for development
 * Use these instead of console.log for better debugging
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const DEBUG_ENABLED = process.env.NEXT_PUBLIC_DEBUG === 'true' || isDevelopment;

export const debug = {
  /**
   * Log debug messages (only in development)
   */
  log: (...args: any[]) => {
    if (!isProduction && DEBUG_ENABLED) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Log errors with context
   */
  error: (message: string, error?: any, context?: Record<string, any>) => {
    console.error('[ERROR]', message, {
      error,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    });
  },

  /**
   * Log warnings
   */
  warn: (message: string, context?: Record<string, any>) => {
    if (!isProduction && DEBUG_ENABLED) {
      console.warn('[WARN]', message, context);
    }
  },

  /**
   * Log API calls
   */
  api: (method: string, url: string, data?: any) => {
    if (!isProduction && DEBUG_ENABLED) {
      console.log('[API]', method, url, data ? { data } : '');
    }
  },

  /**
   * Log component renders (use sparingly)
   */
  render: (componentName: string, props?: any) => {
    if (!isProduction && DEBUG_ENABLED && process.env.NEXT_PUBLIC_DEBUG_RENDERS === 'true') {
      console.log('[RENDER]', componentName, props ? { props } : '');
    }
  },

  /**
   * Measure performance
   */
  time: (label: string) => {
    if (!isProduction && DEBUG_ENABLED) {
      console.time(`[PERF] ${label}`);
    }
    return () => {
      if (!isProduction && DEBUG_ENABLED) {
        console.timeEnd(`[PERF] ${label}`);
      }
    };
  },

  /**
   * Track state changes
   */
  state: (componentName: string, stateName: string, value: any) => {
    if (!isProduction && DEBUG_ENABLED && process.env.NEXT_PUBLIC_DEBUG_STATE === 'true') {
      console.log('[STATE]', componentName, stateName, value);
    }
  },
};

/**
 * Error reporter - can be extended to send to error tracking service
 */
export const reportError = (error: Error, context?: Record<string, any>) => {
  debug.error('Error reported', error, context);
  
  // TODO: Add error tracking service (Sentry, LogRocket, etc.)
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: context });
  // }
};

/**
 * Check for common React issues
 */
export const checkReactIssues = () => {
  if (typeof window === 'undefined') return;

  // Check for memory leaks (too many event listeners)
  const checkMemoryLeaks = () => {
    const listeners = (window as any).__eventListeners || 0;
    if (listeners > 100) {
      debug.warn('Potential memory leak: too many event listeners', { count: listeners });
    }
  };

  // Check for infinite loops (too many renders)
  let renderCount = 0;
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (message.includes('Maximum update depth exceeded') || 
        message.includes('Too many re-renders')) {
      debug.error('Infinite render loop detected!', { message });
    }
    originalConsoleError.apply(console, args);
  };

  return { checkMemoryLeaks };
};
