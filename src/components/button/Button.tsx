import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  isActive?: boolean;
  activeClass?: string;
  inActiveClass?: string;
  transparent?: boolean;
  customDisabled?: boolean;
  bold?: boolean;
  round?: boolean;
}

export const buttonAnimation = "active:scale-95 transition-all duration-75";

export default function Button({
  isActive,
  activeClass,
  children,
  inActiveClass,
  transparent,
  customDisabled,
  bold,
  round,
  ...rest
}: Props) {
  // Define button color based on the props
  const buttonColor = !transparent
    ? isActive
      ? activeClass || "bg-[#91FFC3] text-[#1A171F]"
      : inActiveClass || "bg-[#423E49] text-[#D7D3DE]"
    : "bg-transparent";

  // Define button padding based on transparency and roundness
  const buttonPadding = !transparent ? (!round ? "py-2 px-4" : "p-2") : "";

  // Define button font weight and size
  const buttonFont = bold ? "font-bold" : "font-medium text-sm";

  // Define button disabled styles
  const buttonDisabled = !customDisabled
    ? "disabled:cursor-not-allowed disabled:bg-[#D8D6DB] disabled:text-[#6D6973]"
    : "";

  return (
    <button
      className={`${buttonColor} flex items-center justify-center gap-2 ${buttonPadding} rounded-full ${buttonFont} whitespace-nowrap ${buttonDisabled} ${buttonAnimation}`}
      {...rest}
    >
      {children}
    </button>
  );
}
