import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index?: string;
  label?: string;
  title: string;
  highlightWord?: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  index,
  label,
  title,
  highlightWord,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return <span>{title}</span>;
    }
    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <em className="gradient-text not-italic font-semibold">
          {highlightWord}
        </em>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {(index || label) && (
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
          {index && <span className="text-muted-foreground">{index} — </span>}
          {label}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {renderTitle()}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
