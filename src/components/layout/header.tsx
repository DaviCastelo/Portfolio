"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SocialLinks } from "@/components/layout/social-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/data/site";
import { useHeroBrandInView } from "@/hooks/use-hero-brand-in-view";
import { externalLinkProps, WHATSAPP_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const heroBrandInView = useHeroBrandInView();

  return (
    <header className="header-surface fixed top-0 z-50 w-full backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 md:px-6 lg:px-8">
        <BrandLogo
          priority
          themeLogos
          className={cn(
            "transition-[opacity,transform] duration-300 ease-out",
            heroBrandInView &&
              "max-lg:pointer-events-none max-lg:translate-x-2 max-lg:opacity-0"
          )}
        />
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button asChild>
            <a href={WHATSAPP_URL} {...externalLinkProps}>
              Falar conosco
            </a>
          </Button>
          <SocialLinks variant="icon" />
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        </div>
      </div>
      <div
        className={cn(
          "header-surface border-t backdrop-blur-xl md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-4 px-4 py-6">
          <SocialLinks size="sm" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full">
            <a
              href={WHATSAPP_URL}
              {...externalLinkProps}
              onClick={() => setOpen(false)}
            >
              Falar conosco
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
