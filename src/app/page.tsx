"use client";
import ANumberModal from "@/components/modal/ANumberModal";
import SeatingV2 from "@/components/seating/SeatingV2";
import { useState } from "react";

export default function Home() {
  const [aNumber, setaNumber] = useState("");
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-12">
      {aNumber !== "" && (
        <>
          <div className="fixed opacity-25 top-0 left-12 p-6 grid items-center justify-center select-none">
            <p className="uppercase text-[32px]">Scene</p>
          </div>
          <div className="fixed opacity-25 bottom-0 left-12 p-6 grid items-center justify-center select-none">
            <p className="uppercase text-[32px]">Kantine</p>
          </div>
          <SeatingV2 aNumber={aNumber} />
        </>
      )}

      {aNumber === "" && <ANumberModal setaNumber={setaNumber} />}
    </main>
  );
}
