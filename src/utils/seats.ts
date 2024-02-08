import { RegisterFieldsType } from "@/components/register/types";
import { SeatType } from "@/components/seating/types";

export function generateSeats(numCols: number, numTotalSeats: number) {
  let seatsList: SeatType[] = [];
  let row = 0;
  let col = 0;
  let count = 0;

  for (let index = 0; index < numTotalSeats; index++) {
    if (col >= numCols) {
      col = 0;
      row++;
    }

    // const isDisabled = (col === 0 || col === 1) && (row === 0 || row === 1);
    const isDisabled = false;
    
    if (!isDisabled)
      count += 1;

    seatsList.push({
      id: count,
      col,
      row,
      disabled: isDisabled,
      firstName: "",
      lastName: "",
      reservationDate: "",
      isYours: false,
    });
    col++;
  }

  return seatsList;
}