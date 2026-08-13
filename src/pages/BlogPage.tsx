import { useEffect, useMemo, useState } from 'react';
import { Search, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';
import BlogCtaCard from '../components/BlogCtaCard';
import { useNav } from '../context/NavContext';

interface BlogPost {
  titulo: string;
  resumo: string;
  data_publicacao: string;
  data_iso: string;
  imagem: string;
  slug: string;
}

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';
const GOLD = '#e8b800';

function isRecent(dataIso: string): boolean {
  if (!dataIso) return false;
  const postDate = new Date(dataIso + 'T00:00:00');
  if (isNaN(postDate.getTime())) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return postDate >= cutoff;
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap inline-flex items-center gap-2"
      style={{
        backgroundColor: active ? '#0924a7' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#12122B',
        border: `1px solid ${active ? '#0924a7' : '#E9E9F2'}`,
      }}
    >
      {children}
    </button>
  );
}

function PostCard({
  post,
  big,
  onOpen,
}: {
  post: BlogPost;
  big?: boolean;
  onOpen: (slug: string) => void;
}) {
  return (
    <article
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer reveal ${big ? 'md:flex-row' : ''}`}
      style={{ border: '1px solid #E9E9F2', boxShadow: '0 4px 20px rgba(9,36,167,0.08)' }}
      onClick={() => onOpen(post.slug)}
    >
      <div className={`overflow-hidden ${big ? 'md:w-1/2' : ''}`} style={{ aspectRatio: big ? undefined : '16/11' }}>
        <img
          src={post.imagem}
          alt={post.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ minHeight: big ? '260px' : undefined }}
        />
      </div>

      <div className={`flex flex-col p-6 ${big ? 'md:w-1/2 md:p-8 md:justify-center' : ''}`}>
        <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#6B6B85' }}>
          <Calendar size={14} />
          <span>{post.data_publicacao}</span>
        </div>

        <h3
          className={`font-extrabold mb-2 leading-snug group-hover:text-[#e8b800] transition-colors ${big ? 'text-2xl md:text-3xl' : 'text-lg'}`}
          style={{ color: '#12122B' }}
        >
          {post.titulo}
        </h3>

        <p className={`text-sm mb-5 ${big ? 'md:text-base' : ''}`} style={{ color: '#6B6B85' }}>
          {post.resumo}
        </p>

        <span
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full w-fit transition-all duration-200 group-hover:translate-x-0.5"
          style={{ backgroundColor: GOLD, color: '#000' }}
        >
          SAIBA MAIS
          <ArrowRight size={16} />
        </span>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const { openPost, navigate } = useNav();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [novidadesAtivo, setNovidadesAtivo] = useState(true);
  const [query, setQuery] = useState('');
  const [newsNome, setNewsNome] = useState('');
  const [newsCelular, setNewsCelular] = useState('');
  const [newsEmail, setNewsEmail] = useState('');
  const [newsMsg, setNewsMsg] = useState<string | null>(null);
  const [newsStatus, setNewsStatus] = useState<'ok' | 'error' | null>(null);

  const handleNewsletter = () => {
    if (!newsEmail.trim()) {
      setNewsMsg('Informe seu e-mail');
      setNewsStatus('error');
      return;
    }
    fetch('/api/newsletter/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: newsNome.trim(),
        celular: newsCelular.trim(),
        email: newsEmail.trim(),
        origem: 'blog',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNewsStatus(data.status === 'ok' ? 'ok' : 'error');
        setNewsMsg(data.message || '');
        if (data.status === 'ok') {
          setNewsNome('');
          setNewsCelular('');
          setNewsEmail('');
        }
      })
      .catch(() => {
        setNewsStatus('error');
        setNewsMsg('Não foi possível cadastrar. Tente novamente.');
      });
  };

  useEffect(() => {
    let active = true;
    fetch('/api/posts/')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar posts');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const apiPosts: BlogPost[] = (Array.isArray(data.posts) ? data.posts : []).map(
          (post: { titulo: string; resumo: string; data_publicacao: string; data_iso: string; imagem: string; slug: string }) => ({
            titulo: post.titulo,
            resumo: post.resumo,
            data_publicacao: post.data_publicacao,
            data_iso: post.data_iso || '',
            imagem: post.imagem,
            slug: post.slug,
          }),
        );
        if (apiPosts.length > 0) {
          setPosts(apiPosts);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      // Filtro "Novidades" — apenas artigos dos últimos 30 dias
      if (novidadesAtivo && !isRecent(p.data_iso)) return false;
      // Busca por texto
      const matchesQuery =
        query.trim() === '' ||
        p.titulo.toLowerCase().includes(query.toLowerCase()) ||
        p.resumo.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [novidadesAtivo, query, posts]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div style={{ backgroundColor: '#F6F6FB', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ background: BLUE }}>
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }}
        />
        <div className="relative z-10">
          <PageNav activePage="blog" showConsultor={false} />

          <section className="px-4 sm:px-8 pb-16 sm:pb-24 pt-8 sm:pt-10 max-w-5xl mx-auto text-center">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: 'rgba(232,184,0,0.15)', color: GOLD, border: '1px solid rgba(232,184,0,0.4)' }}
            >
              Blog Grupo Orcoma
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Conteúdo que apoia decisões mais seguras
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
              Conteúdos práticos e estratégicos para orientar decisões, melhorar a gestão e ajudar sua empresa a crescer com mais segurança.
            </p>

            <div className="mt-8 max-w-md mx-auto relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B6B85' }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar artigos..."
                className="w-full rounded-full py-3 pl-11 pr-4 text-sm outline-none"
                style={{ color: '#12122B' }}
              />
            </div>
          </section>
        </div>
      </div>

      {/* ── Filtro Novidades ── */}
      <section className="max-w-[1440px] mx-auto px-6 -mt-8 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Pill active={novidadesAtivo} onClick={() => setNovidadesAtivo((v) => !v)}>
            <Sparkles size={14} />
            Novidades
          </Pill>
        </div>
      </section>

      {/* ── Conteúdo ── */}
      <main className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-24" style={{ color: '#6B6B85' }}>
                <p className="font-semibold mb-1">Nenhum artigo encontrado.</p>
                <p className="text-sm">Tente outra busca.</p>
              </div>
            ) : (
              <>
                {featured && (
                  <div className="mb-10">
                    <PostCard post={featured} big onOpen={openPost} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} onOpen={openPost} />
                  ))}
                </div>

                <div className="text-center mt-14">
                  <button
                    onClick={() => navigate('home')}
                    className="px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110"
                    style={{ background: '#0924a7', color: '#fff' }}
                  >
                    Voltar para a Home
                  </button>
                </div>
              </>
            )}
          </div>

          <BlogCtaCard />
        </div>
      </main>

      {/* ── Newsletter ── */}
      <section className="max-w-[1440px] mx-auto px-6 pb-16">
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{ background: BLUE, boxShadow: '0 20px 60px rgba(9,36,167,0.25)' }}
        >
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent 70%)` }}
          />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-6 sm:px-12 py-12 sm:py-14">
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: 'rgba(232,184,0,0.15)', color: GOLD, border: '1px solid rgba(232,184,0,0.4)' }}
              >
                Newsletter
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Assine nossa newsletter e fique por dentro de todas as novidades!
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={newsNome}
                  onChange={(e) => setNewsNome(e.target.value)}
                  placeholder="Nome"
                  className="w-full rounded-full px-5 py-3 text-sm outline-none border"
                  style={{ color: '#12122B', borderColor: '#E9E9F2' }}
                />
                <input
                  value={newsCelular}
                  onChange={(e) => setNewsCelular(e.target.value)}
                  placeholder="Celular"
                  className="w-full rounded-full px-5 py-3 text-sm outline-none border"
                  style={{ color: '#12122B', borderColor: '#E9E9F2' }}
                />
              </div>
              <input
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNewsletter(); }}
                placeholder="E-mail"
                className="w-full rounded-full px-5 py-3 text-sm outline-none border mt-3"
                style={{ color: '#12122B', borderColor: '#E9E9F2' }}
              />

              <div className="mt-5 flex items-center justify-center">
                <button
                  onClick={handleNewsletter}
                  className="relative px-10 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 inline-flex items-center gap-2"
                  style={{ backgroundColor: GOLD, color: '#000' }}
                >
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-40"
                    style={{ backgroundColor: GOLD }}
                  />
                  <span className="relative z-10">Assinar!</span>
                </button>
              </div>

              {newsMsg && (
                <p className={`mt-3 text-sm font-medium ${newsStatus === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                  {newsMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
}