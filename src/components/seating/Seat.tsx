import React from "react";

type SeatProps = {
  isSelected: boolean;
  selectSeat: (id: number) => void;
  id: number;
  highlight: boolean;
  occupant: string;
};

export default function Seat({
  isSelected,
  selectSeat,
  id,
  highlight,
  occupant,
}: SeatProps) {
  return (
    <button
      onClick={() => {
        selectSeat(id);
      }}
      className={`text-lg font-medium rounded-lg min-w-[128px] min-h-[64px] active:scale-95 transition-all duration-[50ms] 
      ${highlight
          ? "animate-scale bg-[#AFE560] text-gray-900"
          : isSelected
          ? "bg-purple-500"
          : occupant.length > 0 ? 'border-2 border-[#FF5797]'
          : "border-[#E7E4ED] border"
      }`}
    >
      {occupant}
    </button>
  );
}
