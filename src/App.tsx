import { NavProvider, useNav } from './context/NavContext';
import { WhatsAppProvider } from './context/WhatsAppContext';
import { ClienteProvider } from './context/ClienteContext';
import { usePageView } from './hooks/usePageView';
import { useScrollReveal } from './hooks/useScrollReveal';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import SolucoesPage from './pages/SolucoesPage';
import SobrePage from './pages/SobrePage';
import LoginPage from './pages/LoginPage';
import EventosPage from './pages/EventosPage';
import TrabalheConoscoPage from './pages/TrabalheConoscoPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import EspecialidadesPage from './pages/EspecialidadesPage';
import AcademyBusinessPage from './pages/AcademyBusinessPage';
import WhatsAppModal from './components/WhatsAppModal';

function Router() {
  const { page } = useNav();
  usePageView();
  useScrollReveal();
  if (page === 'contato') return <ContactPage />;
  if (page === 'solucoes') return <SolucoesPage />;
  if (page === 'sobre') return <SobrePage />;
  if (page === 'login') return <LoginPage />;
  if (page === 'eventos') return <EventosPage />;
  if (page === 'trabalhe-conosco') return <TrabalheConoscoPage />;
  if (page === 'blog') return <BlogPage />;
  if (page === 'blog-post') return <BlogPostPage />;
  if (page === 'especialidades') return <EspecialidadesPage />;
  if (page === 'academy-business') return <AcademyBusinessPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <NavProvider>
      <WhatsAppProvider>
        <ClienteProvider>
          <Router />
          <WhatsAppModal />
        </ClienteProvider>
      </WhatsAppProvider>
    </NavProvider>
  );
}
