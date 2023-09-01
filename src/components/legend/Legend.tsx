import React from "react";
import LegendItem from "./LegendItem";

export default function Legend({ seatAmnt }: { seatAmnt: number }) {
  return (
    <div className="flex flex-col gap-2 absolute -right-12 bottom-0 w-0 overflow-visible">
      <LegendItem text="Ledig" classColor="text-[#E7E4ED] border-[#E7E4ED]" />
      <LegendItem text="Opptatt" classColor="text-[#FF5797] border-[#FF5797]" />
      {seatAmnt > 1 && (
        <LegendItem
          text="Dine plasser"
          classColor="text-[#D7AAFF] bg-[#D7AAFF] border-[#D7AAFF]"
        />
      )}
      {seatAmnt == 1 && (
        <LegendItem
          text="Din plass"
          classColor="text-[#D7AAFF] bg-[#D7AAFF] border-[#D7AAFF]"
        />
      )}
    </div>
  );
}
