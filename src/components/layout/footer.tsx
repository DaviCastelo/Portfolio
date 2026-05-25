import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BrandIcon } from "@/components/brand/brand-icon";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "@/data/site";
import { SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background">
      <div className="pointer-events-none absolute right-8 top-8 opacity-[0.04] dark:opacity-[0.04]">
        <BrandIcon variant="iconCircleDark" size="lg" animate="none" />
      </div>
      <div className="section-padding mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm space-y-4">
            <BrandLogo />
            <p className="text-sm text-muted-foreground">{SITE_TAGLINE}</p>
          </div>
          <nav className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Kairós tecnologias. Todos os direitos reservados.</p>
          <Link
            href="/admin"
            className="transition-colors hover:text-primary"
          >
            Painel Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
