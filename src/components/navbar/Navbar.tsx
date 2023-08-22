"use client"
import { confettiProps } from '@/utils/confetti';
import Link from 'next/link'
import React, { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion';

export default function Navbar() {
  const [isExploding, setIsExploding] = useState(false);
  return (
      <nav className='fixed top-0 left-0 right-0 flex flex-col justify-center items-center p-4'>
      <button onClick={() => { setIsExploding(true) }} onMouseUp={() => { setIsExploding(false) }} className='font-extrabold text-xl hover:scale-105 active:scale-100 transition-all'>NT LAN</button>
      {isExploding && <ConfettiExplosion className='absolute' {...confettiProps} />}
    </nav>
  )
}
