import React, { useState } from "react";
import Button from "../button/Button";
import { days, daysAttending } from "../sidebar/props";
import { LAN_DATES } from "@/server/config";

interface dayProps {
  daySelected: typeof LAN_DATES;
  updateFilteredDay: (day: number) => void;
  enableAll: () => void;
}

export default function DaySelector({
  daySelected,
  updateFilteredDay,
  enableAll,
}: dayProps) {
  function getDay(day: days) {
    switch (day) {
      case "fredag":
        return daySelected.includes(LAN_DATES[0]);
      case "lordag":
        return daySelected.includes(LAN_DATES[1]);
      case "sondag":
        return daySelected.includes(LAN_DATES[2]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p>Vis seteplan for:</p>
      <div className="flex gap-2 justify-center items-center">
        <Button
          onClick={() => {
            updateFilteredDay(0);
          }}
          isActive={getDay("fredag")}
        >
          Fredag
        </Button>
        <Button
          onClick={() => {
            updateFilteredDay(1);
          }}
          isActive={getDay("lordag")}
        >
          Lørdag
        </Button>
        <Button
          onClick={() => {
            updateFilteredDay(2);
          }}
          isActive={getDay("sondag")}
        >
          Søndag
        </Button>
        <Button
          isActive
          activeClass="text-right px-4 text-[#C7D7FF] text-xs font-medium"
          onClick={() => {
            enableAll();
          }}
        >
          Velg alle
        </Button>
      </div>
    </div>
  );
}
