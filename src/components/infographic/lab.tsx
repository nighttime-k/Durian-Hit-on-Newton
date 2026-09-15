import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/infographic/reveal";
import { SectionKicker } from "@/components/infographic/section-kicker";
import { useLocale } from "@/lib/locale";
import {
  APPLE_KG,
  DEFAULT_HEIGHT_M,
  DURIAN_KG,
  MAX_HEIGHT_M,
  MIN_HEIGHT_M,
  formatNumber,
  kineticEnergyJ,
  prefersReducedMotion,
  riskFromJoules,
  velocityMs,
  type RiskId,
} from "@/lib/physics";
import { cn } from "@/lib/utils";

type Fruit = "apple" | "durian";

export function Lab() {
  const { t, locale } = useLocale();
  const [height, setHeight] = useState(DEFAULT_HEIGHT_M);
  const [fruit, setFruit] = useState<Fruit>("durian");
  const [phase, setPhase] = useState<"idle" | "falling" | "hit">("idle");
  const [progress, setProgress] = useState(0);
  const [shake, setShake] = useState(false);
  const frozenHeight = useRef(height);

  const data = useMemo(() => {
    const velocity = velocityMs(height);
    const appleJ = kineticEnergyJ(APPLE_KG, height);
    const durianJ = kineticEnergyJ(DURIAN_KG, height);
    return {
      velocity,
      appleJ,
      durianJ,
      ratio: durianJ / appleJ,
      appleRisk: riskFromJoules(appleJ),
      durianRisk: riskFromJoules(durianJ),
    };
  }, [height]);

  useEffect(() => {
    if (phase !== "falling") return;
    const h = frozenHeight.current;
    if (prefersReducedMotion()) {
      setProgress(1);
      setPhase("hit");
      setShake(true);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const p = Math.min(1, (0.5 * 9.81 * elapsed * elapsed) / h);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("hit");
        setShake(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (!shake) return;
    const id = window.setTimeout(() => setShake(false), 420);
    return () => window.clearTimeout(id);
  }, [shake]);

  function drop() {
    if (phase === "falling") return;
    frozenHeight.current = height;
    setProgress(0);
    setPhase("falling");
  }

  function reset() {
    setPhase("idle");
    setProgress(0);
    setShake(false);
  }

  const risk = (id: RiskId) => t.risk[id];

  return (
    <section id="lab" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionKicker index="02">{t.lab.kicker}</SectionKicker>
          <h2 className="max-w-3xl font-display text-3xl font-medium tracking-tight text-fg sm:text-5xl">
            {t.lab.title}
          </h2>
          <p className="mt-5 max-w-2xl text-muted">
            {t.lab.bodyBefore} <span className="font-mono text-fg">E = mgh</span>{" "}
            <span className="font-mono text-fg">v = √(2gh)</span>
          </p>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-12 rounded-xl bg-raised p-5 shadow-border sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted">{t.lab.dropHeight}</p>
                <p className="mt-1 font-display text-4xl font-medium tabular-nums text-fg">
                  {formatNumber(height, height % 1 === 0 ? 0 : 1, locale)}
                  <span className="ml-2 text-xl text-muted">{t.lab.meters}</span>
                </p>
              </div>
              <p className="font-mono text-sm text-subtle">
                {t.lab.sameSpeed} {formatNumber(data.velocity, 1, locale)} m/s
              </p>
            </div>

            <label className="mt-8 block">
              <span className="sr-only">{t.lab.sliderAria}</span>
              <input
                className="drop-slider"
                type="range"
                min={MIN_HEIGHT_M}
                max={MAX_HEIGHT_M}
                step={0.5}
                value={height}
                suppressHydrationWarning
                onChange={(event) => {
                  setHeight(Number(event.target.value));
                  if (phase === "hit") reset();
                }}
              />
            </label>
            <div className="mt-1 flex justify-between font-mono text-xs text-subtle">
              <span>{t.lab.markBush}</span>
              <span>{t.lab.markApple}</span>
              <span>{t.lab.markDurian}</span>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label={t.lab.choose} className="inline-flex rounded-full bg-surface p-1">
                {(["apple", "durian"] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={fruit === id}
                    onClick={() => {
                      setFruit(id);
                      if (phase !== "falling") reset();
                    }}
                    className={cn(
                      "pressable min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-150",
                      fruit === id ? "bg-fg text-bg" : "text-muted hover:text-fg",
                    )}
                  >
                    {id === "apple" ? t.lab.apple : t.lab.durian}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={phase === "hit" ? reset : drop}
                disabled={phase === "falling"}
                className="pressable min-h-11 rounded-full bg-fg px-5 text-sm font-medium text-bg disabled:opacity-50"
              >
                {phase === "falling" ? t.lab.dropping : phase === "hit" ? t.lab.reset : t.lab.drop}
              </button>
            </div>

            <div className={cn("drop-well mt-8", shake && "is-shaking")}>
              <div className="drop-shaft">
                <div className="drop-fruit" style={{ top: `${progress * 78}%` }}>
                  <img src={fruit === "durian" ? "/durian.jpg" : "/apple.jpg"} alt="" className="size-12 rounded-full object-cover" width={48} height={48} />
                </div>
                <div className="drop-target">
                  <span className="drop-head" aria-hidden="true" />
                  <span className="text-xs text-subtle">{t.lab.target}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
