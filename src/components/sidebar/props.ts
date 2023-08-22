import { SeatType } from "../seating/types";

export type SidebarProps = {
    seatsSelected: number[];
    setHighlight: (id: number) => void;
    updateSeat: (id: number, name: string) => void;
  seats: SeatType[];
  successFunction: () => void;
  };
  
export type InputBoxType = {
    [seatId: number]: string;
  };