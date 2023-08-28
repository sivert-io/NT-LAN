"use client";
import Seating from "@/components/seating/Seating";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-12">
          <div className="fixed opacity-25 top-0 left-12 p-6 grid items-center justify-center select-none">
            <p className="uppercase text-[32px]">Scene</p>
          </div>
          <div className="fixed opacity-25 bottom-0 left-12 p-6 grid items-center justify-center select-none">
            <p className="uppercase text-[32px]">Kantine</p>
          </div>
          <Seating />
    </main>
  );
}
