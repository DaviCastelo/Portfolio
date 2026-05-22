import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}

export function BentoCard({ children, className }: BentoCardProps) {
  return (
    <div
      className={cn(
        "glass glass-hover h-full rounded-xl p-6 transition-transform duration-300 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
