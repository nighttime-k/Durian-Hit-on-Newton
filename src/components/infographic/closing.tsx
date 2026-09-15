import { useCallback, useRef, useState } from "react";
import { Reveal } from "@/components/infographic/reveal";
import { useLocale } from "@/lib/locale";

export function Closing() {
  const { t } = useLocale();
  const [split, setSplit] = useState(56);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const setFromX = useCallback((clientX: number) => {
    const box = ref.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    setSplit(Math.min(90, Math.max(10, ((clientX - rect.left) / rect.width) * 100)));
  }, []);
  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragging.current) setFromX(event.clientX);
  }
  return (
    <section className="border-t border-line bg-bg">
      <div ref={ref} className="compare-stage relative isolate select-none" onPointerMove={onPointerMove} onPointerUp={() => (dragging.current = false)} onPointerCancel={() => (dragging.current = false)} onPointerLeave={() => (dragging.current = false)}>
        <img src="/aftermath.jpg" alt={t.close.altAfter} className="aftermath-photo w-full object-cover object-center" width={1792} height={1008} />
        <img src="/hero-fall.jpg" alt={t.close.altFall} className="aftermath-photo compare-before absolute inset-0 h-full w-full object-cover object-center" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} width={1792} height={1008} />
        <div className="compare-handle" style={{ left: `${split}%` }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragging.current = true; setFromX(event.clientX); }}><span className="compare-grip" /></div>
        <p className="pointer-events-none absolute top-4 left-4 text-xs text-fg/80">{t.close.before}</p>
        <p className="pointer-events-none absolute top-4 right-4 text-xs text-fg/80">{t.close.after}</p>
        <p className="sr-only">{t.close.drag}</p>
      </div>
      <Reveal>
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <blockquote className="font-display text-2xl font-medium leading-snug tracking-tight text-fg sm:text-4xl">{t.close.quote}</blockquote>
          <p className="mt-10 text-muted">{t.close.lede}</p>
          <p className="mt-16 text-xs leading-relaxed text-subtle">{t.close.note}</p>
        </div>
      </Reveal>
    </section>
  );
}
