import { SeatType } from "@/components/seating/types";

export function generateSeats(numCols: number) {
    let seatsList: SeatType[] = [];
    let row = 0;
    let col = 0;
  
    for (let index = 0; index < 48; index++) {
      if (col >= numCols) {
        col = 0;
        row++;
      }
  
      seatsList.push({ id: index, col, row, firstName: '', lastName: '', isOnHold: false, isYours: false });
      col++;
    }
  
    return seatsList;
  }