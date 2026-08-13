import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Page = 'home' | 'contato' | 'solucoes' | 'sobre' | 'login' | 'eventos' | 'trabalhe-conosco' | 'blog' | 'blog-post' | 'especialidades' | 'academy-business';

interface NavContextValue {
  page: Page;
  navigate: (p: Page) => void;
  activePostSlug: string | null;
  openPost: (slug: string) => void;
  activeEspecialidadeSlug: string | null;
  openEspecialidade: (slug: string) => void;
  navigateToEspecialidades: () => void;
}

const NavContext = createContext<NavContextValue>({
  page: 'home',
  navigate: () => {},
  activePostSlug: null,
  openPost: () => {},
  activeEspecialidadeSlug: null,
  openEspecialidade: () => {},
  navigateToEspecialidades: () => {},
});

const ALL_PAGES: Page[] = ['home', 'contato', 'solucoes', 'sobre', 'login', 'eventos', 'trabalhe-conosco', 'blog', 'blog-post', 'especialidades', 'academy-business'];

function isPage(value: string): value is Page {
  return (ALL_PAGES as string[]).includes(value);
}

function parseHash(): { page: Page; postSlug: string | null; espSlug: string | null; scrollToEspecialidades: boolean } {
  const parts = window.location.hash.replace(/^#/, '').split('/').filter(Boolean);
  const [first, second] = parts;

  if (first === 'home' && second === 'especialidades') {
    return { page: 'home', postSlug: null, espSlug: null, scrollToEspecialidades: true };
  }
  if (first === 'blog-post') {
    return { page: 'blog-post', postSlug: second || null, espSlug: null, scrollToEspecialidades: false };
  }
  if (first === 'especialidades') {
    return { page: 'especialidades', postSlug: null, espSlug: second || null, scrollToEspecialidades: false };
  }
  if (first && isPage(first)) {
    return { page: first, postSlug: null, espSlug: null, scrollToEspecialidades: false };
  }
  return { page: 'home', postSlug: null, espSlug: null, scrollToEspecialidades: false };
}

function formatHash(page: Page, slug?: string | null): string {
  switch (page) {
    case 'blog-post':
      return slug ? `#/blog-post/${slug}` : '#/blog-post';
    case 'especialidades':
      return slug ? `#/especialidades/${slug}` : '#/especialidades';
    case 'home':
      return '#/';
    default:
      return `#/${page}`;
  }
}

function setHash(hash: string) {
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

function scrollToEspecialidadesSection() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById('especialidades');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo(0, 0);
      }
    });
  });
}

export function NavProvider({ children }: { children: ReactNode }) {
  const initial = parseHash();

  const [page, setPage] = useState<Page>(initial.page);
  const [activePostSlug, setActivePostSlug] = useState<string | null>(initial.postSlug);
  const [activeEspecialidadeSlug, setActiveEspecialidadeSlug] = useState<string | null>(initial.espSlug);

  useEffect(() => {
    const current = parseHash();
    if (current.scrollToEspecialidades) {
      scrollToEspecialidadesSection();
    }
  }, []);

  useEffect(() => {
    function handleHashChange() {
      const next = parseHash();
      setPage(next.page);
      setActivePostSlug(next.postSlug);
      setActiveEspecialidadeSlug(next.espSlug);
      if (next.scrollToEspecialidades) {
        scrollToEspecialidadesSection();
      } else {
        window.scrollTo(0, 0);
      }
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (p: Page) => {
    setPage(p);
    if (p !== 'blog-post') setActivePostSlug(null);
    if (p !== 'especialidades') setActiveEspecialidadeSlug(null);
    setHash(formatHash(p));
    window.scrollTo(0, 0);
  };

  const openPost = (slug: string) => {
    setActivePostSlug(slug);
    setPage('blog-post');
    setHash(formatHash('blog-post', slug));
    window.scrollTo(0, 0);
  };

  const openEspecialidade = (slug: string) => {
    setActiveEspecialidadeSlug(slug);
    setPage('especialidades');
    setHash(formatHash('especialidades', slug));
    window.scrollTo(0, 0);
  };

  const navigateToEspecialidades = () => {
    setActiveEspecialidadeSlug(null);
    setActivePostSlug(null);
    setPage('home');
    setHash('#/home/especialidades');
    scrollToEspecialidadesSection();
  };

  return (
    <NavContext.Provider value={{ page, navigate, activePostSlug, openPost, activeEspecialidadeSlug, openEspecialidade, navigateToEspecialidades }}>
      {children}
    </NavContext.Provider>
  );
}

export const useNav = () => useContext(NavContext);
