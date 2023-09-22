import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  isActive?: boolean;
  activeClass?: string;
  inActiveClass?: string;
  transparent?: boolean;
  customDisabled?: boolean;
}

export default function Button({
  isActive,
  activeClass,
  children,
  inActiveClass,
  transparent,
  customDisabled,
  ...rest
}: Props) {
  const buttonColor = !transparent
    ? isActive
      ? activeClass
        ? activeClass
        : "bg-[#91FFC3] text-[#1A171F]"
      : inActiveClass
      ? inActiveClass
      : "bg-[#423E49] text-[#D7D3DE]"
    : "bg-transparent";

  return (
    <button
      className={`${buttonColor}
        ${
          !transparent && "py-2 px-4"
        } rounded-full font-medium text-sm whitespace-nowrap
        ${
          !customDisabled &&
          "disabled:cursor-not-allowed disabled:bg-[#D8D6DB] disabled:text-[#6D6973]"
        }
        active:scale-95 transition-all duration-75
        `}
      {...rest}
    >
      {children}
    </button>
  );
}
