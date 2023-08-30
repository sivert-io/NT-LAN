import { confettiProps } from '@/utils/confetti';
import Image from 'next/image';
import React, { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion';

export default function Title() {
  const [isExploding, setIsExploding] = useState(false);
  return (
    <button
    className="flex items-center justify-center gap-4 font-bold text-[32px] tracking-[6.4px] active:scale-95 duration-100 transition-all relative"
    onClick={() => {
      setIsExploding(true);
    }}
    onMouseUp={() => {
      setIsExploding(false);
    }}
    >
      <Image src='/NT.svg' width={32} height={32} alt='NT Logo'/>
    NTLAN
    {isExploding && <ConfettiExplosion {...confettiProps} />}
  </button>
  )
}
