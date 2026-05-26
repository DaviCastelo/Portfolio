import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getTechIconUrl } from "@/data/tech-icon-slugs";
import { cn } from "@/lib/utils";

type TechBadgeProps = Readonly<{
  name: string;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}>;

export function TechBadge({
  name,
  variant = "secondary",
  className,
}: TechBadgeProps) {
  const iconUrl = getTechIconUrl(name);

  return (
    <Badge variant={variant} className={cn("gap-1.5 font-normal", className)}>
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt=""
          width={14}
          height={14}
          className="shrink-0 dark:invert"
          unoptimized
        />
      ) : null}
      {name}
    </Badge>
  );
}
