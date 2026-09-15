import { useState } from "react";
import { Reveal } from "@/components/infographic/reveal";
import { SectionKicker } from "@/components/infographic/section-kicker";
import { useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function Timeline() {
  const { t } = useLocale();
  const [open, setOpen] = useState(0);

  return (
    <section id="timeline" className="scroll-mt-24 border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionKicker index="03">{t.timeline.kicker}</SectionKicker>
          <h2 className="max-w-3xl font-display text-3xl font-medium tracking-tight text-fg sm:text-5xl">
            {t.timeline.title}
          </h2>
          <p className="mt-4 text-xs text-subtle">{t.timeline.hint}</p>
        </Reveal>
        <ol className="mt-14 space-y-0">
          {t.timeline.events.map((event, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={`${event.year}-${event.title}`} delayMs={index * 60}>
                <li className="timeline-row">
                  <div className="pt-1 font-mono text-sm text-durian">{event.year}</div>
                  <div className={index === t.timeline.events.length - 1 ? "border-l border-transparent pb-0 pl-5 sm:pl-8" : "border-l border-line pb-4 pl-5 sm:pl-8"}>
                    <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)} className="w-full rounded-lg py-2 text-left transition-colors duration-150 hover:text-durian">
                      <h3 className="font-display text-xl font-medium text-fg sm:text-2xl">{event.title}</h3>
                    </button>
                    <div className={cn("timeline-body", isOpen && "is-open")}>
                      <div><p className="max-w-xl pb-8 text-muted">{event.body}</p></div>
                    </div>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
