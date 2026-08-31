import { useState, useMemo, useRef } from 'react';
import { buildWhatsAppUrl, trackWhatsAppClick } from '../config/attendant';
const ALIQUOTA_MULTA_CANCELAMENTO = 0.01;
const ALIQUOTA_OMISSAO = 0.35;
const ALIQUOTA_CREDITOS_PERDIDOS = 0.265;
const MULTA_POR_NAO_ESCRITURACAO = 200;
const ALIQUOTA_DIVERGENCIA = 0.28;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat('pt-BR').format(value);

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  badge,
  badgeBlue,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  badge?: string;
  badgeBlue?: boolean;
}) {
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const clamp = (v: number) => Math.min(Math.max(v, min), max);

  const commit = (raw: string) => {
    const parsed = Number(raw.replace(/\D/g, '')) || 0;
    onChange(clamp(parsed));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
          {badge && (
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md flex-shrink-0"
              style={
                badgeBlue
                  ? { background: 'rgba(12, 12, 204, 0.08)', color: '#0c0ccc' }
                  : { background: 'rgba(232, 184, 0, 0.18)', color: '#a87d00' }
              }
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:ml-auto flex-shrink-0">
          {prefix && <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{prefix}</span>}
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={focused ? draft : formatNumber(value)}
            onFocus={() => {
              setFocused(true);
              setDraft(String(value));
              inputRef.current?.select();
            }}
            onBlur={() => {
              commit(draft);
              setFocused(false);
            }}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '');
              setDraft(raw);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commit(draft);
                inputRef.current?.blur();
              }
            }}
            className="text-sm font-semibold text-gray-900 tabular-nums flex-shrink-0 text-right bg-white border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#e8b800]/60 focus:border-[#e8b800] transition-all"
            style={{ width: 'min(40vw, 7.5rem)' }}
          />
          {suffix && <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="risk-slider"
        style={{ '--progress': `${progress}%` } as React.CSSProperties}
      />
    </div>
  );
}

function ProgressBar({ value, total, red }: { value: number; total: number; red?: boolean }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, background: red ? '#e74c3c' : '#e8b800' }}
      />
    </div>
  );
}

function RiskItem({ label, value, total, red }: { label: string; value: number; total: number; red?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: red ? '#e74c3c' : '#e8b800' }}
        />
        <span className="text-xs sm:text-sm text-gray-600">{label}</span>
        <span className="ml-auto text-sm font-bold text-gray-900 tabular-nums">{formatCurrency(value)}</span>
      </div>
      <ProgressBar value={value} total={total} red={red} />
    </div>
  );
}

export default function CalculadoraRiscoFiscal() {
  // Defaults ajustados: "fora do prazo" é uma fatia pequena do total de
  // cancelamentos de uma empresa, então o valor default e o teto do slider
  // foram reduzidos para refletir isso melhor.
  const [docCancelados, setDocCancelados] = useState(50);
  const [valorMedioDoc, setValorMedioDoc] = useState(50000);
  const [notasNaoEscrituradas, setNotasNaoEscrituradas] = useState(5000);
  const [comprasSemCredito, setComprasSemCredito] = useState(5000000);
  const [opSemDocFiscal, setOpSemDocFiscal] = useState(300);
  const [divergenciaCaixa, setDivergenciaCaixa] = useState(2000000);

  const riscos = useMemo(() => {
    const multaCancelamento = docCancelados * valorMedioDoc * ALIQUOTA_MULTA_CANCELAMENTO;
    const omissaoSemDoc = opSemDocFiscal * valorMedioDoc * ALIQUOTA_OMISSAO;
    const creditosPerdidos = comprasSemCredito * ALIQUOTA_CREDITOS_PERDIDOS;
    const penalidadeNaoEscrituracao = notasNaoEscrituradas * MULTA_POR_NAO_ESCRITURACAO;
    const divergenciaCaixaValor = divergenciaCaixa * ALIQUOTA_DIVERGENCIA;

    const riscoMensal =
      multaCancelamento + omissaoSemDoc + creditosPerdidos + penalidadeNaoEscrituracao + divergenciaCaixaValor;
    const riscoAnual = riscoMensal * 12;

    return {
      multaCancelamento,
      omissaoSemDoc,
      creditosPerdidos,
      penalidadeNaoEscrituracao,
      divergenciaCaixaValor,
      riscoMensal,
      riscoAnual,
    };
  }, [docCancelados, valorMedioDoc, notasNaoEscrituradas, comprasSemCredito, opSemDocFiscal, divergenciaCaixa]);

  return (
    <section
      className="py-14 sm:py-20 px-4 sm:px-6"
      style={{ background: 'linear-gradient(to bottom, #051066 0%, #051066 56%, #FFFFFF 56%, #FFFFFF 100%)' }}
    >
      <style>{`
        .risk-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(to right, #e8b800 0%, #e8b800 var(--progress, 0%), #e5e7eb var(--progress, 0%), #e5e7eb 100%);
        }
        .risk-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e8b800;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
        .risk-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e8b800;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-white font-bold mb-3" style={{ fontSize: 'clamp(2.1rem, 4vw, 2.625rem)' }}>Calculadora de Risco Fiscal</h2>
          <p className="text-white/65 max-w-2xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(1.225rem, 2.4vw, 1.4rem)' }}>
            Estimativa educativa de exposição fiscal com base em situações comuns de gestão tributária. Mova os controles e veja onde pode haver risco na sua operação.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-10 flex flex-col gap-6 sm:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
          {/* ===== Seção de Inputs ===== */}
          <div className="rounded-2xl p-5 sm:p-8" style={{ background: '#f7f7fb' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="flex flex-col gap-6">
                <SliderInput
                  label="Documentos fiscais cancelados / mês fora do prazo"
                  value={docCancelados}
                  onChange={setDocCancelados}
                  min={0}
                  max={1000}
                />
                <SliderInput
                  label="Notas recebidas não escrituradas / mês"
                  value={notasNaoEscrituradas}
                  onChange={setNotasNaoEscrituradas}
                  min={0}
                  max={50000}
                />
                <SliderInput
                  label="Operações sem documento fiscal"
                  value={opSemDocFiscal}
                  onChange={setOpSemDocFiscal}
                  min={0}
                  max={5000}
                  badge="VARIA POR UF"
                />
              </div>

              <div className="flex flex-col gap-6">
                <SliderInput
                  label="Valor médio por documento"
                  value={valorMedioDoc}
                  onChange={setValorMedioDoc}
                  min={0}
                  max={500000}
                  step={1000}
                  prefix="R$ "
                />
                <SliderInput
                  label="Compras sem créditos IBS/CBS (R$/mês)"
                  value={comprasSemCredito}
                  onChange={setComprasSemCredito}
                  min={0}
                  max={50000000}
                  step={100000}
                  prefix="R$ "
                  badge="LC 214/25"
                  badgeBlue
                />
                <SliderInput
                  label="Divergência caixa / escrituração (R$/mês)"
                  value={divergenciaCaixa}
                  onChange={setDivergenciaCaixa}
                  min={0}
                  max={50000000}
                  step={100000}
                  prefix="R$ "
                  badge="ESTIMATIVA"
                />
              </div>
            </div>
          </div>

          {/* ===== Seção de Resultados ===== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Composição do Risco */}
            <div className="rounded-2xl p-5 sm:p-8 md:col-span-3" style={{ background: '#f7f7fb' }}>
              <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Composição do Risco</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md border border-gray-200 text-gray-400">
                  Riscos adicionais não calculados
                </span>
              </div>

              <div className="flex flex-col gap-5">
                <RiskItem
                  label="Multa por cancelamento fora do prazo"
                  value={riscos.multaCancelamento}
                  total={riscos.riscoMensal}
                />
                <RiskItem
                  label="Operação sem documento fiscal (multa estadual)"
                  value={riscos.omissaoSemDoc}
                  total={riscos.riscoMensal}
                />
                <RiskItem
                  label="Créditos tributários perdidos (ICMS/PIS/COFINS)"
                  value={riscos.creditosPerdidos}
                  total={riscos.riscoMensal}
                  red
                />
                <RiskItem
                  label="Custo estimado por não escrituração"
                  value={riscos.penalidadeNaoEscrituracao}
                  total={riscos.riscoMensal}
                  red
                />
                <RiskItem
                  label="Divergência caixa / escrituração (estimativa)"
                  value={riscos.divergenciaCaixaValor}
                  total={riscos.riscoMensal}
                  red
                />
              </div>

              <p className="text-[11px] text-gray-400 mt-6 leading-relaxed">
                *Valores estimados com base em alíquotas médias e na legislação vigente{' '}
                <span className="font-semibold">
                  (Lei 8.137/90 — crimes contra a ordem tributária; RICMS estadual; LC 214/2025 — Reforma Tributária).
                </span>{' '}
                Multas administrativas variam por estado e por
                situação, e nem toda ocorrência resulta em autuação.{' '}
                <span className="text-red-500">
                  Esta calculadora não substitui uma análise contábil ou jurídica do seu caso específico.
                </span>
              </p>
            </div>

            {/* Totais */}
            <div className="flex flex-col gap-4 md:col-span-1">
              <div
                className="rounded-2xl text-center py-8 px-5"
                style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)' }}
              >
                <span className="block text-[11px] font-bold tracking-[2px] text-white/60 uppercase mb-3">
                  Exposição Estimada / Mês
                </span>
                <span className="block text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  {formatCurrency(riscos.riscoMensal)}
                </span>
              </div>

              <div
                className="rounded-2xl text-center py-8 px-5"
                style={{ background: 'linear-gradient(135deg, #2d1b2a 0%, #4a1c2e 100%)' }}
              >
                <span className="block text-[11px] font-bold tracking-[2px] text-white/60 uppercase mb-3">
                  Exposição Estimada / Ano
                </span>
                <span className="block text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  {formatCurrency(riscos.riscoAnual)}
                </span>
              </div>

              <button
                onClick={() => {
                  trackWhatsAppClick('calculadora_risco_fiscal');
                  window.open(
                    buildWhatsAppUrl(
                      `Olá! Gostaria de conversar com um especialista sobre a Calculadora de Risco Fiscal.\n\nMinha empresa cancela aproximadamente *${formatNumber(docCancelados)}* notas fiscais fora do prazo no mês.\n\nConsegue me ajudar?`
                    ),
                    '_blank'
                  );
                }}
                className="mt-auto w-full py-4 px-4 rounded-2xl text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02] active:scale-100 text-center"
                style={{ background: '#e8b800', color: '#000' }}
              >
                Preciso de ajuda agora mesmo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}