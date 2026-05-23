import Link from "next/link";
import { externalLinkProps } from "@/lib/links";

interface ExternalLinkProps {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SmartLink({
  href,
  external,
  children,
  className,
}: ExternalLinkProps) {
  if (external || href.startsWith("http")) {
    return (
      <a href={href} className={className} {...externalLinkProps}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
