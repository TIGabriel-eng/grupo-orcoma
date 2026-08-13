import { useEffect } from 'react';

const API_URL = '/api/pageview/';

export function usePageView() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const path = window.location.pathname + window.location.search;
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      }).catch(() => {});
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}