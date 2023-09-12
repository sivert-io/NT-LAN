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

export type days = 'fredag' | 'lordag' | 'sondag';

export type SidebarV3Props = {
  registeredPeople: RegisterFieldsType[];
  updateRegisteredPeople: (person: RegisterFieldsType) => any;
  deletePerson: (seatNumber: number) => any;
  selectedSeat?: number;
  setSelectedSeat: (seatNumber: number | undefined) => any;
  firstName: string;
  lastName: string;
  setFirstName: (newString: string) => any;
  setLastName: (newString: string) => any;
  isEditing: boolean;
  setisEditing: (yes: boolean) => any;
  seatEditing?: number;
};

export type InputBoxType = {
  [seatId: number]: string;
};
