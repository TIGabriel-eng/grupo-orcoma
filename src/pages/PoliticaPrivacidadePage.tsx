import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';

const sections = [
  {
    titulo: '1. Introdução',
    conteudo: [
      'Esta Política de Privacidade descreve como o Grupo Orcoma ("nós", "nosso") coleta, utiliza e protege as informações pessoais dos visitantes e usuários do nosso site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).',
      'Ao navegar em nosso site e utilizar nossos serviços, você concorda com as práticas descritas nesta política.',
    ],
  },
  {
    titulo: '2. Dados que coletamos',
    conteudo: [
      'Coletamos informações fornecidas voluntariamente por você ao preencher formulários do site, tais como nome, e-mail, telefone, CPF/CNPJ e mensagens, bem como dados de navegação (como páginas visitadas e endereço IP) necessários para a operação e segurança do site.',
    ],
  },
  {
    titulo: '3. Uso de cookies',
    conteudo: [
      'Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento adequado do site e melhorar sua experiência de navegação.',
      'Atualmente, o site utiliza o serviço reCAPTCHA do Google nos formulários, empregado exclusivamente para fins de segurança e prevenção de fraudes e spam. Esse serviço é considerado essencial para o correto funcionamento das páginas de contato e cadastro.',
      'Não utilizamos, neste momento, cookies de rastreamento, publicidade ou análise de marketing. Caso isso venha a ocorrer no futuro, solicitaremos seu consentimento antes do carregamento de tais cookies por meio do nosso banner de consentimento.',
    ],
  },
  {
    titulo: '4. Finalidade e uso dos dados',
    conteudo: [
      'Utilizamos os dados coletados para: atender às solicitações feitas por meio dos formulários; responder a mensagens e propiciar o contato comercial; enviar novidades e conteúdo informativo quando você autorizar; e garantir a segurança e o bom funcionamento do site.',
    ],
  },
  {
    titulo: '5. Compartilhamento com terceiros',
    conteudo: [
      'Não vendemos seus dados pessoais. Podemos compartilhar informações apenas com terceiros estritamente necessários à operação do site e à prestação de serviços, como provedores de hospedagem e serviços de segurança (incluindo o Google, por meio do reCAPTCHA), sempre observando a legislação aplicável.',
    ],
  },
  {
    titulo: '6. Seus direitos como titular (LGPD)',
    conteudo: [
      'Nos termos da LGPD, você pode solicitar, a qualquer momento: confirmação da existência de tratamento de seus dados; acesso aos dados; correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; e informações sobre o compartilhamento de dados. Para exercer esses direitos, entre em contato conosco pelos canais indicados nesta política.',
    ],
  },
  {
    titulo: '7. Segurança e armazenamento',
    conteudo: [
      'Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acessos não autorizados, alterações, divulgação ou destruição. Os dados são armazenados pelo tempo necessário ao cumprimento das finalidades para as quais foram coletados ou para cumprimento de obrigações legais.',
    ],
  },
  {
    titulo: '8. Contato',
    conteudo: [
      'Para dúvidas, solicitações ou manifestações relacionadas à privacidade e ao tratamento de dados pessoais, fale conosco pelos nossos canais oficiais de atendimento disponíveis na página de contato do site.',
    ],
  },
  {
    titulo: '9. Atualizações desta política',
    conteudo: [
      'Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças legais ou nas nossas práticas. Recomendamos que você revise esta página regularmente. A data da última atualização estará sempre indicada abaixo.',
    ],
  },
];

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen">
      <div className="relative" style={{ background: BLUE }}>
        <div className="relative z-10">
          <PageNav activePage="politica-privacidade" showConsultor={false} />

          <section className="px-4 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-24 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Política de Privacidade</h1>
            <p className="text-white/70 text-sm sm:text-base">Última atualização: setembro de 2026</p>
          </section>
        </div>
      </div>

      <section className="px-4 sm:px-8 py-10 sm:py-14 max-w-4xl mx-auto">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.titulo}>
              <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: '#060660' }}>
                {section.titulo}
              </h2>
              <div className="space-y-3">
                {section.conteudo.map((paragraph) => (
                  <p key={paragraph} className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <WhatsAppToggle />
    </div>
  );
}