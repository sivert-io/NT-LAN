import React, { useEffect, useState } from "react";
import { SeatProps } from "./props";

export default function Seat({
  isSelected,
  selectSeat,
  id,
  highlight,
  occupant,
  onHold,
}: SeatProps) {
  const seatNumberClassName =
    "absolute text-sm top-0 right-0 px-2 py-1 font-extralight";
  const [isDragged, setisDragged] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    setCurrentPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseDown = (event: any) => {
    if (occupant !== "") {
      setCurrentPosition({ x: event.clientX, y: event.clientY });
      setisDragged(true);
      selectSeat(id);

      // Calculate the offset between cursor position and element position
      const rect = event.target.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      setStartPosition({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    selectSeat(id);
    setisDragged(false);
  };

  useEffect(() => {
    if (isDragged) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragged]);

  return (
    <>
      {isDragged && (
        <div
          style={{
            position: "absolute",
            left: currentPosition.x - startPosition.x + "px",
            top: currentPosition.y - startPosition.y + "px",
            cursor: "grabbing",
          }}
          className={`${
            occupant.length > 0
              ? "border-2 border-[#FF5797] text-[#FF5797]"
              : "border border-[#E7E4ED]"
          } bg-gray-900 animate-pickup fixed z-10 flex items-center justify-center capitalize truncate whitespace-nowrap text-lg font-medium rounded-lg w-[140px] h-[63px]`}
        >
          {occupant}
          <p
            className={`${seatNumberClassName} ${
              isSelected ? "opacity-100" : "opacity-30"
            }`}
          >
            {id + 1}
          </p>
        </div>
      )}

      <button
        disabled={onHold || (!highlight && occupant !== "")}
        onClick={() => {
          selectSeat(id);
        }}
        // onMouseDown={handleMouseDown}
        // onMouseUp={() => {
        //   console.log("Drop on slot", id);
        // }}
        className={`relative capitalize disabled:transition-none disabled:scale-100 disabled:cursor-not-allowed truncate whitespace-nowrap text-lg font-medium rounded-lg w-[140px] h-[63px]
      ${
        onHold
          ? "opacity-30 border-[#E7E4ED] border hover:cursor-not-allowed"
          : "active:scale-95 transition-all duration-[100ms]"
      } 
      ${
        !onHold &&
        (isSelected
          ? "bg-[#91FFC3] text-gray-900"
          : highlight
          ? "bg-[#D7AAFF] text-gray-900"
          : occupant.length > 0
          ? "border-2 border-[#FF5797] cursor-grab text-[#FF5797]"
          : "border-[#E7E4ED] border")
      }
      ${isDragged && "opacity-0"}
          `}
      >
        {occupant}
        <p
          className={`${seatNumberClassName} ${
            isSelected || highlight ? "opacity-100" : "opacity-30"
          }`}
        >
          {id + 1}
        </p>
      </button>
    </>
  );
}
