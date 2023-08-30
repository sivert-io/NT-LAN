import React from "react";

interface inputProps {
  onChange: (event: any) => void;
  value: string;
  disabled?: boolean;
  name: string;
  type?: string;
  maxLength?: number;
  placeholder?: string;
  id: string;
}

export default function Input({
  onChange,
  value,
  disabled,
  name,
  placeholder,
  type = "text",
  maxLength = 32,
  id,
}: inputProps) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1">
      {name}
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        name={name}
        maxLength={maxLength}
        className="w-full rounded-lg bg-[#242127] p-3 h-[40px] border-2 focus:border-[#E8E6EB] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
