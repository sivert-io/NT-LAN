import React, { useEffect, useState } from "react";
import Seat from "./Seat"; // Assuming you have a Seat component
import { SeatType } from "./types"; // Assuming you have defined the SeatType
import Sidebar from "../sidebar/Sidebar";
import { socket } from "../../utils/socket";
import Legend from "../legend/Legend";
import ConfettiExplosion from "react-confetti-explosion";
import { confettiProps } from "@/utils/confetti";
import { generateSeats } from "@/utils/seats";

const numCols = 6;

export default function Seating() {
  const [seatsChecked, setSeatsChecked] = useState<number[]>([]);
  const [highlightedSeat, sethighlightedSeat] = useState<number>(-1);
  const [seatList, setseatList] = useState<SeatType[]>(generateSeats(numCols));
  const [isExploding, setIsExploding] = useState(false);

  function successUpdated() {
    setSeatsChecked([]);
  }

  useEffect(() => {
    function updateSeatsSocket(seats: {[id: string]: number[]}) {
          // Extract all held seats from the heldSeats object
      const _seats = seats;
      delete _seats[socket.id];
      const allHeldSeats = Object.values(_seats).flat();
      const updatedSeats = seatList.map((seat) => {
        const isSeatOnHold = allHeldSeats.findIndex((value) => value === seat.id) !== -1;
  
        return {
          ...seat,
          isOnHold: isSeatOnHold,
        };
      });
  
      setseatList(updatedSeats);
    }

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.on("userHoldSeats", (seats: {[id: string]: number[]}) => {
      console.log("New user-selected seats incoming!", seats);
      updateSeatsSocket(seats);
    });

    return () => {
      socket.off("connect");
      socket.off("userHoldSeats")
    }
  }, [seatList, setseatList]);

  // Function to update the occupant of a specific seat by id
  const updateSeat = (
    idToUpdate: number,
    newOccupant?: string,
    isOnHold?: boolean
  ) => {
    const updatedSeats = seatList.map((seat) => {
      if (seat.id === idToUpdate) {
        return {
          ...seat,
          occupant: newOccupant !== undefined ? newOccupant : seat.occupant,
          isOnHold: isOnHold !== undefined ? isOnHold : seat.isOnHold,
        };
      }
      return seat;
    });

    setseatList(updatedSeats);
  };

  useEffect(() => {
    const updatedSeats = seatList.map((seat) => {
      if (seat.id === 4) {
        return {
          ...seat,
          occupant: "Sivert",
        };
      }
      if (seat.id === 5) {
        return {
          ...seat,
          occupant: "Ronja",
        };
      }
      return seat;
    });

    setseatList(updatedSeats);
  }, []);

  useEffect(() => {
    // Tell socket we are holding new seats
    socket.emit("HoldingNewSeats", seatsChecked);
  }, [seatsChecked]);

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
    <div className="flex flex-col gap-10">
      <div className="flex relative justify-start gap-12 mr-[364px]">
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
        <Legend />
      </div>
      <div className="flex gap-16">
        <div className="flex flex-col gap-20">
          {Array.from({
            length: Math.ceil(seatList.length / (numCols * 2)),
          }).map((_, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-6 gap-3">
              {seatList
                .filter((seat) => Math.floor(seat.row / 2) === groupIndex)
                .map((seat) => (
                  <Seat
                    onHold={seat.isOnHold}
                    occupant={seat.occupant}
                    highlight={seat.id === highlightedSeat}
                    id={seat.id}
                    selectSeat={() => toggleSeatSelection(seat.id)} // Pass the seat ID to the toggle function
                    key={seat.id}
                    isSelected={seatsChecked.includes(seat.id)}
                  />
                ))}
            </div>
          ))}
        </div>
        <Sidebar
          seats={seatList}
          setHighlight={sethighlightedSeat}
          seatsSelected={seatsChecked}
          updateSeat={updateSeat}
          successFunction={successUpdated}
        />
      </div>
    </div>
  );
}
