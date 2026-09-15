import { ArrowDown } from "lucide-react";
import { LangToggle } from "@/components/infographic/lang-toggle";
import { useLocale } from "@/lib/locale";

export function Hero() {
  const { t } = useLocale();

  return (
    <header className="relative isolate h-svh min-h-svh overflow-hidden bg-bg">
      <img
        src="/hero-fall.jpg"
        alt={t.hero.alt}
        className="hero-kenburns hero-photo absolute inset-0 size-full object-cover"
        width={1792}
        height={1008}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20"
        aria-hidden="true"
      />
      <div className="absolute top-0 right-0 z-20 p-4 sm:p-5">
        <LangToggle />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
          <p className="kicker-track mb-4 font-mono text-xs text-durian">{t.hero.kicker}</p>
          <h1 className="max-w-4xl font-display text-4xl font-medium tracking-tight text-fg sm:text-6xl sm:leading-snug">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-fg/90 sm:text-lg">{t.hero.lede}</p>
          <a
            href="#physics"
            className="mt-10 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-fg transition-opacity duration-150 hover:opacity-70"
          >
            {t.hero.cta}
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
