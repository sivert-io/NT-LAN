import React from "react";
import Button from "../button/Button";

export default function DaySelector() {
  return (
    <div className="flex flex-col gap-2">
      <p>Vis seteplan for:</p>
      <div className="flex gap-2 justify-center items-center">
        <Button>Fredag</Button>
        <Button>Lørdag</Button>
        <Button>Søndag</Button>
        <Button isActive>Hele helgen</Button>
      </div>
    </div>
  );
}
