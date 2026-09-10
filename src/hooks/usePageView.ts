import { useEffect } from 'react';
import { apiUrl } from '../config/api';

export function usePageView() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const path = window.location.pathname + window.location.search;
      const url = apiUrl(`/api/pageview/?path=${encodeURIComponent(path)}`);
      fetch(url, { method: 'GET' }).catch((err) => {
        console.warn('[usePageView] Falha ao registrar pageview:', err);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}