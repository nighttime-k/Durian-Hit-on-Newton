import { createFileRoute } from "@tanstack/react-router";
import { Closing } from "@/components/infographic/closing";
import { Compare } from "@/components/infographic/compare";
import { Discoveries } from "@/components/infographic/discoveries";
import { Geography } from "@/components/infographic/geography";
import { Hero } from "@/components/infographic/hero";
import { Lab } from "@/components/infographic/lab";
import { ProgressBar } from "@/components/infographic/progress-bar";
import { SiteNav } from "@/components/infographic/site-nav";
import { Timeline } from "@/components/infographic/timeline";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main id="top" className="min-h-svh bg-bg text-fg">
      <ProgressBar />
      <Hero />
      <SiteNav />
      <Compare />
      <Lab />
      <Timeline />
      <Geography />
      <Discoveries />
      <Closing />
    </main>
  );
}
