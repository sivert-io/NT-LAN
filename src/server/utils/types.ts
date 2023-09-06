export interface PersonName {
    firstName: string;
    middleName: string;
    lastName: string;
  }
  
  export interface ReservedBy {
    employeeId: string;
    personName: PersonName;
  }
  
  export interface ReserveSeat {
    id: number;
    personName: PersonName;
  }
  
  export interface ReserveSeats {
    reservedBy: ReservedBy;
    reserveSeats: ReserveSeat[];
  }
  
  export interface GridPosition {
    row: number;
    column: number;
  }
  
  export interface ReservedSeat {
    id: number;
    gridPosition: GridPosition;
    personName: PersonName;
  }
  
  export interface DeleteSeats {
    seatIdsToDelete: number[];
  }
  
  export interface DeleteSeatsWithEmployeeId {
    employeeId: string;
    seatIdsToDelete: number[];
  }
  
  export interface UpdateEmployee {
    employeeId: string;
    newEmployeeId: string;
    personName: PersonName;
  }
  
  export interface Config {
    columns: number[];
  }
  
  export interface RatingsWithAverageRating {
    ratings: number[];
    averageRating: number;
  }
  
  export interface Feedback {
    employeeId: string;
    feedback: string;
    rating: number;
  }
  
  export interface FeedbackOnly {
    feedbackOnly: string[];
  }