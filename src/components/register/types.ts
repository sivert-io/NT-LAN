import { days } from "../sidebar/props";

export type RegisterFieldsType = {
  firstName: string;
  lastName: string;
  daysAttending: days[];
  seatNumber: number;
};
