import { useEffect, useState } from 'react';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';
import BlogLeadForm from '../components/BlogLeadForm';
import BlogCtaCard from '../components/BlogCtaCard';
import { useNav } from '../context/NavContext';

interface PostDetalhe {
  titulo: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
  imagem: string;
  slug: string;
  autor: string;
  visualizacoes: number;
}

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';
const GOLD = '#e8b800';

function formatarConteudo(conteudo: string): string {
  return conteudo
    .split('\n\n')
    .map((paragrafo) => `<p>${paragrafo.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

export default function BlogPostPage() {
  const { activePostSlug, navigate } = useNav();
  const [post, setPost] = useState<PostDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!activePostSlug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setNotFound(false);

    fetch(`/api/posts/${activePostSlug}/`)
      .then((res) => {
        if (!res.ok) throw new Error('Post não encontrado');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        if (data.post) {
          setPost(data.post);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activePostSlug]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: BLUE }}>
        <PageNav activePage="blog-post" showConsultor={false} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: GOLD, borderTopColor: 'transparent' }}
          />
        </div>
        <Footer />
        <WhatsAppToggle />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen" style={{ background: BLUE }}>
        <PageNav activePage="blog-post" showConsultor={false} />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Artigo não encontrado</h1>
          <p className="text-white/60 mb-8">O artigo que você procura não está disponível ou foi removido.</p>
          <button
            onClick={() => navigate('blog')}
            className="px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110"
            style={{ background: GOLD, color: '#000' }}
          >
            Voltar para o Blog
          </button>
        </div>
        <Footer />
        <WhatsAppToggle />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero com título do artigo ── */}
      <div className="relative overflow-hidden" style={{ background: BLUE }}>
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }}
        />
        <div className="relative z-10">
          <PageNav activePage="blog-post" showConsultor={false} />

          <section className="px-4 sm:px-8 pb-14 sm:pb-20 pt-8 sm:pt-12 max-w-4xl mx-auto text-center">
            <button
              onClick={() => navigate('blog')}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para o Blog
            </button>

            <div className="flex items-center justify-center gap-6 text-white/70 text-sm mb-5">
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {post.data_publicacao}
              </span>
              {post.autor && (
                <span className="flex items-center gap-2">
                  <User size={14} />
                  {post.autor}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              {post.titulo}
            </h1>
          </section>
        </div>
      </div>

      {/* ── Conteúdo do artigo ── */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-14 items-start">
          <div className="min-w-0">
            {post.imagem && (
              <div className="rounded-2xl overflow-hidden shadow-lg mb-10 reveal">
                <img src={post.imagem} alt={post.titulo} className="w-full h-auto object-cover" />
              </div>
            )}

            <article
              className="text-gray-700 leading-relaxed"
              style={{ fontSize: '1.0625rem' }}
              dangerouslySetInnerHTML={{ __html: formatarConteudo(post.conteudo) }}
            />

            <div className="mt-12">
              <BlogLeadForm />
            </div>
          </div>

          <BlogCtaCard />
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ background: BLUE }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold mb-4">
            Precisa de ajuda com esse assunto?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Nossa equipe de especialistas está pronta para orientar você e o seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('contato')}
              className="px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 hover:scale-105"
              style={{ background: GOLD, color: '#000' }}
            >
              Falar com Consultor
            </button>
            <button
              onClick={() => navigate('blog')}
              className="px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
            >
              Ver outros artigos
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
}