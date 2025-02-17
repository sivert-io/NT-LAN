import React from "react";
import { SeatType } from "./types";
import SeatV2 from "./SeatV2";
import { RegisterFieldsType } from "../register/types";

type SeatGroupProps = {
  seatsData: SeatType[];
  numberOfSeats: number;
  className: string;
  StartSeatNumber: number;
  sidebar_seatBeingEdited?: number;
  sidebar_firstName: string;
  myRegisteredSeats: (RegisterFieldsType & { isYou?: boolean })[];
  seatsThatAreHeld: number[];
  seatSelected?: number;
  setSeatSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
  seatWidth?: string;
};

export function SeatGroup({
  seatsData,
  className = "grid gap-3 grid-cols-7",
  StartSeatNumber = 1,
  numberOfSeats = 14,
  myRegisteredSeats,
  seatSelected,
  seatsThatAreHeld,
  seatWidth,
  setSeatSelected,
  sidebar_firstName,
  sidebar_seatBeingEdited,
}: SeatGroupProps) {
  return (
    <div className={className}>
      {Array.from({
        length: numberOfSeats,
      }).map((_, index) => {
        const seat = seatsData.find((s) => s.id === index + StartSeatNumber);
        if (!seat) return null;
        return (
          <SeatV2
            seatWidth={seatWidth}
            isHidden={seat.disabled}
            isDisabled={
              (seat.isYours &&
                !!sidebar_seatBeingEdited &&
                seat.id !== sidebar_seatBeingEdited) ||
              (seat.isYours &&
                !!sidebar_seatBeingEdited &&
                myRegisteredSeats.length === 1)
            }
            onHold={
              seatsThatAreHeld?.findIndex((s) => s === seat.id) !== -1 &&
              seat.id !== seatSelected
            }
            occupant={
              seatSelected === seat.id
                ? sidebar_firstName
                : seat.firstName || ""
            }
            isYours={seat.isYours}
            id={seat.id}
            toolTip={
              seat.firstName && seat.lastName
                ? seat.firstName === "Flere personer"
                  ? seat.firstName
                  : `${seat.firstName} ${seat.lastName}`
                : undefined
            }
            selectSeat={() => {
              return setSeatSelected(
                seatSelected === seat.id && !sidebar_seatBeingEdited
                  ? undefined
                  : seat.id
              );
            }}
            key={index + 84}
            isSelected={seatSelected === seat.id}
          />
        );
      })}
    </div>
  );
}
