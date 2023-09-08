import React, { useEffect, useState } from "react";
import { SeatProps } from "./props";

export default function Seat({
  isSelected,
  selectSeat,
  id,
  highlight,
  occupant,
  isDisabled,
  onHold,
}: SeatProps) {
  const seatNumberClassName =
    "absolute text-sm top-0 right-0 px-2 py-1 font-extralight";
  return (
    <>
      <button
        disabled={onHold || (!highlight && occupant !== "") || isDisabled}
        onClick={() => {
          selectSeat(id);
        }}
        className={`w-full h-[64px] flex-1 select-none relative capitalize disabled:transition-none disabled:scale-100 disabled:cursor-not-allowed truncate whitespace-nowrap 2xl:px-4 text-sm 2xl:text-lg font-medium rounded-lg
      ${
        onHold
          ? "border-2 border-[#FF5797] text-[#FF5797] hover:cursor-not-allowed"
          : "active:scale-95 transition-all duration-[100ms]"
      } 
      ${isDisabled && "cursor-not-allowed"}
      ${
        !onHold &&
        (isSelected
          ? "bg-[#91FFC3] text-gray-900"
          : highlight
          ? "bg-[#D7AAFF] text-gray-900"
          : occupant.length > 0
          ? "border-2 border-[#FF5797] cursor-grab text-[#FF5797]"
          : "border-[#E7E4ED] border")
      }
          `}
      >
        {occupant}
        <p
          className={`${seatNumberClassName} ${
            isSelected || highlight ? "opacity-100" : "opacity-75"
          }`}
        >
          {id + 1}
        </p>
      </button>
    </>
  );
}
