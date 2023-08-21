"use client";
import React, { useEffect, useState } from "react";
import Seat from "./Seat"; // Assuming you have a Seat component
import { SeatType } from "./types"; // Assuming you have defined the SeatType
import Sidebar from "../sidebar/Sidebar";
import Legend from "../legend/Legend";

const numCols = 8;

function generateSeats() {
  let seatsList: SeatType[] = [];
  let row = 0;
  let col = 0;

  for (let index = 0; index < 40; index++) {
    if (col >= numCols) {
      col = 0;
      row++;
    }

    seatsList.push({ id: index, col, row, occupant: "" });
    col++;
  }

  return seatsList;
}

export default function Seating() {
  const [seatsChecked, setSeatsChecked] = useState<number[]>([]);
  const [highlightedSeat, sethighlightedSeat] = useState<number>(-1);
  const [seatList, setseatList] = useState<SeatType[]>([]);

  // Function to update the occupant of a specific seat by id
  const updateSeatOccupant = (idToUpdate: number, newOccupant: string) => {
    const updatedSeats = seatList.map((seat) => {
      if (seat.id === idToUpdate) {
        return {
          ...seat,
          occupant: newOccupant,
        };
      }
      return seat;
    });

    setseatList(updatedSeats);
  };

  useEffect(() => {
    setseatList(generateSeats());
  }, []);

  useEffect(() => {
    if (
      seatsChecked.length === 0 ||
      seatsChecked.findIndex((seat) => seat === highlightedSeat) === -1
    )
      sethighlightedSeat(-1);
  }, [highlightedSeat, seatsChecked]);

  const toggleSeatSelection = (seatId: number) => {
    setSeatsChecked((prevSelectedSeats) => {
      const isSelected = prevSelectedSeats.includes(seatId);
      if (isSelected) {
        return prevSelectedSeats.filter((id) => id !== seatId); // Remove the seat if it's already selected
      } else {
        return [...prevSelectedSeats, seatId]; // Add the seat if it's not selected
      }
    });
  };

  return (
    <div className="flex items-start justify-center gap-16">
      <Legend />
      <div className="flex flex-col gap-20">
        {Array.from({ length: Math.ceil(seatList.length / (numCols * 2)) }).map(
          (_, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-8 gap-2">
              {seatList
                .filter((seat) => Math.floor(seat.row / 2) === groupIndex)
                .map((seat) => (
                  <Seat
                    occupant={seat.occupant}
                    highlight={seat.id === highlightedSeat}
                    id={seat.id}
                    selectSeat={() => toggleSeatSelection(seat.id)} // Pass the seat ID to the toggle function
                    key={seat.id}
                    isSelected={seatsChecked.includes(seat.id)}
                  />
                ))}
            </div>
          )
        )}
      </div>
      <Sidebar
        setHighlight={sethighlightedSeat}
        seatsSelected={seatsChecked}
        updateSeat={updateSeatOccupant}
      />
    </div>
  );
}
