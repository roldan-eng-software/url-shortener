const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Marketing Digital',
    avatar: 'CS',
    content: 'O URLEncurta revolucionou minha forma de compartilhar links. Super rápido e as estatísticas ajudam muito no meus relatórios.',
    rating: 5
  },
  {
    name: 'Ana Paula',
    role: 'Influenciadora Digital',
    avatar: 'AP',
    content: 'Uso para todas as minhas bio links. Os clientes adoram os links personalizados. Excelente ferramenta!',
    rating: 5
  },
  {
    name: 'Roberto Ferreira',
    role: 'Empresário',
    avatar: 'RF',
    content: 'Simples, rápido e confiável. O melhor encurtador que já usei. Recomendo para todos os meus colaboradores.',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 aurora-bg">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-title mb-4">
            O que dizem nossos usuários
          </h2>
          <p className="text-lg text-text">
            Milhares de pessoas confiam no URLEncurta todo dia
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-surface rounded-2xl p-4 sm:p-6 border border-border shadow-card-lg hover:shadow-glow transition-all duration-300"
            >
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-text text-sm sm:text-base mb-4 sm:mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-title text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-sm text-text">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 sm:mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="text-text font-medium text-sm sm:text-base text-center sm:text-left">Usado por profissionais de:</div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <span className="text-lg sm:text-xl font-bold text-text-secondary">Marketing</span>
              <span className="hidden sm:inline text-text-secondary">|</span>
              <span className="text-lg sm:text-xl font-bold text-text-secondary">E-commerce</span>
              <span className="hidden sm:inline text-text-secondary">|</span>
              <span className="text-lg sm:text-xl font-bold text-text-secondary">Influencers</span>
              <span className="hidden sm:inline text-text-secondary">|</span>
              <span className="text-lg sm:text-xl font-bold text-text-secondary">Empresas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
