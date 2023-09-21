import React from "react";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#423E49] p-6 rounded-2xl text-[#E8E6EB] ${className}`}>
      {children}
    </div>
  );
}
