import { MapPin } from 'lucide-react';

const leftCities = [
  'Salvador - Ba',
  'Feira de Santana - Ba',
  'Jequié - Ba',
  'Jequié 02 - Ba',
  'Campo Formoso - Ba',
  'Jaguaquara - Ba',
  'Maracás - Ba',
];

const rightCities = [
  'Utinga - Ba',
  'Itaberaba - Ba',
  'Itaberaba | Pública',
  'Jiquiriçá - Ba',
  'Várzea Nova - Ba',
  'Seabra - Ba',
  'São Paulo - Sp',
];

function CityCard({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: '#e8b800' }}
      >
        <MapPin size={14} color="#000" />
      </div>
      <span className="text-gray-700 text-xs font-medium leading-tight">{name}</span>
    </div>
  );
}

export default function UnitsSection() {
  return (
    <section id="unidades" className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
          Conheça nossas unidades
        </h2>

        <div className="flex flex-col md:flex-row items-start gap-8 sm:gap-10">
          {/* Map with dots */}
          <div className="w-56 sm:w-72 md:w-80 mx-auto md:mx-0 flex-shrink-0">
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
                <CityCard key={city} name={city} />
              ))}
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              {rightCities.map((city) => (
                <CityCard key={city} name={city} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
