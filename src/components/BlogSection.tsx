import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useNav } from '../context/NavContext';
import { apiUrl } from '../config/api';
import { Skeleton } from './Skeleton';
import SlowLoadingHint from './SlowLoadingHint';

interface BlogPost {
  date: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { openPost, navigate } = useNav();

  useEffect(() => {
    let active = true;
    fetch(apiUrl('/api/posts/'))
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar posts');
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const apiPosts: BlogPost[] = (Array.isArray(data.posts) ? data.posts : []).map(
          (post: { titulo: string; resumo: string; data_publicacao: string; imagem: string; slug: string }) => ({
            title: post.titulo,
            excerpt: post.resumo,
            date: post.data_publicacao,
            image: post.imagem,
            slug: post.slug,
          }),
        );
        if (apiPosts.length > 0) {
          setPosts(apiPosts);
        }
      })
      .catch((err) => {
        console.error('[BlogSection] Erro ao carregar posts:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="py-14 sm:py-20 px-4 sm:px-6"
      style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 55%, #FFFFFF 55%, #FFFFFF 85%, transparent 85%, transparent 100%)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-5 sm:p-10 shadow-lg">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-bold text-gray-900 mb-3 reveal" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.1rem)' }}>Confira nosso blog</h2>
            <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: 'clamp(1.225rem, 2.4vw, 1.4rem)' }}>
              Conteúdos práticos e estratégicos para orientar decisões, melhorar a gestão e ajudar sua empresa a crescer com mais segurança.
            </p>
            <button
              onClick={() => navigate('blog')}
              className="mt-4 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110"
              style={{ background: '#0924a7', color: '#fff' }}
            >
              Ver todos os artigos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {loading ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
                <div className="col-span-full">
                  <SlowLoadingHint />
                </div>
              </>
            ) : posts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhum artigo publicado ainda.</p>
              </div>
            ) : (
              posts.slice(0, 3).map((post, index) => (
              <div
                key={post.slug}
                className="flex flex-col gap-3 cursor-pointer group reveal"
                style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                onClick={() => openPost(post.slug)}
              >
                <div className="rounded-xl overflow-hidden bg-gray-100" style={{ height: '160px' }}>
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Grupo Orcoma
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar size={12} />
                  <span className="text-xs">{post.date}</span>
                </div>
                <h3
                  className="text-gray-900 text-sm font-bold leading-snug group-hover:text-[#e8b800] transition-colors"
                  style={{ cursor: 'pointer' }}
                >
                  {post.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{post.excerpt}</p>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}