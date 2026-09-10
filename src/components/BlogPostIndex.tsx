import { ListOrdered } from 'lucide-react';
import type { IndiceItem } from '../utils/blogContent';

interface BlogPostIndexProps {
  indice: IndiceItem[];
  ativoId: string | null;
}

export default function BlogPostIndex({ indice, ativoId }: BlogPostIndexProps) {
  if (indice.length === 0) return null;

  const rolarPara = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="rounded-2xl border border-gray-100 shadow-sm bg-white p-5 lg:p-4">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
        <ListOrdered size={14} color="#e8b800" />
        Índice do artigo
      </h2>
      <ul className="flex flex-col gap-1">
        {indice.map((item, index) => {
          const ativo = item.id === ativoId;
          return (
            <li key={item.id}>
              <button
                onClick={() => rolarPara(item.id)}
                className={`w-full text-left flex items-start gap-2 px-2 py-1.5 rounded-lg text-sm leading-snug transition-colors duration-200 ${
                  ativo ? 'font-bold text-[#0c0ccc]' : 'text-gray-600 hover:text-[#0c0ccc]'
                }`}
                style={{ background: ativo ? 'rgba(12,12,204,0.06)' : 'transparent' }}
              >
                <span className="font-bold text-xs mt-0.5" style={{ color: ativo ? '#e8b800' : '#a9a9c0' }}>
                  {index + 1}
                </span>
                <span>{item.texto}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}