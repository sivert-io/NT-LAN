import {
  Configuration,
  GetSeatsApi,
  DeleteSeatReservationsApi,
  ReserveSeatsApi,
  ReserveSeats,
} from "../api-client";
import { LAN_DATES } from "../config";
import { ReservationData } from "./types";

class Database {
  GetSeatsApi: GetSeatsApi;
  DeleteSeatReservationsApi: DeleteSeatReservationsApi;
  ReserveSeatsApi: ReserveSeatsApi;
  config: any;

  constructor(databaseUrl: string, username: string, password: string) {
    this.config = new Configuration({
      basePath: databaseUrl,
      username: username,
      password: password,
    });
    this.GetSeatsApi = new GetSeatsApi(this.config);
    this.DeleteSeatReservationsApi = new DeleteSeatReservationsApi(this.config);
    this.ReserveSeatsApi = new ReserveSeatsApi(this.config);
  }

  async getReservedSeats() {
    try {
      // Make an API request to get reserved seats
      const { data } = await this.GetSeatsApi.getReservesSeats();
      return data as ReservationData;
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching reserved seats:", error);
      throw error;
    }
  }

  async deleteReservedSeat(
    aNumber: string,
    seatsToDelete: { id: number; reservationDate: string }[]
  ) {
    try {
      console.log({
        employeeId: aNumber,
        seatReservations: seatsToDelete,
      });
      // Make an API request to delete reserved seat
      const { data } = await this.DeleteSeatReservationsApi.deleteSeats({
        employeeId: aNumber,
        seatReservations: seatsToDelete,
      });
      return data;
    } catch (error) {
      // Handle any errors here
      console.error("Error deleting reserved seat:", error);
      throw error;
    }
  }

  async reserveSeats(aNumber: string, reserveSeats: ReserveSeats) {
    try {
      const allSeats = await this.getReservedSeats();
      const seatsToDelete: { id: number; reservationDate: string }[] = [];
      reserveSeats.reserveSeats?.forEach((seat) => {
        if (seat.id) {
          allSeats.reservedSeats.forEach((dbSeat) => {
            if (
              dbSeat.id === seat.id &&
              dbSeat.personName.firstName === seat.personName?.firstName &&
              dbSeat.personName.lastName === seat.personName.lastName
            )
              seatsToDelete.push({
                id: dbSeat.id || -1,
                reservationDate: dbSeat.reservationDate,
              });
          });
          seat.reservationDates?.forEach((date) => {
            const s = { id: seat.id || -1, reservationDate: date };
            seatsToDelete.push(s);
          });
        }
      });

      await this.deleteReservedSeat(aNumber, seatsToDelete);

      // Make an API request to reserve seats
      const { data } = await this.ReserveSeatsApi.reserveSeats(reserveSeats);
      return data;
    } catch (error) {
      // Handle any errors here
      console.error("Error reserving seats:", error);
      throw error;
    }
  }
}

export default Database;
