import { confettiProps } from '@/utils/confetti';
import React, { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion';

export default function Title() {
  const [isExploding, setIsExploding] = useState(false);
  return (
    <button
    className="font-extrabold text-3xl text-center active:scale-95 transition-all relative"
    onClick={() => {
      setIsExploding(true);
    }}
    onMouseUp={() => {
      setIsExploding(false);
    }}
  >
    NT LAN 2023
    {isExploding && <ConfettiExplosion {...confettiProps} />}
  </button>
  )
}
