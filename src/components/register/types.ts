export type RegisterFieldsType = {
  firstName: string;
  lastName: string;
  seatNumber: number;
  reservationDate: string;
};

export type mappedSeats = {
  [reservationDate: string | number]: RegisterFieldsType[];
}