"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card } from "../card/card";
import { buttonAnimation } from "../button/Button";
import { socket } from "@/utils/socket";
import { useEffectOnce } from "react-use";
import { EventData } from "./types";

const EventButton = ({
  name,
  day,
  startTime,
  endTime,
  progress,
  eventId,
}: {
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  progress: number;
  eventId: number;
}) => (
  <Link
    href={`/v2/arrangementer/${eventId}`}
    className={`p-2 flex flex-col rounded-lg bg-[#242127] overflow-hidden relative ${buttonAnimation}`}
  >
    <p className="text-xs">
      {day} {startTime} - {endTime}
    </p>
    <h2 className="font-medium text-sm">{name}</h2>
    <span
      style={{ width: `${progress}%` }}
      className="absolute bg-[#D7AAFF] bottom-0 left-0 h-1"
    />
  </Link>
);

export function EventsCard() {
  const [eventData, setEventData] = useState<EventData>({
    events: [
      {
        name: "CS2 Kvalifisering",
        startDate: new Date("2024-02-23T18:30:00"),
        endDate: new Date("2024-02-23T20:00:00"),
        id: 0,
      },
      {
        name: "Rocket League Kvalifisering",
        startDate: new Date("2024-02-23T20:00:00"),
        endDate: new Date("2024-02-23T20:30:00"),
        id: 0,
      },
      {
        name: "Rocket League Runde 1",
        startDate: new Date("2024-02-24T16:00:00"),
        endDate: new Date("2024-02-24T16:30:00"),
        id: 0,
      },
      {
        name: "CS2 Runde 1",
        startDate: new Date("2024-02-24T16:00:00"),
        endDate: new Date("2024-02-24T17:30:00"),
        id: 0,
      },
      {
        name: "Rocket League Runde 2",
        startDate: new Date("2024-02-24T17:00:00"),
        endDate: new Date("2024-02-24T17:30:00"),
        id: 0,
      },
      {
        name: "CS2 Runde 2",
        startDate: new Date("2024-02-24T18:00:00"),
        endDate: new Date("2024-02-24T19:30:00"),
        id: 0,
      },
    ],
  });

  useEffectOnce(() => {
    socket.on("hereAreAllEvents", (data: EventData) => setEventData(data));

    return () => {
      socket.off("hereAreAllEvents");
    };
  });

  const InProgressEvents = eventData.events
    .filter(
      (event) => event.startDate < new Date() && event.endDate > new Date()
    )
    .map((event, index) => {
      const eventDuration = event.endDate.getTime() - event.startDate.getTime();
      const timeElapsed = new Date().getTime() - event.startDate.getTime();
      const eventProgress = (timeElapsed / eventDuration) * 100;
      return (
        <EventButton
          key={index}
          name={event.name}
          eventId={event.id}
          day={event.startDate.toLocaleDateString("no-NO", { weekday: "long" })}
          startTime={`${event.startDate.getHours()}:${
            (event.startDate.getMinutes() < 10 ? "0" : "") +
            event.startDate.getMinutes()
          }`}
          endTime={`${event.endDate.getHours()}:${
            (event.endDate.getMinutes() < 10 ? "0" : "") +
            event.endDate.getMinutes()
          }`}
          progress={eventProgress}
        />
      );
    });

  const upcomingEvents = eventData.events
    .filter((event) => event.startDate > new Date())
    .map((event, index) => (
      <EventButton
        key={index}
        name={event.name}
        eventId={event.id}
        day={event.startDate.toLocaleDateString("no-NO", { weekday: "long" })}
        startTime={`${event.startDate.getHours()}:${
          (event.startDate.getMinutes() < 10 ? "0" : "") +
          event.startDate.getMinutes()
        }`}
        endTime={`${event.endDate.getHours()}:${
          (event.endDate.getMinutes() < 10 ? "0" : "") +
          event.endDate.getMinutes()
        }`}
        progress={0}
      />
    ));

  return (
    <Card className="flex flex-col items-start gap-4 w-[300px]">
      <Link href="/v2/arrangementer">
        <h1 className="font-bold hover:underline">Arrangementer</h1>
      </Link>
      <div className="flex flex-col gap-2 w-full">
        {InProgressEvents.length > 0 && (
          <>
            <h2 className="font-medium text-sm">Pågående:</h2>{" "}
            {InProgressEvents}
          </>
        )}
        {upcomingEvents.length > 0 && (
          <>
            <h2 className="font-medium text-sm">Kommende:</h2>
            {upcomingEvents.map((v, index) => {
              if (index < 4) return v;
            })}
          </>
        )}
      </div>
      {upcomingEvents.length > 3 && (
        <Link
          href="/v2/arrangementer"
          className="underline text-xs font-bold text-center"
        >
          Se mer
        </Link>
      )}
    </Card>
  );
}
