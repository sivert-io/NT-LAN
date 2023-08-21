"use client"
import React, { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

type SidebarProps = {
    seatsSelected: number[];
    setHighlight: (id: number) => void;
    updateSeat: (id: number, name: string) => void;
};

type InputBoxType = {
  [seatId: number]: string;
};

export default function Sidebar({ seatsSelected, setHighlight, updateSeat }: SidebarProps) {
    const [inputBoxes, setInputBoxes] = useState<InputBoxType>({});
    const [textBoxesSelected, setTextBoxesSelected] = useState<number[]>([])
    const [isExploding, setIsExploding] = useState(false);
    const confettiProps = {
      force: 0.2,
      duration: 2200,
      particleCount: 30,
      width: 600,
    }

    useEffect(() => {
        if (textBoxesSelected.length === 0)
            setHighlight(-1);
    }, [setHighlight, textBoxesSelected])

  const handleInputChange = (id: number, newValue: string) => {
    setInputBoxes((prevInputBoxes) => ({
      ...prevInputBoxes,
      [id]: newValue,
    }));
      
      updateSeat(id, newValue);
  };
    
    let selected = seatsSelected.sort((a, b) => a - b);

  return (
      <div className='bg-zinc-700 min-h-[320px] relative min-w-[256px] transition-all shadow rounded-lg p-6 flex flex-col justify-center items-center gap-4 right-6'>
          <h2 className='font-medium'>{seatsSelected.length === 0 ? 'Ingen seter valgt' : 'Fyll inn navn'}</h2>
      {selected.map((id) => (
          <input
              placeholder='Navn'
              className='rounded-lg bg-zinc-800 p-2 border-2 focus:border-[#AFE560] border-transparent outline-none'
          key={id}
          value={inputBoxes[id] || ''}
              onChange={(event) => handleInputChange(id, event.target.value)}
              onFocus={() => {
                  setHighlight(id)
                  setTextBoxesSelected((old) => [...old, id])
              }}
              onBlur={() => {
                setTextBoxesSelected((old) => old.filter((oldId) => oldId !== id));
              }}
        />
      ))}
          {seatsSelected.length > 0 && <button
              onClick={() => { setIsExploding(true) }}
              onMouseUp={() => { setIsExploding(false) }}
              className='py-2 px-4 bg-[#FF5797] rounded-lg font-medium text-white active:scale-95 transition-all duration-[50ms]'>Oppdater</button>}
          {isExploding && <ConfettiExplosion colors={['#FF5797', '#AFE560', '#E7E4ED', '#A855F7']} className='absolute bottom-12' {...confettiProps} />}
    </div>
  );
}
