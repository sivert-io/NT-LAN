"use client";
import React, { useState } from "react";
import { Card } from "../card/card";
import { useEffectOnce } from "react-use";

export function Countdown() {
  // Set the target date and time for the countdown
  const targetDate = new Date("2024-02-23T14:00:00");

  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  useEffectOnce(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeRemaining = Math.max(targetDate.getTime() - now, 0);

      // Calculate days, hours, minutes, and seconds from timeRemaining
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

      // Check if the countdown has reached zero, and if so, clear the interval
      if (timeRemaining === 0) {
        clearInterval(countdownInterval);
      }
    }, 500);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(countdownInterval);
    };
  });

  return (
    <Card className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-bold">
        NTLAN {targetDate.getFullYear()} starter om:
      </h2>
      <div className="flex items-center justify-center gap-4 bg-[#242127] p-4 rounded-lg">
        <div className="flex flex-col gap-2 items-center min-w-[96px]">
          <p className="text-5xl font-bold">{days}</p>
          <p className="font-bold text-xs">{days === 1 ? "Dag" : "Dager"}</p>
        </div>
        <div className="flex flex-col gap-2 items-center min-w-[96px]">
          <p className="text-5xl font-bold">{hours}</p>
          <p className="font-bold text-xs">{hours === 1 ? "Time" : "Timer"}</p>
        </div>
        <div className="flex flex-col gap-2 items-center min-w-[96px]">
          <p className="text-5xl font-bold">{minutes}</p>
          <p className="font-bold text-xs">
            {minutes === 1 ? "Minutt" : "Minutter"}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center min-w-[96px]">
          <p className="text-5xl font-bold">{seconds}</p>
          <p className="font-bold text-xs">
            {seconds === 1 ? "Sekund" : "Sekunder"}
          </p>
        </div>
      </div>
    </Card>
  );
}
