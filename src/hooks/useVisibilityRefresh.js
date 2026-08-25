import { useEffect } from 'react';

export function useVisibilityRefresh(callback) {
  useEffect(() => {
    const onFocus = () => callback();
    const onVisibility = () => { if (document.visibilityState === 'visible') callback(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [callback]);
}
