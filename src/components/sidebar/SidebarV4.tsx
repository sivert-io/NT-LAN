import React, { useEffect, useState } from "react";
import { SidebarV3Props, days, daysAttending } from "./props";
import Input from "../input/Input";
import SeatListItem from "./SeatListItem";
import Button from "../button/Button";
import { RegisterFieldsType } from "../register/types";
import { LAN_DATES } from "@/server/config";
import { formatRegisteredDates, generateUniqueTitles } from "@/utils/sidebar";

export default function Sidebarv4({
  myRegisteredSeats: registeredPeople,
  saveSeat: updateRegisteredPeople,
  seatSelected: selectedSeat,
  setSelectedSeat,
  sidebar_firstName: firstName,
  sidebar_setFirstName: setFirstName,
  sidebar_lastName: lastName,
  sidebar_setLastName: setLastName,
  deleteSeat: deletePerson,
  sidebar_seatBeingEdited: isEditing,
  sidebar_setSeatBeingEdited: setisEditing,
  seatEditing,
  sidebar_daysAttending: daysAttending,
  sidebar_setDaysAttending: setDaysAttending,
  sidebar_updateDay: updateDay,
  setFilteredDays,
  filteredDays,
  seatsMappedBySeatId,
}: SidebarV3Props) {
  const [timer, setTimer] = useState<number | null>(null);
  const timerDuration = 120; // 2 minutes in seconds
  const [hasSelectedOwn, sethasSelectedOwn] = useState(false);
  const [sidebarPeople, setsidebarPeople] = useState<
    (RegisterFieldsType & { registeredDates: string[] })[]
  >([]);
  const [uniqueTitles, setuniqueTitles] = useState(
    generateUniqueTitles(sidebarPeople)
  );

  function atLeastOneDay(dayVariable: daysAttending) {
    return dayVariable.fredag || dayVariable.lordag || dayVariable.sondag;
  }

  function updateMapFilter(seatNumber: number, person: RegisterFieldsType) {
    const dates: string[] = [];
    registeredPeople.forEach((seatRegisteredByUs) => {
      if (
        seatRegisteredByUs.seatNumber === seatNumber &&
        seatRegisteredByUs.firstName === person.firstName
      ) {
        dates.push(seatRegisteredByUs.reservationDate);
      }
    });
    setFilteredDays(dates);
    setSelectedSeat(seatNumber);
  }

  const handleEnterKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (
        firstName.length >= 2 &&
        lastName.length >= 2 &&
        atLeastOneDay(daysAttending)
      )
        savePerson();
    }
  };

  function resetSidebar() {
    setFirstName("");
    setLastName("");
    setDaysAttending({ fredag: false, lordag: false, sondag: false });
    setisEditing(undefined);
    sethasSelectedOwn(false);
  }

  function savePerson() {
    if (selectedSeat) updateRegisteredPeople();
    resetSidebar();
    setSelectedSeat(undefined);
  }

  useEffect(() => {
    const newList: typeof sidebarPeople = [];
    registeredPeople.forEach((person) => {
      const index = newList.findIndex(
        (p) =>
          p.firstName === person.firstName &&
          p.lastName === person.lastName &&
          p.seatNumber === person.seatNumber
      );
      if (index === -1)
        newList.push({ ...person, registeredDates: [person.reservationDate] });
      else
        newList[
          newList.findIndex(
            (p) =>
              p.seatNumber === person.seatNumber &&
              p.firstName &&
              person.firstName
          )
        ].registeredDates.push(person.reservationDate);
    });
    setsidebarPeople(newList);
    setuniqueTitles(generateUniqueTitles(newList));
  }, [registeredPeople]);

  useEffect(() => {
    const days: string[] = [];
    Object.keys(daysAttending).forEach((day, index) => {
      if (daysAttending[day as days]) days.push(LAN_DATES[index]);
    });
    if (days.length > 0) setFilteredDays(days);
  }, [daysAttending, selectedSeat]);

  useEffect(() => {
    const isRegistered = registeredPeople.findIndex(
      (person) =>
        person.seatNumber === selectedSeat &&
        filteredDays.includes(person.reservationDate)
    );

    if (isRegistered !== -1) {
      registeredPeople[isRegistered].firstName !== "" &&
        setFirstName(registeredPeople[isRegistered].firstName);
      registeredPeople[isRegistered].lastName !== "" &&
        setLastName(registeredPeople[isRegistered].lastName);
      const l = daysAttending;
      const dates: string[] = [];
      registeredPeople.forEach((seatRegisteredByUs) => {
        if (
          seatRegisteredByUs.seatNumber === selectedSeat &&
          registeredPeople[isRegistered].firstName ===
            seatRegisteredByUs.firstName
        ) {
          {
            dates.push(seatRegisteredByUs.reservationDate);
            const index = LAN_DATES.findIndex(
              (d) => seatRegisteredByUs.reservationDate === d
            );
            if (index !== -1) {
              switch (index) {
                case 0:
                  l["fredag"] = true;
                  break;
                case 1:
                  l["lordag"] = true;
                  break;
                case 2:
                  l["sondag"] = true;
                  break;
              }
            }
          }
        }
      });
      setDaysAttending(l);
      setFilteredDays(dates);
      sethasSelectedOwn(true);
    } else if (hasSelectedOwn) {
      resetSidebar();
    }

    if (!selectedSeat) resetSidebar();
  }, [isEditing, registeredPeople, selectedSeat, setFirstName, setLastName]);

  useEffect(() => {
    // Start the timer when selectedSeat changes
    if (
      selectedSeat !== undefined &&
      !isEditing &&
      sidebarPeople.findIndex(
        (person) => person.seatNumber === selectedSeat
      ) === -1
    ) {
      setTimer(timerDuration);

      const intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
      }, 1000);

      return () => {
        // Cleanup: Clear the timer when selectedSeat becomes undefined
        clearInterval(intervalId);
        setTimer(null);
      };
    }
  }, [
    isEditing,
    selectedSeat,
    setTimer,
    firstName,
    lastName,
    daysAttending,
    registeredPeople,
  ]);

  useEffect(() => {
    // When the timer goes off, set selectedSeat to undefined
    if (timer === 0) {
      setSelectedSeat(undefined);
      console.log("Timer ran out!");
    }
  }, [timer, setSelectedSeat]);

  return (
    <div className="bg-zinc-700 select-none w-[300px] shrink-0 h-full relative transition-all shadow rounded-2xl p-6">
      {selectedSeat !== undefined ? (
        <div className="flex flex-col items-center justify-between h-full w-full">
          <div className="flex flex-col items-center gap-8">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-bold flex justify-between items-center">
                {sidebarPeople.length === 0 ||
                (sidebarPeople[0].firstName === firstName &&
                  sidebarPeople[0].lastName === lastName) ||
                (isEditing && sidebarPeople.length === 1) ? (
                  <>Hvem er du?</>
                ) : (
                  <>Hvem er gjesten din?</>
                )}
              </h2>
              <p className="px-2 py-1 text-xs flex items-center justify-center h-6 whitespace-nowrap font-bold rounded-sm bg-[#91FFC3] text-black">
                Plass {selectedSeat + 1}
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Input
                name="Fornavn"
                id="firstName"
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
                onKeyDown={handleEnterKeyPress}
                value={firstName}
              />
              <Input
                name="Etternavn"
                id="lastName"
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
                onKeyDown={handleEnterKeyPress}
                value={lastName}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col w-full gap-4">
                <p className="text-sm font-bold">
                  Hvilke dager skal{" "}
                  {sidebarPeople.length === 0 ||
                  (sidebarPeople[0].firstName === firstName &&
                    sidebarPeople[0].lastName === lastName) ||
                  (isEditing && sidebarPeople.length === 1) ? (
                    <>du</>
                  ) : (
                    <>de</>
                  )}{" "}
                  delta?
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <Button
                    disabled={
                      seatsMappedBySeatId[selectedSeat] !== undefined &&
                      seatsMappedBySeatId[selectedSeat].some((seat) => {
                        return (
                          seat.reservationDate === LAN_DATES[0] &&
                          !registeredPeople.some(
                            (p) =>
                              p.firstName === seat.firstName &&
                              p.lastName === seat.lastName &&
                              p.reservationDate === seat.reservationDate &&
                              p.seatNumber === seat.seatNumber
                          )
                        );
                      })
                    }
                    onClick={() => {
                      updateDay("fredag", !daysAttending.fredag);
                    }}
                    inActiveClass="bg-[#242127] text-[#D7D3DE]"
                    isActive={daysAttending.fredag}
                  >
                    Fredag
                  </Button>
                  <Button
                    disabled={
                      seatsMappedBySeatId[selectedSeat] !== undefined &&
                      seatsMappedBySeatId[selectedSeat].some((seat) => {
                        return (
                          seat.reservationDate === LAN_DATES[1] &&
                          !registeredPeople.some(
                            (p) =>
                              p.firstName === seat.firstName &&
                              p.lastName === seat.lastName &&
                              p.reservationDate === seat.reservationDate &&
                              p.seatNumber === seat.seatNumber
                          )
                        );
                      })
                    }
                    onClick={() => {
                      updateDay("lordag", !daysAttending.lordag);
                    }}
                    inActiveClass="bg-[#242127] text-[#D7D3DE]"
                    isActive={daysAttending.lordag}
                  >
                    Lørdag
                  </Button>
                  <Button
                    disabled={
                      seatsMappedBySeatId[selectedSeat] !== undefined &&
                      seatsMappedBySeatId[selectedSeat].some((seat) => {
                        return (
                          seat.reservationDate === LAN_DATES[2] &&
                          !registeredPeople.some(
                            (p) =>
                              p.firstName === seat.firstName &&
                              p.lastName === seat.lastName &&
                              p.reservationDate === seat.reservationDate &&
                              p.seatNumber === seat.seatNumber
                          )
                        );
                      })
                    }
                    onClick={() => {
                      updateDay("sondag", !daysAttending.sondag);
                    }}
                    inActiveClass="bg-[#242127] text-[#D7D3DE]"
                    isActive={daysAttending.sondag}
                  >
                    Søndag
                  </Button>
                </div>
                <Button
                  disabled={
                    seatsMappedBySeatId[selectedSeat] !== undefined &&
                    seatsMappedBySeatId[selectedSeat].some((seat) => {
                      return (
                        LAN_DATES.includes(seat.reservationDate) &&
                        !registeredPeople.some(
                          (p) =>
                            p.firstName === seat.firstName &&
                            p.lastName === seat.lastName &&
                            p.reservationDate === seat.reservationDate &&
                            p.seatNumber === seat.seatNumber
                        )
                      );
                    })
                  }
                  isActive
                  activeClass="text-right w-fit px-4 text-[#C7D7FF] text-xs font-medium disabled:opacity-25 disabled:cursor-not-allowed"
                  onClick={() => {
                    setDaysAttending({
                      fredag: true,
                      lordag: true,
                      sondag: true,
                    });
                  }}
                >
                  Velg alle
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <button
              onClick={savePerson}
              disabled={
                firstName.length <= 2 ||
                lastName.length <= 2 ||
                !atLeastOneDay(daysAttending)
              }
              className="py-3 px-5 flex justify-center items-center bg-[#FFCF3F] rounded-3xl font-bold text-gray-900 active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing && seatEditing !== selectedSeat ? (
                <>Flytt</>
              ) : (
                <>Lagre</>
              )}
            </button>
            {sidebarPeople.some(
              (p) => p.seatNumber === selectedSeat && p.firstName === firstName
            ) &&
            ((sidebarPeople.length > 0 &&
              sidebarPeople[0].firstName !== firstName) ||
              sidebarPeople.length === 1) ? (
              <button
                onClick={() => {
                  deletePerson(
                    selectedSeat,
                    sidebarPeople[
                      sidebarPeople.findIndex(
                        (p) =>
                          p.seatNumber === selectedSeat &&
                          p.firstName === firstName &&
                          p.lastName === lastName
                      )
                    ].firstName
                  );
                  resetSidebar();
                  setSelectedSeat(undefined);
                }}
                className="underline text-[#FF5797] decoration-[#FF5797] decoration-2 underline-offset-4"
              >
                Slett person
              </button>
            ) : null}
            <button
              onClick={() => {
                resetSidebar();
                setSelectedSeat(undefined);
              }}
              className="underline text-white decoration-white decoration-2 underline-offset-8"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : sidebarPeople.length > 0 ? (
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6">
            <h2 className="font-bold text-2xl flex justify-between items-center">
              {sidebarPeople.length === 1 ? <>Din plass</> : <>Dine plasser</>}
            </h2>
            {uniqueTitles.map((title, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="text-xs font-bold">{title}</h3>
                {sidebarPeople.map(
                  (person, index) =>
                    formatRegisteredDates(person.registeredDates) === title && (
                      <SeatListItem
                        delDisable={index === 0 && sidebarPeople.length > 1}
                        firstName={
                          index === 0
                            ? `Du (${person.firstName})`
                            : person.firstName
                        }
                        seatNumber={person.seatNumber}
                        key={`${person.firstName} ${person.lastName} ${person.reservationDate}`}
                        editSeat={(seatNumber) => {
                          updateMapFilter(seatNumber, person);
                        }}
                        deleteSeat={() => {
                          deletePerson(
                            person.seatNumber,
                            sidebarPeople[index].firstName
                          );
                        }}
                      />
                    )
                )}
              </div>
            ))}
          </div>
          {sidebarPeople.length === 1 ? (
            <div className="flex flex-col justify-end gap-2">
              <p className="font-bold text-sm">Skal du ha med deg noen?</p>
              <p className="text-sm font-medium">
                Trykk på kartet for å velge en plass til gjesten din ✨
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-end gap-2">
              <p className="font-bold text-sm">Vil du endre plass? ✨</p>
              <p className="text-sm font-medium">
                Du kan endre plass med drag’n’drop
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="font-bold text-2xl flex justify-between items-center w-full">
              Hvor vil du sitte?
            </h2>
            <br />
            <p className="font-medium">
              Trykk på en plass for å komme i gang 😁
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-sm">Skal du ha med deg noen?</h3>
            <p className="text-sm font-medium">
              Velg din egen plass først, deretter kan du velge en plass til
              gjesten din ✨
            </p>
          </div>
        </div>
      )}
      {timer && timer <= 60 && (
        <p className="absolute left-0 bottom-0 font-medium text-sm right-0 text-center p-4">
          Du har vært inaktiv for lenge og mister snart plassen! {timer}s
        </p>
      )}
    </div>
  );
}
