import React from "react";

export default function Button({
  children,
  isActive,
  isDisabled,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
}) {
  return (
    <button
      disabled={isDisabled}
      className={`${
        isActive ? "bg-[#91FFC3] text-[#1A171F]" : "bg-[#423E49] text-[#D7D3DE]"
      }
        py-2 px-4 rounded-full font-medium text-sm
        disabled:cursor-not-allowed
        disabled:bg-[#D8D6DB] disabled:text-[#6D6973]
        `}
    >
      {children}
    </button>
  );
}
