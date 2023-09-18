import Image from "next/image";
import React from "react";
import Delete from "../../app/delete.svg";
import Edit from "../../app/fyll-ut.svg";

export default function SeatListItem({
  seatNumber,
  firstName,
  deleteSeat,
  editSeat,
  delDisable,
}: {
  seatNumber: number;
  firstName: string;
  deleteSeat: () => any;
  editSeat: (seatNumber: number) => any;
  delDisable: boolean;
}) {
  return (
    <div className="flex gap-2 w-full items-center justify-center font-bold">
      <p className="p-2 text-xs w-16 shrink-0 text-center text-[#242127] whitespace-nowrap bg-[#D7AAFF] rounded">
        Plass {seatNumber + 1}
      </p>
      <p className="p-2 text-xs text-[#242127] whitespace-nowrap truncate w-full bg-[#D7AAFF] rounded capitalize">
        {firstName}
      </p>
      <button
        onClick={() => {
          // Edit seat
          editSeat(seatNumber);
        }}
        className="p-2 bg-[#242127] shrink-0 rounded"
      >
        <Image
          className="w-4 h-4"
          src={Edit}
          width={16}
          height={16}
          alt="rediger ikon"
        />
      </button>
      <button
        disabled={delDisable}
        onClick={() => {
          // Delete seat
          deleteSeat();
        }}
        className="p-2 bg-[#242127] shrink-0 rounded disabled:bg-[#6D6973] disabled:cursor-not-allowed"
      >
        <Image
          className="w-4 h-4"
          src={Delete}
          width={16}
          height={16}
          alt="Søppel ikon"
        />
      </button>
    </div>
  );
}
