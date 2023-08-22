import React from 'react'

export default function Legend() {
  return (
      <div className='flex flex-col gap-6 absolute -right-12 bottom-0 w-0 overflow-visible'>
          <div className='flex gap-4 items-center'>
              <div className='border-2 border-[#E7E4ED] p-3.5 rounded-lg'></div>
              <p className='font-medium text-[#E7E4ED]'>Ledig</p>
          </div>
          <div className='flex gap-4 items-center'>
              <div className='border-2 border-[#FF5797] p-3.5 rounded-lg'></div>
              <p className='font-medium text-[#FF5797]'>Opptatt</p>
          </div>
    </div>
  )
}
