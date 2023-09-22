import React from "react";
import LegendItem from "./LegendItem";

export default function Legend({ seatAmnt }: { seatAmnt: number }) {
  return (
    <div className="flex flex-col gap-4 min-w-[142px] min-h-[126px]">
      <LegendItem
        text="Ledig"
        boxClass="border-[#E7E4ED]"
        textClass="text-[#E7E4ED]"
      />
      <LegendItem
        text="Opptatt"
        boxClass="border-[#FF5797]"
        textClass="text-[#FF5797]"
      />
      {seatAmnt > 1 && (
        <LegendItem
          text="Dine plasser"
          boxClass="bg-[#D7AAFF] border-[#D7AAFF]"
          textClass="text-[#D7AAFF]"
        />
      )}
      {seatAmnt == 1 && (
        <LegendItem
          text="Din plass"
          boxClass="bg-[#D7AAFF] border-[#D7AAFF]"
          textClass="text-[#D7AAFF]"
        />
      )}
    </div>
  );
}
