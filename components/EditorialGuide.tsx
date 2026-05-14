import Link from 'next/link';
import { AdSlotMiddle } from '@/components/Adsense';

type GuideSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

type RelatedGuide = {
  title: string;
  href: string;
  description: string;
};

type EditorialGuideProps = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt: string;
  intro: string[];
  sections: GuideSection[];
  checklistTitle: string;
  checklist: string[];
  related: RelatedGuide[];
};

export function EditorialGuide({
  eyebrow,
  title,
  description,
  updatedAt,
  intro,
  sections,
  checklistTitle,
  checklist,
  related,
}: EditorialGuideProps) {
  const adIndex = Math.max(1, Math.floor(sections.length / 2));

  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-10 border-b border-border pb-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-primary">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-title md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-text">{description}</p>
        <p className="mt-4 text-sm text-text-secondary">
          Atualizado em {updatedAt} por URLEncurta
        </p>
      </header>

      <div className="space-y-5 text-base leading-8 text-text md:text-lg">
        {intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="my-10 rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xl font-bold text-title">{checklistTitle}</h2>
        <ul className="mt-4 grid gap-3 text-sm text-text md:grid-cols-2">
          {checklist.map((item) => (
            <li key={item} className="rounded-lg bg-background p-3">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-12">
        {sections.map((section, index) => (
          <div key={section.title}>
            {index === adIndex && <AdSlotMiddle />}
            <section className="scroll-mt-24">
              <h2 className="mb-4 text-2xl font-extrabold text-title md:text-3xl">
                {section.title}
              </h2>
              <div className="space-y-4 text-base leading-8 text-text md:text-lg">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-5 space-y-3 text-text">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-lg border border-border bg-surface p-4"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ))}
      </div>

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="text-2xl font-extrabold text-title">
          Continue lendo
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary/50"
            >
              <h3 className="font-bold text-title">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl bg-primary px-6 py-8 text-center text-white">
        <h2 className="text-2xl font-extrabold">
          Crie um link curto com mais contexto
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/90">
          Depois de revisar o destino, use o URLEncurta para gerar um link curto,
          um QR Code e uma forma simples de compartilhar sua campanha.
        </p>
        <Link
          href="/#encurtar"
          className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-white/90"
        >
          Encurtar uma URL
        </Link>
      </section>
    </article>
  );
}
