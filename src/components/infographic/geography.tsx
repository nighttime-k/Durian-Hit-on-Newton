import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Reveal } from "@/components/infographic/reveal";
import { SectionKicker } from "@/components/infographic/section-kicker";
import { useLocale } from "@/lib/locale";
import { formatNumber, prefersReducedMotion } from "@/lib/physics";
import { cn } from "@/lib/utils";

const VIEW_W = 1280;
const VIEW_H = 720;
const DURATION_MS = 4800;
const FAIL_AT = 0.82;
const ROUTE = "M 922 374 C 880 410 820 450 760 455 C 680 462 600 490 545 540 C 510 568 505 600 486 583 C 450 560 400 500 350 450 C 315 410 295 360 282 320 C 268 280 258 250 250 220 C 230 190 205 168 186 158";
const STOPS = [
  { id: "origin" as const, at: 0.02, x: 72, y: 52, labelSide: "left" as const },
  { id: "cape" as const, at: 0.46, x: 38, y: 81, labelSide: "top" as const },
  { id: "dest" as const, at: FAIL_AT, x: 17.4, y: 25.0, labelSide: "right" as const },
];
function easeVoyage(t: number) {
  if (t >= 1) return FAIL_AT;
  if (t < 0.8) { const u = t / 0.8; const eased = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2; return eased * 0.78; }
  const u = (t - 0.8) / 0.2;
  return 0.78 + (FAIL_AT - 0.78) * (1 - (1 - u) * (1 - u));
}

export function Geography() {
  const { t, locale } = useLocale();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [voyaging, setVoyaging] = useState(false);
  const [arrived, setArrived] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);
  const [marker, setMarker] = useState({ x: 922, y: 374, angle: 150 });
  const pathT = easeVoyage(progress);
  const km = Math.round((pathT / FAIL_AT) * 10000);
  useLayoutEffect(() => { const path = pathRef.current; if (path) setPathLen(path.getTotalLength()); }, []);
  useEffect(() => { const path = pathRef.current; if (!path) return; const len = path.getTotalLength(); const d = Math.max(0, Math.min(1, pathT)); const pt = path.getPointAtLength(len * d); const ahead = path.getPointAtLength(Math.min(len, len * d + 4)); const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI; setMarker({ x: pt.x, y: pt.y, angle }); }, [pathT]);
  useEffect(() => { if (!voyaging) return; if (prefersReducedMotion()) { setProgress(1); setArrived(true); setVoyaging(false); return; } const start = performance.now(); let raf = 0; const tick = (now: number) => { const p = Math.min(1, (now - start) / DURATION_MS); setProgress(p); if (p < 1) raf = requestAnimationFrame(tick); else { setArrived(true); setVoyaging(false); } }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [voyaging]);
  function startVoyage() { if (voyaging) return; setArrived(false); setProgress(0); setVoyaging(true); }
  const remaining = Math.max(0, pathLen - pathLen * pathT);
  const moving = voyaging || arrived;
  return (
    <section id="map" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><SectionKicker index="04">{t.geo.kicker}</SectionKicker><h2 className="max-w-3xl font-display text-3xl font-medium tracking-tight text-fg sm:text-5xl">{t.geo.title}</h2><p className="mt-5 max-w-2xl text-muted">{t.geo.body}</p></Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">{t.geo.facts.map((fact, index) => <Reveal key={fact.title} delayMs={index * 70}><button type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={cn("h-full w-full rounded-xl bg-raised p-5 text-left shadow-border transition-transform duration-150 sm:p-6", active === index ? "ring-1 ring-fg/30" : "hover:-translate-y-0.5")}><p className="kicker-track text-xs font-medium text-durian">{fact.kicker}</p><h3 className="mt-3 font-display text-2xl font-medium text-fg">{fact.title}</h3><p className="mt-3 text-sm text-muted">{fact.body}</p></button></Reveal>)}</div>
        <Reveal delayMs={120}>
          <figure className="voyage-chart mt-10">
            <div className="voyage-stage">
              <img src="/antique-map.jpg" alt={t.geo.mapAlt} width={1280} height={720} className="voyage-map-img" />
              <svg className="voyage-overlay" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <path className="voyage-path-ghost" d={ROUTE} />
                <path className="voyage-path-halo" d={ROUTE} strokeDasharray={pathLen || 1} strokeDashoffset={remaining} />
                <path ref={pathRef} className="voyage-path-draw" d={ROUTE} strokeDasharray={pathLen || 1} strokeDashoffset={remaining} />
                <g className={cn("voyage-x", arrived && "is-shown")}><line x1="211" y1="168" x2="235" y2="192" /><line x1="235" y1="168" x2="211" y2="192" /></g>
                {moving && !arrived ? <g className="voyage-marker" transform={`translate(${marker.x} ${marker.y}) rotate(${marker.angle})`}><polygon points="10,0 -7,-5.5 -4,0 -7,5.5" /></g> : null}
              </svg>
              <div className={cn("voyage-fog", arrived && "is-on")} />
              {STOPS.map((stop) => { const lit = pathT >= stop.at; const failed = stop.id === "dest" && arrived; return <div key={stop.id} className={cn("voyage-pin", `is-${stop.labelSide}`, lit && "is-lit", failed && "is-fail")} style={{ left: `${stop.x}%`, top: `${stop.y}%` }}><span className="voyage-pin-dot" /><span className="voyage-pin-label"><span className="kicker-track">{t.geo.stopNotes[stop.id]}</span>{t.geo.stops[stop.id]}</span></div>; })}
              <div className={cn("impossible-seal", arrived && "is-shown")}><span>{t.geo.impossible}</span></div>
            </div>
            <figcaption className="voyage-hud"><div><p className="text-xs text-muted">{t.geo.legend}</p><p className="mt-1 font-display text-3xl font-medium tabular-nums text-fg" aria-live="polite">{formatNumber(km, 0, locale)}<span className="ml-2 text-base text-muted">{t.geo.km}</span></p>{arrived ? <p className="mt-2 max-w-lg text-sm text-apple">{t.geo.impossibleNote}</p> : null}</div><button type="button" onClick={startVoyage} disabled={voyaging} className="pressable min-h-11 shrink-0 rounded-full bg-fg px-5 text-sm font-medium text-bg disabled:opacity-50">{voyaging ? t.geo.voyaging : arrived ? t.geo.again : t.geo.voyage}</button></figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
