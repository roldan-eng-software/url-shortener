import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Como Encurtar URLs - Tutorial Completo | URLEncurta',
  description: 'Aprenda como encurtar suas URLs em segundos. Guia passo a passo para criar links curtos e personalizados.',
};

const steps = [
  {
    step: 1,
    title: 'Acesse o URLEncurta',
    content: 'Abra seu navegador e digite urlencurta.com na barra de endereços. Você será direcionado para a página principal.',
    tip: 'O site funciona em qualquer dispositivo: computador, tablet ou celular.'
  },
  {
    step: 2,
    title: 'Cole sua URL',
    content: 'No campo indicado, cole a URL longa que você deseja encurtar. Pode ser um link de qualquer site, vídeo, artigo, produto, ou qualquer conteúdo online.',
    tip: 'Certifique-se de que a URL começa com http:// ou https://'
  },
  {
    step: 3,
    title: 'Personalize (Opcional)',
    content: 'Se você tiver um plano Premium, pode criar uma URL customizada. Digite as palavras que deseja usar no link.',
    tip: 'URLs customizadas são ótimas para branding e reconhecimento.'
  },
  {
    step: 4,
    title: 'Clique em Encurtar',
    content: 'Pressione o botão "Encurtar URL" e em segundos seu link curto será gerado automaticamente.',
    tip: 'O processo é instantâneo!'
  },
  {
    step: 5,
    title: 'Copie e Compartilhe',
    content: 'Clique no botão de copiar e compartilhe seu novo link onde quiser: redes sociais, email, WhatsApp, etc.',
    tip: 'Use também o QR Code gerado automaticamente!'
  }
];

const benefits = [
  {
    title: 'Links mais bonito',
    description: 'URLs longas e feias se tornam links curtos e profissionais.',
    icon: '✨'
  },
  {
    title: 'Fácil de lembrar',
    description: 'Links curtos são mais fáceis de lembrar e digitar.',
    icon: '🧠'
  },
  {
    title: 'Estatísticas',
    description: 'Acompanhe quantas pessoas clicaram no seu link.',
    icon: '📊'
  },
  {
    title: 'QR Code',
    description: 'Cada link vem com um QR Code automático.',
    icon: '⬛'
  }
];

export default function ComoFuncionaPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Como Encurtar suas URLs
              </h1>
              <p className="text-lg text-secondary">
                Aprenda em 5 passos simples como criar links curtos e profissionais
              </p>
            </div>
            
            <div className="space-y-8">
              {steps.map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-secondary mb-4">{item.content}</p>
                      <div className="bg-primary/5 border-l-4 border-primary pl-4 py-2">
                        <p className="text-sm text-primary font-medium">💡 Dica: {item.tip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/#encurtar"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-lg"
              >
                Encurtar minha primeira URL
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Por que usar URLs curtas?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-secondary">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ainda tem dúvidas?
            </h2>
            <p className="text-secondary mb-6">
              Nossa equipe está pronta para ajudar você a começar com o pé direito.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
            >
              Falar com Suporte
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
