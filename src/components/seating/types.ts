import { days } from "../sidebar/props"

export type SeatType = {
    row: number,
    col: number,
    id: number,
    firstName?: string,
    lastName?: string,
    isOnHold: boolean,
    isYours: boolean,
    daysAttending: days[];
}
