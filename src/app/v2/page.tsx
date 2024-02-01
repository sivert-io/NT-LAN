import FrontCard from "@/components/fontCard/FrontCard";
import React from "react";
import LanThumbnail from "../game.jpg";
import time from "../time.jpg";
import gba from "../gameboy.jpg";
import { Countdown } from "@/components/countdown/countdown";
import { EventsCard } from "@/components/eventsCard/eventsCard";

export default function page() {
  return (
    <div className="flex flex-col gap-12 items-center w-full">
      <Countdown />
      <div className="w-full flex gap-12">
        <div className="w-1/4 flex items-start justify-center">
          <EventsCard />
        </div>

        <div className="w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Siste nytt</h1>
          <div className="flex flex-col gap-8 items-center">
            <FrontCard
              text="Har du booket plass til NTLAN enda? 👀"
              src={LanThumbnail}
            />
            <FrontCard
              text="Timeplanen for helgen er nå tilgjengelig"
              src={time}
            />
            <FrontCard text="NTLAN 2023 Recap" src={gba} />
          </div>
        </div>
        <div className="w-1/4 flex items-start justify-center"></div>
      </div>
    </div>
  );
}
