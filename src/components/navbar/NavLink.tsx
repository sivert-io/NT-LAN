import Link from "next/link";
import React from "react";

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`hover:underline font-medium text-sm flex gap-1 ${className}`}
    >
      {children}
    </Link>
  );
}
