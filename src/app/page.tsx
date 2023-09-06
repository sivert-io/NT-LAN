"use client";
import ANumberModal from "@/components/modal/ANumberModal";
import SeatingV2 from "@/components/seating/SeatingV2";
import { useState } from "react";

export default function Home() {
  const [aNumber, setaNumber] = useState("");
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-12">
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
