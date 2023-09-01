export type SeatProps = {
  isSelected: boolean;
  selectSeat: (id: number) => void;
  id: number;
  highlight: boolean;
  isDisabled?: boolean;
  occupant: string;
  onHold: boolean;
};
