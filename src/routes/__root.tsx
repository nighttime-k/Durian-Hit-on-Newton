import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { LocaleProvider } from "@/lib/locale";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ทุเรียนของนิวตัน" },
      { name: "description", content: "A playful physics infographic: what if a durian, not an apple, fell on Newton?" },
      { name: "theme-color", content: "#0c0b09" }
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600&family=Taviraj:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" }
    ]
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="th" className="antialiased" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body className="bg-bg text-fg">
        <LocaleProvider><Outlet /></LocaleProvider>
        <Scripts />
      </body>
    </html>
  );
}
