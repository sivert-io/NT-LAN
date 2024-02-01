import React from "react";
import { buttonAnimation } from "../button/Button";
import Image from "next/image";

export default function FrontCard({ src, text }: { src: any; text: string }) {
  return (
    <button className={`${buttonAnimation} flex flex-col gap-2`}>
      <Image
        src={src}
        className="h-[200px] w-[600px] rounded-t-lg bg-slate-400 object-cover"
        alt="Setevelger"
        height={256}
        width={512}
      />
      <h2 className="font-bold text-xl">{text}</h2>
    </button>
  );
}
