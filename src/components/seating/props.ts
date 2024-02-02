export type SeatProps = {
  isSelected: boolean;
  selectSeat: (id: number) => void;
  id: number;
  isYours: boolean;
  isDisabled?: boolean;
  occupant: string;
  toolTip?: string;
  onHold: boolean;
  isHidden: boolean;
};
