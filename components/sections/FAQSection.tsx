import { useTranslations } from 'next-intl';
import SectionHeading from '../ui/SectionHeading';

export default function FAQSection() {
  const t = useTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeading number="05" label="FAQ" title={t('title')} subtitle={t('subtitle')} />

        <div className="divide-y divide-white/10 border border-white/10">
          {items.map((item, i) => (
            <details key={i} className="group px-6 py-5 open:bg-white/[0.03]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-white marker:content-none">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-cyan-300 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
