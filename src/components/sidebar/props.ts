import { RegisterFieldsType } from "../register/types";
import { SeatType } from "../seating/types";

export type SidebarProps = {
  seatsSelected: number[];
  setHighlight: (id: number) => void;
  updateSeat: (id: number, name: string) => void;
  seats: SeatType[];
  successFunction: () => void;
};

export type SidebarV2Props = {
  registeredPeople?: RegisterFieldsType[];
};

export type SidebarV3Props = {
  registeredPeople: RegisterFieldsType[];
  updateRegisteredPeople: (person: RegisterFieldsType) => any;
  deletePerson: (seatNumber: number) => any;
  selectedSeat?: number;
  setSelectedSeat: (seatNumber: number) => any;
  firstName: string;
  lastName: string;
  setFirstName: (newString: string) => any;
  setLastName: (newString: string) => any;
};

export type InputBoxType = {
  [seatId: number]: string;
};
