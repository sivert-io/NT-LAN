import React from 'react'

export default function Legend() {
  return (
      <div className='flex flex-col gap-6 absolute -top-32 left-0'>
          <div className='flex gap-4 items-center'>
              <div className='border-2 border-[#E7E4ED] w-8 h-8 rounded-lg'></div>
              <p className='font-medium text-[#E7E4ED]'>Ledig</p>
          </div>
          <div className='flex gap-4 items-center'>
              <div className='border-2 border-[#FF5797] w-8 h-8 rounded-lg'></div>
              <p className='font-medium text-[#FF5797]'>Opptatt</p>
          </div>
    </div>
  )
}
