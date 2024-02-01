export type SeatProps = {
  isSelected: boolean;
  selectSeat: (id: number) => void;
  deselectAllSeats: () => void;
  id: number;
  isYours: boolean;
  isDisabled?: boolean;
  occupant: string;
  onHold: boolean;
  isHidden: boolean;
};
