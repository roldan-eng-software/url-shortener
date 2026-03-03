'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'O URLEncurta é realmente gratuito?',
    answer: 'Sim! 100% gratuito. Sem limites de URLs ou cliques.'
  },
  {
    question: 'Como usar encurtador no Instagram bio?',
    answer: 'Cole seu link no URLEncurta, copie o link curto e cole na sua bio do Instagram.'
  },
  {
    question: 'Os links expiram?',
    answer: 'Não! Links funcionando.'
  },
  {
    question: 'Posso personalizar minha URL?',
    answer: 'Sim! Plano Premium oferece URLs customizadas.'
  },
  {
    question: 'É seguro?',
    answer: 'Totalmente seguro com SSL e sem rastreadores. Escaneamos links maliciosos.'
  },
  {
    question: 'Posso trackear cliques?',
    answer: 'Sim! Acompanhe cliques, localização e dispositivos.'
  },
  {
    question: 'Funciona com qualquer URL?',
    answer: 'Sim! Qualquer URL pública com http:// ou https://'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-title mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-text">
            Tire suas dúvidas sobre o URLEncurta
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-background rounded-xl border border-border overflow-hidden hover:shadow-glow transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between"
              >
                <span className="font-semibold text-title">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-text transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}
              >
                <p className="px-6 pb-4 text-text">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-text">
            Ainda tem dúvidas?{' '}
            <a href="#" className="text-primary font-medium hover:underline">
              Fale conosco
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
