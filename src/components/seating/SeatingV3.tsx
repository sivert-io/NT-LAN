import React, { useEffect, useState } from "react";
import { SeatType } from "./types";
import { socket } from "../../utils/socket";
import { generateSeats } from "@/utils/seats";
import Title from "../title/Title";
import { RegisterFieldsType, mappedSeats } from "../register/types";
import DaySelector from "../daySelector/DaySelector";
import Legend from "../legend/Legend";
import SeatV2 from "./SeatV2";
import { days, daysAttending } from "../sidebar/props";
import { LAN_DATES } from "@/server/config";
import Sidebarv4 from "../sidebar/SidebarV4";
import { ReserveSeat, ReservedSeat } from "@/server/api-client";

const numCols = 5;

export default function SeatingV3({ aNumber }: { aNumber: string }) {
  // NEW

  // Which seat have we currently selected?
  const [seatSelected, setSeatSelected] = useState<number | undefined>(
    undefined
  );
  // Sidebar usestates
  const [sidebar_firstName, sidebar_setFirstName] = useState("");
  const [sidebar_lastName, sidebar_setLastName] = useState("");
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
  const [seatsToDisplay, setseatsToDisplay] = useState(generateSeats(numCols));

  // All held seats
  const [seatsThatAreHeld, setseatsThatAreHeld] = useState<number[]>([]);

  // When user connects
  useEffect(() => {
    socket.emit("iHaveArrived", aNumber);

    socket.on("hereAreYourRegisteredSeats", (seats: RegisterFieldsType[]) => {
      console.log("Server sent us our owned seats:", seats);
      !!seats ? setMyRegisteredSeats(seats) : setMyRegisteredSeats([]);
    });

    socket.on("hereAreAllRegisteredSeats", (seats: mappedSeats) => {
      // console.log("Server sent us seats mapped by seatId:", seats);
      setseatsMappedBySeatId(seats);
    });

    socket.on("hereAreAllHeldSeats", (seats: number[]) => {
      const s = seats;
      s.splice(
        seats.findIndex((v) => v === seatSelected),
        1
      );
      console.log("Server sent us all held seats:", s);

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
  }, []);

  // When selected seat updates
  useEffect(() => {
    socket.emit("iAmHoldingANewSeat", seatSelected);
  }, [seatSelected]);

  // When Seats are updated
  useEffect(() => {
    function mapSeatsFromDay() {
      let newSeats = generateSeats(numCols);

      seatsMappedByDay?.forEach((seat) => {
        if (daySelected.includes(seat.reservationDate)) {
          if (
            newSeats[seat.seatNumber].firstName === "" ||
            (newSeats[seat.seatNumber].firstName === seat.firstName &&
              newSeats[seat.seatNumber].lastName === seat.lastName)
          )
            newSeats[seat.seatNumber] = {
              ...newSeats[seat.seatNumber],
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
            newSeats[seat.seatNumber] = {
              ...newSeats[seat.seatNumber],
              ...seat,
              id: seat.seatNumber,
              firstName: "(...)",
              isYours: false,
            };
        }
      });

      setseatsToDisplay(newSeats);
    }

    mapSeatsFromDay();
  }, [daySelected, myRegisteredSeats, seatsMappedByDay]);

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
  // NEW

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
      <div className="flex gap-12 relative">
        <div className="flex flex-col gap-10 px-4 overflow-auto">
          {Array.from({
            length: Math.ceil(seatsToDisplay.length / (numCols * 2)),
          }).map((_, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-5 gap-3">
              {seatsToDisplay
                .filter((seat) => Math.floor(seat.row / 2) === groupIndex)
                .map((seat) => {
                  return (
                    <SeatV2
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
                      deselectAllSeats={() => {
                        setSeatSelected(undefined);
                      }}
                      selectSeat={() => {
                        return setSeatSelected(
                          seatSelected === seat.id && !sidebar_seatBeingEdited
                            ? undefined
                            : seat.id
                        );
                      }}
                      key={seat.id}
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
            saveSeat={() => {
              if (seatSelected) {
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

                socket.emit("iHaveUpdatedASeat", newSeat, {
                  employeeId: aNumber,
                  personName:
                    myRegisteredSeats.length !== 0
                      ? {
                          firstName: myRegisteredSeats[0].firstName,
                          lastName: myRegisteredSeats[0].lastName,
                        }
                      : personName,
                });
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
