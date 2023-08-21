import Navbar from "@/components/navbar/Navbar";
import Seating from "@/components/seating/Seating";

export default function Home() {
  return (
    <main className="flex flex-col justify-start items-center gap-12 py-24 pt-48">
      <Navbar />
      <div
        className="fixed opacity-25 top-0 left-0 w-80 h-44 border-2 grid items-center justify-center"
        style={{ borderRadius: "0px 0px 8px 0px" }}
      >
        <p className="uppercase text-[32px]">Scene</p>
      </div>
      <h1 className="font-extrabold text-3xl text-center">
        Norsk Tipping LAN 2023
      </h1>
      <Seating />
      <div className="fixed opacity-25 -bottom-0.5 -left-0.5 -right-0.5 border-2 h-24 grid items-center justify-center">
        <p className="uppercase text-[32px]">Kantine</p>
      </div>
    </main>
  );
}
