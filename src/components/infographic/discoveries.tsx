import { useState } from "react";
import { Reveal } from "@/components/infographic/reveal";
import { SectionKicker } from "@/components/infographic/section-kicker";
import { useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function Discoveries() {
  const { t } = useLocale();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="after" className="scroll-mt-24 border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionKicker index="05">{t.disc.kicker}</SectionKicker>
          <h2 className="max-w-3xl font-display text-3xl font-medium tracking-tight text-fg sm:text-5xl">{t.disc.title}</h2>
          <p className="mt-4 text-xs text-subtle">{t.disc.hint}</p>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-line shadow-border sm:grid-cols-2">
          {t.disc.finds.map((find, index) => {
            const isOpen = open === find.no;
            return (
              <Reveal key={find.no} delayMs={index * 70}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : find.no)} className="h-full w-full bg-surface p-6 text-left sm:p-8">
                  <p className="font-mono text-xs text-subtle">{find.no}</p>
                  <h3 className="mt-4 font-display text-2xl font-medium text-fg">{find.title}</h3>
                  <p className="mt-3 text-sm text-muted">{find.body}</p>
                  <div className={cn("law-more", isOpen && "is-open")}><p className="mt-4 font-mono text-sm text-durian">{find.back}</p></div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
