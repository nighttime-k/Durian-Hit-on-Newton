import { useState } from "react";
import { Reveal } from "@/components/infographic/reveal";
import { SectionKicker } from "@/components/infographic/section-kicker";
import { useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function Compare() {
  const { t } = useLocale();
  const [flipped, setFlipped] = useState<"apple" | "durian" | null>(null);
  const [weighed, setWeighed] = useState(false);

  return (
    <section id="physics" className="scroll-mt-24 border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionKicker index="01">{t.compare.kicker}</SectionKicker>
          <h2 className="max-w-3xl font-display text-3xl font-medium tracking-tight text-fg sm:text-5xl">
            {t.compare.title}
          </h2>
          <p className="mt-5 max-w-2xl text-muted">
            {t.compare.bodyBefore}{" "}
            <span className="font-mono text-fg">g = 9.81 m/s²</span> {t.compare.bodyAfter}
          </p>
        </Reveal>

        <Reveal delayMs={80}>
          <p className="mt-10 text-xs text-subtle">{t.compare.tapHint}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FruitCard
              tone="apple"
              kicker={t.compare.appleKicker}
              title={t.compare.appleTitle}
              image="/apple.jpg"
              alt={t.compare.appleAlt}
              mass="0.18"
              energy="~8"
              massLabel={t.compare.mass}
              energyLabel={t.compare.energyAt4}
              back={t.compare.appleBack}
              flipped={flipped === "apple"}
              onToggle={() => setFlipped((cur) => (cur === "apple" ? null : "apple"))}
            />
            <FruitCard
              tone="durian"
              kicker={t.compare.durianKicker}
              title={t.compare.durianTitle}
              image="/durian.jpg"
              alt={t.compare.durianAlt}
              mass="2.5"
              energy="~100"
              massLabel={t.compare.mass}
              energyLabel={t.compare.energyAt4}
              back={t.compare.durianBack}
              flipped={flipped === "durian"}
              onToggle={() => setFlipped((cur) => (cur === "durian" ? null : "durian"))}
            />
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-10 rounded-xl bg-surface p-5 shadow-border sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="min-h-5 text-sm text-muted">{weighed ? t.compare.weighed : t.compare.tapHint}</p>
              <button
                type="button"
                onClick={() => setWeighed((v) => !v)}
                className="pressable min-h-11 rounded-full bg-fg px-5 text-sm font-medium text-bg"
              >
                {t.compare.weigh}
              </button>
            </div>
            <div className="balance-well mt-8">
              <div className={cn("balance-beam", weighed && "is-tipped")}>
                <div className="balance-pan">
                  <span className="size-8 rounded-full bg-apple" />
                  <span className="mt-2 text-xs text-apple">{t.compare.appleKicker}</span>
                </div>
                <div className="balance-fulcrum" aria-hidden="true" />
                <div className="balance-pan">
                  <span className="size-12 rounded-full bg-durian" />
                  <span className="mt-2 text-xs text-durian">{t.compare.durianKicker}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={160}>
          <div className="mt-10 overflow-hidden rounded-xl bg-surface shadow-border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{t.compare.tableCaption}</caption>
              <thead className="border-b border-line text-subtle">
                <tr>
                  <th className="px-5 py-4 font-medium sm:px-6">{t.compare.colVar}</th>
                  <th className="px-5 py-4 font-medium text-apple sm:px-6">
                    {t.compare.appleKicker}
                  </th>
                  <th className="px-5 py-4 font-medium text-durian sm:px-6">
                    {t.compare.durianKicker}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.compare.rows.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-b-0">
                    <th className="px-5 py-4 font-medium text-muted sm:px-6">{row.label}</th>
                    <td className="px-5 py-4 text-fg sm:px-6">{row.apple}</td>
                    <td className="px-5 py-4 text-fg sm:px-6">{row.durian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 max-w-2xl text-sm text-subtle">{t.compare.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}

function FruitCard({
  tone,
  kicker,
  title,
  image,
  alt,
  mass,
  energy,
  massLabel,
  energyLabel,
  back,
  flipped,
  onToggle,
}: {
  tone: "apple" | "durian";
  kicker: string;
  title: string;
  image: string;
  alt: string;
  mass: string;
  energy: string;
  massLabel: string;
  energyLabel: string;
  back: string;
  flipped: boolean;
  onToggle: () => void;
}) {
  const accent = tone === "apple" ? "text-apple" : "text-durian";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flipped}
      className="overflow-hidden rounded-xl bg-surface text-left shadow-border transition-transform duration-150 hover:-translate-y-0.5"
    >
      <div className="aspect-4/3 overflow-hidden">
        <img src={image} alt={alt} className="size-full object-cover" width={1600} height={1200} />
      </div>
      <div className="p-5 sm:p-6">
        <p className={`kicker-track text-xs font-medium ${accent}`}>{kicker}</p>
        <h3 className="mt-2 font-display text-3xl font-medium text-fg">{title}</h3>
        {flipped ? (
          <p className="mt-5 text-sm leading-relaxed text-muted">{back}</p>
        ) : (
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-subtle">{massLabel}</dt>
              <dd className="mt-1 font-mono text-fg">{mass}</dd>
            </div>
            <div>
              <dt className="text-subtle">{energyLabel}</dt>
              <dd className="mt-1 font-mono text-fg">{energy}</dd>
            </div>
          </dl>
        )}
      </div>
    </button>
  );
}
