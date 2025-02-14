import React, { useEffect, useState } from "react";
import { socket } from "../../utils/socket";
import { generateSeats } from "@/utils/seats";
import Title from "../title/Title";
import { RegisterFieldsType, mappedSeats } from "../register/types";
import DaySelector from "../daySelector/DaySelector";
import Legend from "../legend/Legend";
import SeatV2 from "./SeatV2";
import { days, daysAttending } from "../sidebar/props";
import {
  LAN_DATES,
  numberOfColumns,
  numberOfColumnsClass,
  totalNumberOfSeats,
} from "@/server/config";
import Sidebarv4 from "../sidebar/SidebarV4";
import { ReserveSeat } from "@/server/api-client";

export default function SeatingV3({ aNumber }: { aNumber: string }) {
  // Which seat have we currently selected?
  const [seatSelected, setSeatSelected] = useState<number | undefined>(
    undefined
  );
  const [hasArrived, sethasArrived] = useState(false);
  // Sidebar usestates
  const [sidebar_firstName, sidebar_setFirstName] = useState("");
  const [sidebar_lastName, sidebar_setLastName] = useState("");
  const [sidebar_isYou, sidebar_setIsYou] = useState(false);
  const [sidebar_daysAttending, sidebar_setDaysAttending] =
    useState<daysAttending>({
      fredag: false,
      lordag: false,
      sondag: false,
    });

  // Which seat are we editing?
  const [sidebar_seatBeingEdited, sidebar_setSeatBeingEdited] = useState<
    number | undefined
  >(undefined);

  // Which days are we viewing
  const [daySelected, setdaySelected] = useState<typeof LAN_DATES>(LAN_DATES);

  // Seats registered to my aNumber
  const [myRegisteredSeats, setMyRegisteredSeats] = useState<
    (RegisterFieldsType & { isYou?: boolean })[]
  >([]);

  // Seats fetched from API
  const [seatsMappedByDay, setSeatsMappedByDay] = useState<
    RegisterFieldsType[]
  >([]);

  // All data for seats
  const [seatsMappedBySeatId, setseatsMappedBySeatId] = useState<mappedSeats>(
    {}
  );

  // The seats we display to the user
  const [seatsToDisplay, setseatsToDisplay] = useState(
    generateSeats(numberOfColumns, totalNumberOfSeats)
  );

  // All held seats
  const [seatsThatAreHeld, setseatsThatAreHeld] = useState<number[]>([]);

  // When user connects
  useEffect(() => {
    if (!hasArrived) {
      socket.emit("iHaveArrived", aNumber);
      sethasArrived(true);
    }

    socket.on("hereAreYourRegisteredSeats", (seats: RegisterFieldsType[]) => {
      console.log("Server sent us our owned seats:", seats);
      !!seats ? setMyRegisteredSeats(seats) : setMyRegisteredSeats([]);
    });

    socket.on("hereAreAllRegisteredSeats", (seats: mappedSeats) => {
      console.log("Server sent us seats mapped by seatId:", seats);
      setseatsMappedBySeatId(seats);
    });

    socket.on("hereAreAllHeldSeats", (seats: number[]) => {
      const s = seats;
      const index = seats.findIndex((v) => v === seatSelected);

      if (index !== -1) s.splice(index, 1);
      // console.log("Server sent us all held seats:", s);

      setseatsThatAreHeld(s);
    });

    socket.on("hereAreSeatsForDate", (seats: RegisterFieldsType[]) => {
      // console.log("Server sent us seats for requested days:", seats);
      setSeatsMappedByDay(seats);
    });

    return () => {
      socket.off("hereAreYourRegisteredSeats");
      socket.off("hereAreAllRegisteredSeats");
      socket.off("hereAreAllHeldSeats");
      socket.off("hereAreSeatsForDate");
    };
  }, [aNumber, hasArrived, myRegisteredSeats.length, seatSelected]);

  // When selected seat updates
  useEffect(() => {
    socket.emit("iAmHoldingANewSeat", seatSelected);
  }, [seatSelected]);

  // When Seats are updated
  useEffect(() => {
    function mapSeatsFromDay() {
      let newSeats = generateSeats(numberOfColumns, totalNumberOfSeats);
      const numDisabledSeats = newSeats.filter((seat) => seat.disabled).length;
      seatsMappedByDay?.forEach((seat) => {
        let seatId = seat.seatNumber - 1;

        if (seatId > totalNumberOfSeats) return;

        if (seat.seatNumber < 6) seatId += numDisabledSeats / 2;
        else {
          seatId += numDisabledSeats;
        }

        if (daySelected.includes(seat.reservationDate)) {
          if (
            newSeats[seatId].firstName === "" ||
            (newSeats[seatId].firstName === seat.firstName &&
              newSeats[seatId].lastName === seat.lastName)
          )
            newSeats[seatId] = {
              ...newSeats[seatId],
              ...seat,
              id: seat.seatNumber,
              isYours:
                myRegisteredSeats.findIndex(
                  (myS) =>
                    myS.seatNumber === seat.seatNumber &&
                    myS.reservationDate === seat.reservationDate
                ) !== -1,
            };
          else
            newSeats[seatId] = {
              ...newSeats[seatId],
              ...seat,
              id: seat.seatNumber,
              firstName: "Flere personer",
              isYours: false,
            };
        }
      });

      setseatsToDisplay(newSeats);
    }

    mapSeatsFromDay();
  }, [daySelected, myRegisteredSeats, seatsMappedByDay]);

  function Area({
    name,
    position,
    size,
    color = "red",
    dashArray = "8",
    rounded = "16px",
  }: {
    name: string;
    position?: string;
    size?: string;
    color?: string;
    dashArray?: string;
    rounded?: string;
  }) {
    return (
      <div
        className={`opacity-75 absolute flex items-center justify-center ${position} ${size} rounded-2xl`}
      >
        <svg width="100%" height="100%">
          <rect
            width="100%"
            height="100%"
            fill="transparent"
            strokeWidth="2px"
            stroke={color}
            strokeDasharray={dashArray}
            rx={rounded}
          />
        </svg>
        <p
          // Gradient background - transparent color transparent
          style={{
            color,
            background:
              "linear-gradient(90deg, transparent 0%, #1A171F 10%, #1A171F 90%, transparent 100%)",
          }}
          className="absolute -top-2 h-4 right-10 flex items-center justify-center font-bold text-lg px-8 whitespace-nowrap"
        >
          {name}
        </p>
      </div>
    );
  }

  function updateFilteredDay(day: number) {
    const lanDate: string = LAN_DATES[day];
    if (daySelected.length === 1 && daySelected.includes(lanDate)) {
      // Don't remove the last remaining date
      // console.log("You must have at least one selected day.");
    } else if (daySelected.includes(lanDate)) {
      // Create a new array without the date to be removed
      const updatedSelected = daySelected.filter((d) => d !== lanDate);
      setdaySelected(updatedSelected);
    } else {
      // Add the date to the selected days
      setdaySelected((old) => [...old, lanDate]);
    }
  }

  function getSidebarAmount() {
    const s: string[] = [];
    myRegisteredSeats.forEach((seat) => {
      if (!s.includes(`${seat.seatNumber} ${seat.firstName} ${seat.lastName}`))
        s.push(`${seat.seatNumber} ${seat.firstName} ${seat.lastName}`);
    });
    return s.length;
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-end gap-32 px-4 w-[50vw] max-w-[890px] min-w-[634px]">
        <Title />
        <DaySelector
          enableAll={() => {
            setdaySelected(LAN_DATES);
          }}
          daySelected={daySelected}
          updateFilteredDay={updateFilteredDay}
        />
      </div>
      <div className="flex gap-12">
        <div className="flex flex-col gap-10 px-4 overflow-visible relative">
          <div className="absolute top-0 -left-24 grid items-center justify-center select-none">
            <p className="uppercase text-xl font-bold text-[#D8D6DB]">Scene</p>
          </div>
          <div className="absolute -bottom-12 -left-24 grid items-center justify-center select-none">
            <p className="uppercase text-xl font-bold text-[#D8D6DB]">
              Kantine
            </p>
          </div>

          <Area
            name="Støy-sone"
            color="#57a5ff"
            size="h-[152px] w-[538px]"
            position="-top-5 right-0"
          />

          <Area
            name="Kidz zone"
            color="#57ffcd"
            size="h-[310px]"
            position="-bottom-3 left-0 right-0"
          />

          {Array.from({
            length: Math.ceil(seatsToDisplay.length / (numberOfColumns * 2)),
          }).map((_, groupIndex) => (
            <div
              key={groupIndex}
              className={`grid gap-3 ${numberOfColumnsClass}`}
            >
              {seatsToDisplay
                .filter((seat) => Math.floor(seat.row / 2) === groupIndex)
                .map((seat, index) => {
                  return (
                    <SeatV2
                      isHidden={seat.disabled}
                      isDisabled={
                        (seat.isYours &&
                          !!sidebar_seatBeingEdited &&
                          seat.id !== sidebar_seatBeingEdited) ||
                        (seat.isYours &&
                          !!sidebar_seatBeingEdited &&
                          myRegisteredSeats.length === 1)
                      }
                      onHold={
                        seatsThatAreHeld?.findIndex((s) => s === seat.id) !==
                          -1 && seat.id !== seatSelected
                      }
                      occupant={
                        seatSelected === seat.id
                          ? sidebar_firstName
                          : seat.firstName || ""
                      }
                      isYours={seat.isYours}
                      id={seat.id}
                      toolTip={
                        seat.firstName && seat.lastName
                          ? seat.firstName === "Flere personer"
                            ? seat.firstName
                            : `${seat.firstName} ${seat.lastName}`
                          : undefined
                      }
                      selectSeat={() => {
                        return setSeatSelected(
                          seatSelected === seat.id && !sidebar_seatBeingEdited
                            ? undefined
                            : seat.id
                        );
                      }}
                      key={index}
                      isSelected={seatSelected === seat.id}
                    />
                  );
                })}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-12">
          <Legend seatAmnt={getSidebarAmount()} />
          <Sidebarv4
            isYou={sidebar_isYou}
            setIsYou={sidebar_setIsYou}
            seatsMappedBySeatId={seatsMappedBySeatId}
            filteredDays={daySelected}
            setFilteredDays={setdaySelected}
            sidebar_daysAttending={sidebar_daysAttending}
            sidebar_setDaysAttending={sidebar_setDaysAttending}
            sidebar_updateDay={(day: days, value: boolean) => {
              sidebar_setDaysAttending((old) => ({ ...old, [day]: value }));
            }}
            sidebar_setSeatBeingEdited={sidebar_setSeatBeingEdited}
            sidebar_seatBeingEdited={sidebar_seatBeingEdited}
            setSelectedSeat={setSeatSelected}
            deleteSeat={(seatNumber: number, firstName: string) => {
              socket.emit("iHaveDeletedASeat", seatNumber, firstName);
            }}
            myRegisteredSeats={myRegisteredSeats}
            saveSeat={(shouldUpdateYou: boolean) => {
              if (seatSelected !== undefined) {
                const dates: typeof LAN_DATES = [];
                Object.keys(sidebar_daysAttending).forEach((d, index) => {
                  if (sidebar_daysAttending[d as days] && LAN_DATES[index])
                    dates.push(LAN_DATES[index]);
                });

                const personName = {
                  firstName: sidebar_firstName,
                  lastName: sidebar_lastName,
                };

                const newSeat: ReserveSeat = {
                  id: seatSelected,
                  personName,
                  reservationDates: dates,
                };

                socket.emit(
                  "iHaveUpdatedASeat",
                  newSeat,
                  {
                    employeeId: aNumber,
                    personName:
                      myRegisteredSeats.length !== 0
                        ? {
                            firstName: myRegisteredSeats[0].firstName,
                            lastName: myRegisteredSeats[0].lastName,
                          }
                        : personName,
                  },
                  shouldUpdateYou
                );
              }
            }}
            seatSelected={seatSelected}
            sidebar_firstName={sidebar_firstName}
            sidebar_lastName={sidebar_lastName}
            sidebar_setFirstName={sidebar_setFirstName}
            sidebar_setLastName={sidebar_setLastName}
          />
        </div>
      </div>
    </div>
  );
}
