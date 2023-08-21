"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion';

export default function Navbar() {
  const [isExploding, setIsExploding] = useState(false);
  const confettiProps = {
    force: 0.2,
    duration: 2200,
    particleCount: 30,
    width: 400,
  }
  return (
      <nav className='fixed top-0 left-0 right-0 flex flex-col justify-center items-center p-4 bg-zinc-900'>
      <button onClick={() => { setIsExploding(true) }} onMouseUp={() => { setIsExploding(false) }} className='font-extrabold text-xl hover:scale-105 active:scale-100 transition-all'>NT LAN</button>
      {isExploding && <ConfettiExplosion className='absolute' {...confettiProps} />}
    </nav>
  )
}
