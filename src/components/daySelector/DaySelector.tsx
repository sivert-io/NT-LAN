import React, { useState } from "react";
import Button from "../button/Button";

export default function DaySelector() {
  const [daySelected, setdaySelected] = useState("hele");
  return (
    <div className="flex flex-col gap-2">
      <p>Vis seteplan for:</p>
      <div className="flex gap-2 justify-center items-center">
        <Button isActive={daySelected === "fredag"}>Fredag</Button>
        <Button isActive={daySelected === "lordag"}>Lørdag</Button>
        <Button isActive={daySelected === "sondag"}>Søndag</Button>
        <Button isActive={daySelected === "hele"}>Hele helgen</Button>
      </div>
    </div>
  );
}
