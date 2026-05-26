import { InstagramIcon, TikTokIcon } from "@/components/icons/social-icons";
import {
  externalLinkProps,
  INSTAGRAM_URL,
  TIKTOK_URL,
} from "@/lib/links";
import { cn } from "@/lib/utils";

type SocialLinksProps = Readonly<{
  className?: string;
  size?: "sm" | "md";
  /** Ícones compactos (ex.: header ao lado do CTA). */
  variant?: "labeled" | "icon";
}>;

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary";

export function SocialLinks({
  className,
  size = "md",
  variant = "labeled",
}: SocialLinksProps) {
  const compact = size === "sm";

  if (variant === "icon") {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <a
          href={INSTAGRAM_URL}
          {...externalLinkProps}
          className={iconButtonClass}
          aria-label="Instagram Kairos tecnologias"
        >
          <InstagramIcon />
        </a>
        <a
          href={TIKTOK_URL}
          {...externalLinkProps}
          className={iconButtonClass}
          aria-label="TikTok Kairos tecnologias"
        >
          <TikTokIcon />
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <a
        href={INSTAGRAM_URL}
        {...externalLinkProps}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border text-muted-foreground transition-colors hover:text-primary",
          compact ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-xs"
        )}
        aria-label="Instagram Kairos tecnologias"
      >
        <InstagramIcon className="h-3.5 w-3.5" />
        Instagram
      </a>
      <a
        href={TIKTOK_URL}
        {...externalLinkProps}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border text-muted-foreground transition-colors hover:text-primary",
          compact ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-xs"
        )}
        aria-label="TikTok Kairos tecnologias"
      >
        <TikTokIcon className="h-3.5 w-3.5" />
        TikTok
      </a>
    </div>
  );
}
