import React from "react";
import LegendItem from "./LegendItem";

export default function Legend({ seatAmnt }: { seatAmnt: number }) {
  return (
    <div className="flex flex-col gap-4 min-w-[142px] min-h-[126px]">
      <LegendItem
        text="Ledig"
        boxClass="border-ntlan_white"
        textClass="text-ntlan_white"
      />
      <LegendItem
        text="Opptatt"
        boxClass="border-ntlan_red"
        textClass="text-ntlan_red"
      />
      {seatAmnt > 0 && (
        <LegendItem
          text={seatAmnt === 1 ? "Din plass" : "Dine plasser"}
          boxClass="bg-ntlan_purple border-ntlan_purple"
          textClass="text-ntlan_purple"
        />
      )}
    </div>
  );
}
