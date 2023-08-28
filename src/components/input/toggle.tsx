import { useState } from "react";

export default function Toggle({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => any;
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
        className="w-11 h-6 bg-gray-200 rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5797]"
      />
    </label>
  );
}
