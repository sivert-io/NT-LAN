import { useState } from "react";

export default function Toggle({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick?: () => any;
}) {
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        readOnly
      />
      <button
        onClick={onClick}
        className="w-[46px] h-[28px] bg-[#D7D3DE] rounded-full peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[1.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-ntlan_red"
      />
    </label>
  );
}
