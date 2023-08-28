import React from "react";

interface inputProps {
  onChange: (event: any) => void;
  value: string;
  disabled?: boolean;
  name: string;
  type?: string;
  maxLength?: number;
  id: string;
}

export default function Input({ onChange, value, disabled, name, type = 'text', maxLength = 32, id }: inputProps) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1">
      {name}
      <input
        id={id}
        type={type}
        disabled={disabled}
        name={name}
        maxLength={maxLength}
        className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
