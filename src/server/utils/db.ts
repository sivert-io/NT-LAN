import {
  Configuration,
  GetSeatsApi,
  DeleteSeatReservationsApi,
  ReserveSeatsApi,
  ReserveSeats,
  AddFeedbackApi,
  GetFeedbackOnlyApi,
  GetRatingsAndAverageRatingApi,
  UpdateEmployeeApi,
  GetFeedbackOnlyRequest,
} from "../api-client";
import { ReservationData } from "./types";

class Database {
  GetSeatsApi: GetSeatsApi;
  DeleteSeatReservationsApi: DeleteSeatReservationsApi;
  ReserveSeatsApi: ReserveSeatsApi;
  AddFeedbackApi: AddFeedbackApi;
  GetFeedbackOnlyApi: GetFeedbackOnlyApi;
  GetRatingsAndAverageRatingApi: GetRatingsAndAverageRatingApi;
  UpdateEmployeeApi: UpdateEmployeeApi;
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
    this.AddFeedbackApi = new AddFeedbackApi(this.config);
    this.GetFeedbackOnlyApi = new GetFeedbackOnlyApi(this.config);
    this.GetRatingsAndAverageRatingApi = new GetRatingsAndAverageRatingApi(this.config);
    this.UpdateEmployeeApi = new UpdateEmployeeApi(this.config);
  }

  async getReservedSeats() {
    try {
      // Make an API request to get reserved seats
      const { data } = await this.GetSeatsApi.getReservesSeats();
      return data as ReservationData;
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching reserved seats:", error);
      return null;
    }
  }

  async deleteReservedSeat(
    aNumber: string,
    seatsToDelete: { id: number; reservationDate: string }[]
  ) {
    try {
      // Make an API request to delete reserved seat
      const { data } = await this.DeleteSeatReservationsApi.deleteSeats({
        employeeId: aNumber,
        seatReservations: seatsToDelete,
      });
      return data;
    } catch (error) {
      // Handle any errors here
      console.error("Error deleting reserved seat:", error);
      return null;
    }
  }

  async sendFeedback(aNumber: string, rating: number, feedbackText: string) {
    try {
      const { data } = await this.AddFeedbackApi.addFeedback({employeeId: aNumber, feedback: feedbackText.length > 5 ? feedbackText : undefined, rating: rating});
      return data;
    } catch (error) {
      // Handle any errors here
      console.error("Error sending feedback:", error);
      return null;
    }
  }

  async getFeedback(feedBackBody: GetFeedbackOnlyRequest) {
    try {
      const { data } = await this.GetFeedbackOnlyApi.getFeedbackOnly(feedBackBody);
      return data;
    } catch (error) {
      // Handle any errors here
      console.error("Error getting feedback:", error);
      return null;
    }
  }

  async getRatings() {
    try {
      const { data } = await this.GetRatingsAndAverageRatingApi.getRatingsAndAverageRating();
      return data;
    } catch (error) {
      // Handle any errors here
      console.error("Error getting feedback:", error);
      return null;
    }
  }

  async updateEmployeeInfo(aNumber: string, firstName: string, lastName: string) {
    try {
      const { data } = await this.UpdateEmployeeApi.updateEmployee({employeeId: aNumber, newEmployeeId: aNumber, personName: {firstName, lastName}});
      return data;
    } catch (error) {
      // Handle any errors here
      console.error("Error updating employee:", error);
      return null;
    }
  }

  async reserveSeats(aNumber: string, reserveSeats: ReserveSeats) {
    try {
      const allSeats = await this.getReservedSeats();
      if (!allSeats)
      {
        console.log('No seats returned!');
        
        return;
        }
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
      return null;
    }
  }
}

export default Database;
