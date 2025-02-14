import React, { useState } from "react";
import { SeatProps } from "./props";

export default function SeatV2({
  isSelected,
  selectSeat,
  id,
  isYours,
  occupant,
  isDisabled,
  toolTip,
  onHold,
  isHidden,
}: SeatProps) {
  const [showTooltip, setshowTooltip] = useState(false);
  const seatNumberClassName =
    "absolute text-sm top-0 right-0 px-2 py-1 font-extralight";
  const disabled = onHold || (!isYours && occupant !== "") || isDisabled;

  return isHidden ? (
    <div />
  ) : (
    <div className="relative h-12">
      <button
        onMouseEnter={() => setshowTooltip(true)}
        onMouseLeave={() => setshowTooltip(false)}
        onClick={() => {
          if (!disabled) selectSeat(id);
        }}
        className={`h-[48px] w-[120px] select-none relative capitalize truncate whitespace-nowrap px-4 text-sm rounded-lg
      ${
        onHold &&
        "border-2 border-[#FF5797] text-[#FF5797] hover:cursor-not-allowed"
      } 
      ${disabled && "cursor-default"}
      ${
        !onHold &&
        (isSelected
          ? "bg-[#91FFC3] text-gray-900"
          : isYours
          ? "bg-[#D7AAFF] text-gray-900"
          : occupant.length > 0
          ? "border-2 border-[#FF5797] text-[#FF5797]"
          : "border-[#E7E4ED] border")
      }
          `}
      >
        {occupant}
        <p
          className={`pointer-events-none ${seatNumberClassName} ${
            isSelected || isYours ? "opacity-100" : "opacity-75"
          }`}
        >
          {id}
        </p>
      </button>
      {toolTip && !isSelected && !isYours && (
        <p
          className={`absolute pointer-events-none -top-10 left-0 right-0 flex items-center justify-center transition-all duration-200 ${
            showTooltip ? "opacity-1" : "opacity-0 translate-y-2"
          }`}
        >
          <span className="rounded-lg bg-[#FF5797] capitalize text-black whitespace-nowrap text-center py-1 px-2">
            {toolTip}
          </span>
        </p>
      )}
    </div>
  );
}
