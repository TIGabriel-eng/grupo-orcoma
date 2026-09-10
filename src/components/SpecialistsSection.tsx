import { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { apiUrl } from '../config/api';
import { useNav } from '../context/NavContext';

interface CityInfo {
  name: string;
  address: string;
}

interface Especialidade {
  id: number;
  titulo: string;
  slug: string;
  descricao: string;
  imagem: string;
  ordem: number;
}

const leftCities: CityInfo[] = [
  { name: 'Salvador - Ba', address: 'AV. Tancredo Neves, 2539, Cond. Ceo Salvador Shopping, T. Londres, sala 1016, Caminho das Árvores, Salvador - BA' },
  { name: 'Feira de Santana - Ba', address: 'Av. Getúlio Vargas, 1745 - Sl 205 - Capuchinhos, Feira de Santana - BA, 44075-425' },
  { name: 'Jequié - Ba', address: 'R. Álvares Cabral, 242-362 - Centro, Jequié - BA, 45203-040' },
  { name: 'Jequié 02 - Ba', address: 'Av. Rio Branco, 253 - Campo do América, Jequié - BA' },
  { name: 'Campo Formoso - Ba', address: 'Praça Frei Lino Graflage, 108, Sala 108, Centro, Campo Formoso - BA, CEP 44790-000' },
  { name: 'Jaguaquara - Ba', address: 'Rua Cel. Durval de Matos, 50, 1º Andar - Centro, Jaguaquara - BA, CEP 45345-000' },
  { name: 'Maracás - Ba', address: 'Rua Afrânio Peixoto, 19, Centro - Maracás - BA' },
];

const rightCities: CityInfo[] = [
  { name: 'Utinga - Ba', address: 'Avenida Monteiro, 6-A, Térreo, Centro - Utinga - BA, CEP 46810-000' },
  { name: 'Itaberaba - Ba', address: 'Av. Rui Barbosa, 138 - Centro, Itaberaba - BA' },
  { name: 'Itaberaba | Pública', address: 'Av. Rio Branco, 594, primeiro andar, Centro, Itaberaba - BA' },
  { name: 'Jiquiriçá - Ba', address: 'Rua Sete de Setembro - Centro, Jiquiriçá - BA, CEP 45470-000' },
  { name: 'Várzea Nova - Ba', address: 'Sem escritório físico' },
  { name: 'Seabra - Ba', address: 'Rua Ana Nery, 54, 1º Andar - Centro, Seabra - BA, CEP 46900-112' },
  { name: 'São Paulo - Sp', address: 'Sem escritório físico' },
];

function CityCard({ city, isSelected, onClick }: { city: CityInfo; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      className="flex flex-col gap-1 bg-white border rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5"
      style={{
        borderColor: isSelected ? '#e8b800' : '#e5e7eb',
        boxShadow: isSelected ? '0 4px 14px rgba(232,184,0,0.25), 0 0 0 2px #e8b800' : 'none',
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: '#e8b800' }}
        >
          <MapPin size={14} color="#000" />
        </div>
        <span className="text-gray-700 text-xs font-medium leading-tight min-w-0 break-words">{city.name}</span>
      </div>
      {city.address && (
        <div
          className="ml-9 mt-1 grid transition-all duration-500 ease-in-out"
          style={{
            gridTemplateRows: isSelected ? '1fr' : '0fr',
            opacity: isSelected ? 1 : 0,
          }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-gray-100 pt-2 pb-1">
              <p className="text-xs text-gray-500 leading-relaxed">{city.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const allCities = [...leftCities, ...rightCities];

export default function SpecialistsSection() {
  const { openEspecialidade } = useNav();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    let index = -1;
    const timer = setInterval(() => {
      index = (index + 1) % allCities.length;
      setSelectedCity(allCities[index].name);
    }, 3000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  useEffect(() => {
    fetch(apiUrl('/api/especialidades/'))
      .then(res => res.json())
      .then(data => {
        setEspecialidades(data.especialidades || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[SpecialistsSection] Erro ao carregar especialidades:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="especialidades" className="relative z-10 -mt-12 sm:-mt-20 pt-14 sm:pt-20">
      {/* Espaçador azul para overlapping */}
      <div style={{ background: 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 40%, #0000b3 100%)' }} className="h-16 sm:h-24"></div>
      
      <div className="bg-gray-50 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm sm:text-base font-bold tracking-widest uppercase mb-2 text-center" style={{ color: '#0c0ccc' }}>
            #VEM PRA ORCOMA
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-10 reveal">
            Somos especialistas quando o assunto é:
          </h2>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Carregando especialidades...</p>
              </div>
            ) : especialidades.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma especialidade cadastrada no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                {especialidades.map((esp, index) => (
                  <div
                    key={esp.id}
                    className="flex flex-col gap-3 group cursor-pointer reveal"
                    style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as React.CSSProperties}
                    onClick={() => openEspecialidade(esp.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openEspecialidade(esp.slug);
                      }
                    }}
                  >
                    <div
                      className="relative rounded-xl overflow-hidden bg-gray-100 transition-transform duration-300 group-hover:scale-[1.03]"
                      style={{ height: '160px' }}
                    >
                      <img
                        src={esp.imagem}
                        alt={esp.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full"
                        style={{ background: '#e8b800', color: '#000' }}
                      >
                        SAIBA MAIS
                        <ArrowRight size={14} />
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm font-semibold leading-snug group-hover:text-[#0c0ccc] transition-colors">
                      {esp.titulo}
                    </p>
                    {esp.descricao && (
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                        {esp.descricao}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-10 mt-8 sm:mt-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center reveal">Conheça nossas unidades</h3>
            <p className="text-gray-500 text-base sm:text-lg mb-6 text-center reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>Estamos prontos para atendê-lo. Descubra nossas diversas unidades.</p>
            
            <div className="flex flex-col md:flex-row items-start gap-8 sm:gap-10 reveal" style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>
              {/* Map with dots */}
              <div className="w-full max-w-56 sm:max-w-72 md:w-80 mx-auto md:mx-0 flex-shrink-0">
                <img
                  src="/Mapa%20Bahia.png"
                  alt="Mapa Bahia"
                  className="w-full h-auto"
                  draggable={false}
                />
              </div>

              {/* City cards grid */}
              <div className="flex gap-3 flex-1 w-full">
                <div className="flex flex-col gap-2.5 flex-1">
                  {leftCities.map((city) => (
                    <CityCard
                      key={city.name}
                      city={city}
                      isSelected={selectedCity === city.name}
                      onClick={() => {
                        setSelectedCity(city.name);
                        setAutoPlay(false);
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  {rightCities.map((city) => (
                    <CityCard
                      key={city.name}
                      city={city}
                      isSelected={selectedCity === city.name}
                      onClick={() => {
                        setSelectedCity(city.name);
                        setAutoPlay(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}