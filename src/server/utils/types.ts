import { LAN_DATES } from "../config";

interface PersonName {
  firstName: string;
  middleName: string;
  lastName: string;
}

interface GridPosition {
  row: number;
  column: number;
}

export interface ReservedSeat {
  id: number;
  gridPosition: GridPosition;
  reservationDate: typeof LAN_DATES[0] | typeof LAN_DATES[1] | typeof LAN_DATES[2];
  personName: PersonName;
  reservedBy: {
    employeeId: string;
    personName: PersonName;
  };
}

export interface ReservationData {
  reservedSeats: ReservedSeat[];
}
