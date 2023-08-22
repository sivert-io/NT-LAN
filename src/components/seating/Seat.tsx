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
  const seatNumberClassName = "absolute text-sm bottom-0 right-0 px-2 py-1 font-extralight";
  return (
    <button
      onClick={() => {
        selectSeat(id);
      }}
      className={`relative truncate whitespace-nowrap text-lg font-medium rounded-lg w-[140px] h-[63px] active:scale-95 transition-all duration-[50ms] 
      ${highlight
          ? "animate-scale bg-[#91FFC3] text-gray-900"
          : isSelected
          ? "bg-[#D7AAFF] text-gray-900"
          : occupant.length > 0 ? 'border-2 border-[#FF5797]'
          : "border-[#E7E4ED] border"
      }`}
    >
      {occupant}
      <p className={`${seatNumberClassName} ${isSelected ? 'opacity-100' : 'opacity-30'}`}>{id + 1}</p>
    </button>
  );
}
