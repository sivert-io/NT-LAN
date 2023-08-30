import React, { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { confettiProps } from "@/utils/confetti";
import { SidebarV2Props } from "./props";
import Link from "next/link";
import SidebarName from "./SidebarName";

export default function Sidebarv2({ registeredPeople }: SidebarV2Props) {
  const [isFinished, setisFinished] = useState(false);

  return (
    <div className="bg-zinc-700 w-[300px] h-[792px] relative transition-all shadow rounded-2xl py-12 px-8 flex flex-col justify-start gap-6 right-6">
      {!isFinished &&
        (registeredPeople ? (
          <>
            <div>
              <h2 className="font-bold text-xl flex justify-between items-center w-full">
                Hvor vil {registeredPeople.length === 1 ? <>du</> : <>dere</>}{" "}
                sitte?
              </h2>
              <p className="font-medium">
                {registeredPeople.length === 1 ? (
                  <>Trykk på kartet for å velge plass</>
                ) : (
                  <>Trykk på kartet for å velge plass</>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {registeredPeople.map((person) => (
                <SidebarName
                  firstName={person.firstName}
                  isNT={person.isNT}
                  key={person.firstName}
                  seatNumber={person.seatNumber}
                />
              ))}
            </div>
            <button
              onClick={() => {
                setisFinished(true);
            }}
            disabled={registeredPeople.every((person) => person.seatNumber !== undefined)}
              className="py-3 px-5 flex justify-center items-center bg-[#FFCF3F] relative rounded-3xl font-bold text-gray-900 active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fullfør
            </button>
          </>
        ) : (
          <>
            <h2 className="font-bold text-xl flex justify-between items-center w-full">
              Klar til å velge plass?
            </h2>
            <Link
              href="/register"
              className="py-3 px-5 flex justify-center items-center bg-[#91FFC3] relative rounded-3xl font-bold text-gray-900 active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kom i gang
            </Link>
          </>
        ))}

      {isFinished && (
        <span className="relative">
          Done :)
          {<ConfettiExplosion {...confettiProps} />}
        </span>
      )}
    </div>
  );
}
