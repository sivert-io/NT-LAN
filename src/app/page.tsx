"use client";
import { ConnecitonError } from "@/components/connectionError/connecitonError";
import ANumberModal from "@/components/modal/ANumberModal";
import SeatingV3 from "@/components/seating/SeatingV3";
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
    <main className="flex h-screen w-screen flex-col items-center justify-center overflow-x-hidden">
      {connectionError !== "" && (
        <ConnecitonError connectionError={connectionError} />
      )}
      {aNumber !== "" && <SeatingV3 aNumber={aNumber} />}

      {aNumber === "" && <ANumberModal setaNumber={setaNumber} />}
    </main>
  );
}
