import { confettiProps } from "@/utils/confetti";
import Image from "next/image";
import React, { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

export default function Title() {
  const [isExploding, setIsExploding] = useState(false);
  return (
    <button
      className="flex select-none pointer-events-auto items-center justify-center gap-4 scale-75 sm:scale-100 font-bold text-[32px] tracking-[6.4px] sm:active:scale-95 duration-100 transition-all relative"
      onClick={() => {
        setIsExploding(true);
      }}
      onMouseUp={() => {
        setIsExploding(false);
      }}
    >
      <Image src="/NT.svg" width={32} height={32} alt="NT Logo" />
      NTLAN
      {isExploding && <ConfettiExplosion {...confettiProps} />}
    </button>
  );
}
