import Image from "next/image";
import React, { useState } from "react";
import down from "../../app/chevron-down.svg";

export function Dropdown({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode[];
}) {
  const [showDropdown, setshowDropdown] = useState(false);
  return (
    <div>
      <button
        onClick={() => setshowDropdown(!showDropdown)}
        className="flex gap-1 items-center hover:underline font-medium text-sm"
      >
        {text}
        <Image
          className={`${
            showDropdown ? "-rotate-180" : "rotate-0"
          } transition-transform`}
          src={down}
          alt="arrow"
          width={12}
          height={12}
        />
      </button>
      {showDropdown && (
        <div className="absolute top-8 right-0 flex flex-col gap-2 w-[150px] justify-end bg-gray-600 p-4 rounded-lg">
          {children.map((child, index) => (
            <span
              key={index}
              className={`${
                index !== 0 ? "border-t border-gray-400" : ""
              } py-2`}
            >
              {child}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
