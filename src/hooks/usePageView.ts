import { useEffect } from 'react';

export function usePageView() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const path = window.location.pathname + window.location.search;
      const url = `/api/pageview/?path=${encodeURIComponent(path)}`;
      fetch(url, { method: 'GET' }).catch(() => {});
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}