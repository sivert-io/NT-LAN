"use client"
import Seating from "@/components/seating/Seating";

export default function Home() {
  return (
    <main className="flex flex-col justify-start items-center gap-12 py-24 pt-48">
      <div
        className="fixed opacity-25 top-0 left-32 p-12 grid items-center justify-center"
        style={{ borderRadius: "0px 0px 8px 0px" }}
      >
        <p className="uppercase text-[32px]">Scene</p>
      </div>
      <Seating />
      <div className="fixed opacity-25 bottom-0 left-32 p-12 grid items-center justify-center">
        <p className="uppercase text-[32px]">Kantine</p>
      </div>
    </main>
  );
}
