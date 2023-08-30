import React from 'react'

export default function SidebarName({firstName, isNT, seatNumber}: {firstName: string, isNT: boolean, seatNumber?: number}) {
  return (
      <div className='flex p-2 font-medium rounded-lg bg-[#6D6973] items-center justify-between'>
          <p>{firstName}</p>
          {!seatNumber && <p className='px-2 py-1 bg-[#A29EA8] text-black'>Plass ikke valgt</p>}
          {seatNumber && <p className='px-2 py-1 bg-[#91FFC3] text-black'>Plass {seatNumber}</p>}
    </div>
  )
}
