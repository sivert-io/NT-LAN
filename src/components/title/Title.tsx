import { confettiProps } from "@/utils/confetti";
import Image from "next/image";
import React, { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

export default function Title() {
  const [isExploding, setIsExploding] = useState(false);
  return (
    <button
      className="flex select-none items-center justify-center gap-4 font-bold text-[32px] tracking-[6.4px] active:scale-95 duration-100 transition-all relative"
      onClick={() => {
        setIsExploding(true);
      }}
      onMouseUp={() => {
        setIsExploding(false);
      }}
    >
      <Image
        className="w-auto h-[36px]"
        src="/NTLAN/horizontal_regular.svg"
        width={214}
        height={64}
        alt="NT Logo"
      />
      {isExploding && <ConfettiExplosion {...confettiProps} />}
    </button>
  );
}
