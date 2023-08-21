import Navbar from "@/components/navbar/Navbar";
import Seating from "@/components/seating/Seating";

export default function Home() {
  return (
    <main className="flex flex-col justify-start items-center gap-12 py-24 pt-32">
      <Navbar />
      <h1 className="font-extrabold text-3xl text-center">Norsk Tipping LAN 2023</h1>
      <Seating />
    </main>
  )
}
