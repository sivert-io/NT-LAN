"use client";
import ANumberModal from "@/components/modal/ANumberModal";
import SeatingV2 from "@/components/seating/SeatingV2";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [aNumber, setaNumber] = useState("");
  const [connectionError, setconnectionError] = useState("");

  useEffect(() => {
    socket.on("connect_error", (err) => {
      setconnectionError(err.message);
    });

    socket.on("connect", () => {
      setconnectionError("");
    });
    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-12">
      {connectionError !== "" && (
        <div className="fixed z-50 w-screen h-screen bg-[rgba(0,0,0,.65)] flex items-center justify-center">
          <div className="flex-col text-center p-4 flex gap-6 rounded-lg bg-[#FFC4DD] text-[#82052F] font-medium">
            <p>Seating systemet er nede! 🥺</p>
            <b className="text-xs font-bold">
              Error Message: {connectionError}
            </b>
            <p>Vennligst vent mens vi kobler deg opp igjen</p>
          </div>
        </div>
      )}
      {aNumber !== "" && (
        <>
          <div className="fixed top-0 left-12 p-6 grid items-center justify-center select-none">
            <p className="uppercase text-[32px] text-[#D8D6DB]">Scene</p>
          </div>
          <div className="fixed bottom-0 left-12 p-6 grid items-center justify-center select-none">
            <p className="uppercase text-[32px] text-[#D8D6DB]">Kantine</p>
          </div>
          <SeatingV2 aNumber={aNumber} />
        </>
      )}

      {aNumber === "" && <ANumberModal setaNumber={setaNumber} />}
    </main>
  );
}
