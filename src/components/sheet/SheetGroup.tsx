import Link from "next/link";
import React from "react";

export function SheetGroup({
  children,
  title,
}: {
  children: React.ReactNode[] | React.ReactNode;
  title?: string;
}) {
  // Ensure children is always an array
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-medium text-sm text-[#A29EA8]">{title}</h2>
      <div className="flex flex-col rounded-lg px-3 bg-[#423E49]">
        {childrenArray.map((child, index) => (
          <span
            className={`${index !== 0 && "border-t border-t-[#57535F]"}`}
            key={index}
          >
            {child}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SheetGroupItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      className="py-3 gap-2 flex justify-start items-center font-medium"
      href={href}
    >
      {children}
    </Link>
  );
}
