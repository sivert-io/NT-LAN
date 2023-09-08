import React, { useState } from "react";
import Button from "../button/Button";

export type daySelect = "fredag" | "lordag" | "sondag" | "hele";
interface dayProps {
  daySelected: daySelect;
  setdaySelected: (newDay: daySelect) => void;
}

export default function DaySelector({ daySelected, setdaySelected }: dayProps) {
  return (
    <div className="flex flex-col gap-2">
      <p>Vis seteplan for:</p>
      <div className="flex gap-2 justify-center items-center">
        <Button
          onClick={() => {
            setdaySelected("fredag");
          }}
          isActive={daySelected === "fredag"}
        >
          Fredag
        </Button>
        <Button
          onClick={() => {
            setdaySelected("lordag");
          }}
          isActive={daySelected === "lordag"}
        >
          Lørdag
        </Button>
        <Button
          onClick={() => {
            setdaySelected("sondag");
          }}
          isActive={daySelected === "sondag"}
        >
          Søndag
        </Button>
        <Button
          onClick={() => {
            setdaySelected("hele");
          }}
          isActive={daySelected === "hele"}
        >
          Hele helgen
        </Button>
      </div>
    </div>
  );
}
