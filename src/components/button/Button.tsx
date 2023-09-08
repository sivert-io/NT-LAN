import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  isActive?: boolean;
  activeClass?: string;
}

export default function Button({
  isActive,
  activeClass,
  children,
  ...rest
}: Props) {
  const buttonColor = isActive
    ? activeClass
      ? activeClass
      : "bg-[#91FFC3] text-[#1A171F]"
    : "bg-[#423E49] text-[#D7D3DE]";

  return (
    <button
      className={`${buttonColor}
        py-2 px-4 rounded-full font-medium text-sm
        disabled:cursor-not-allowed disabled:bg-[#D8D6DB] disabled:text-[#6D6973]
        active:scale-95 transition-all duration-75
        `}
      {...rest}
    >
      {children}
    </button>
  );
}
