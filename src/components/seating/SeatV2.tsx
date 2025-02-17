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
  seatWidth,
  seatHeight,
}: SeatProps) {
  const [showTooltip, setshowTooltip] = useState(false);
  const seatNumberClassName =
    "absolute text-sm top-0 right-0 px-2 py-1 font-extralight";
  const disabled = onHold || (!isYours && occupant !== "") || isDisabled;

  return isHidden ? (
    <div />
  ) : (
    <div className={`relative ${seatHeight ? seatHeight : "h-[48px]"}`}>
      <button
        onMouseEnter={() => setshowTooltip(true)}
        onMouseLeave={() => setshowTooltip(false)}
        onClick={() => {
          if (!disabled) selectSeat(id);
        }}
        className={`h-full ${
          seatWidth ? seatWidth : "w-[104px]"
        } select-none relative capitalize truncate whitespace-nowrap px-4 text-sm rounded-lg hover:scale-[1.025] active:scale-[.975] transition-all duration-100
      ${
        onHold &&
        "border-2 border-ntlan_red text-ntlan_red hover:cursor-not-allowed"
      } 
      ${disabled && "cursor-default"}
      ${
        !onHold &&
        (isSelected
          ? "bg-ntlan_green text-gray-900"
          : isYours
          ? "bg-ntlan_purple text-gray-900"
          : occupant.length > 0
          ? "border-2 border-ntlan_red text-ntlan_red"
          : "border-ntlan_white border")
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
          <span className="rounded-lg bg-ntlan_red capitalize text-white whitespace-nowrap text-center py-1 px-2">
            {toolTip}
          </span>
        </p>
      )}
    </div>
  );
}
