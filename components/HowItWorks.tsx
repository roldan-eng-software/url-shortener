const steps = [
  {
    number: '01',
    title: 'Cole sua URL',
    description: 'Cole a URL longa que deseja encurtar no campo indicado. Aceitamos qualquer link válido.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    number: '02',
    title: 'Personalize (Opcional)',
    description: 'Adicione um alias personalizado para sua URL ou deixe que geramos um automaticamente.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    number: '03',
    title: 'Compartilhe',
    description: 'Copie seu link curto e compartilhe em qualquer lugar. Comece a trackear seus cliques agora!',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    )
  }
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 aurora-bg">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-title mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-text max-w-2xl mx-auto">
            Encurtar suas URLs em apenas 3 passos simples
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-surface rounded-2xl p-5 sm:p-8 border border-border shadow-card-lg h-full hover:shadow-glow transition-all duration-300">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-primary/20">{step.number}</span>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-title mb-2 sm:mb-3">
                  {step.title}
                </h3>
                <p className="text-text text-sm sm:text-base">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <>
                  <div className="hidden sm:block absolute top-1/2 -right-3 sm:-right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="sm:hidden flex justify-center my-4">
                    <svg className="w-6 h-6 text-primary/30 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10 sm:mt-12">
          <a
            href="#encurtar"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
          >
            Começar Agora - É Grátis
          </a>
        </div>
      </div>
    </section>
  );
}
