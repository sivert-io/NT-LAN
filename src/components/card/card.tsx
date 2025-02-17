import React from "react";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-ntlan_gray p-6 rounded-2xl text-ntlan_white ${className}`}
    >
      {children}
    </div>
  );
}
