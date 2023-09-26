import { RegisterFieldsType, mappedSeats } from "../register/types";
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

export type days = 'fredag' | 'lordag' | 'sondag'

export type daysAttending = {
  [day in days]: boolean;
};

export type SidebarV3Props = {
  myRegisteredSeats: (RegisterFieldsType & {isYou?: boolean})[];
  saveSeat: (updateYou: boolean) => any;
  deleteSeat: (seatNumber: number, firstName: string) => any;
  seatSelected?: number;
  setSelectedSeat: (seatNumber: number | undefined) => any;
  sidebar_firstName: string;
  sidebar_lastName: string;
  sidebar_setFirstName: (newString: string) => any;
  sidebar_setLastName: (newString: string) => any;
  sidebar_seatBeingEdited: number | undefined;
  sidebar_setSeatBeingEdited: (yes: number | undefined) => any;
  sidebar_daysAttending: daysAttending;
  sidebar_setDaysAttending: (newDays: daysAttending) => void;
  sidebar_updateDay: (day: days, newValue: boolean) => void;
  setFilteredDays: (newDays: string[]) => void;
  filteredDays: string[];
  seatsMappedBySeatId: mappedSeats;
  isYou: boolean;
  setIsYou: (n: boolean) => void;
};

export type InputBoxType = {
  [seatId: number]: string;
};
