"use client";

import { buttonAnimation } from "@/components/button/Button";
import { EventData, EventType } from "@/components/eventsCard/types";
import { socket } from "@/utils/socket";
import Link from "next/link";
import React, { useState } from "react";
import { useEffectOnce } from "react-use";
import arrowBack from "../../../arrow-backward-12.svg";
import Image from "next/image";

export default function Page({ params }: { params: { id: number } }) {
  const [eventDetails, seteventDetails] = useState<EventType>({
    name: "",
    id: params.id,
    startDate: new Date(),
    endDate: new Date(),
  });
  useEffectOnce(() => {
    socket.emit("giveMeEvents");

    socket.on("hereAreAllEvents", (data: EventData) => {
      const event = data.events.find((e) => e.id === params.id);
      if (event) seteventDetails(event);
    });
  });

  return (
    <div className="flex flex-col items-start gap-2">
      <Link href="/v2/arrangementer" className={`${buttonAnimation}`}>
        <Image src={arrowBack} alt="tilbake" width={24} height={24} />
      </Link>
      <h1 className="font-bold text-2xl">{eventDetails.name}</h1>
    </div>
  );
}
