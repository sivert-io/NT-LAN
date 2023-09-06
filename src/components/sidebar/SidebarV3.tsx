import React, { useEffect, useState } from "react";
import { SidebarV3Props } from "./props";
import Input from "../input/Input";
import SeatListItem from "./SeatListItem";
import Legend from "../legend/Legend";

export default function Sidebarv3({
  registeredPeople,
  updateRegisteredPeople,
  selectedSeat,
  setSelectedSeat,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  deletePerson,
  isEditing,
  setisEditing,
}: SidebarV3Props) {
  const [timer, setTimer] = useState<number | null>(null);
  const timerDuration = 120; // 2 minutes in seconds

  const handleEnterKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (firstName.length >= 2 && lastName.length >= 2) savePerson();
    }
  };

  function savePerson() {
    if (selectedSeat)
      updateRegisteredPeople({
        firstName: firstName,
        lastName: lastName,
        seatNumber: selectedSeat,
      });
    setFirstName("");
    setLastName("");
    setisEditing(false);
  }

  useEffect(() => {
    if (!isEditing) {
      const isRegistered = registeredPeople.findIndex(
        (person) => person.seatNumber === selectedSeat
      );

      if (isRegistered !== -1) {
        setFirstName(registeredPeople[isRegistered].firstName);
        setLastName(registeredPeople[isRegistered].lastName);
      } else {
        setFirstName("");
        setLastName("");
      }
    }
  }, [isEditing, registeredPeople, selectedSeat, setFirstName, setLastName]);

  useEffect(() => {
    // Start the timer when selectedSeat changes
    if (selectedSeat !== undefined && !isEditing) {
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
  }, [isEditing, selectedSeat, setTimer, firstName, lastName]);

  useEffect(() => {
    // When the timer goes off, set selectedSeat to undefined
    if (timer === 0) {
      setSelectedSeat(undefined);
      console.log("Timer ran out!");
    }
  }, [timer, setSelectedSeat]);

  return (
    <div className="bg-zinc-700 select-none w-[300px] shrink-0 h-full relative transition-all shadow rounded-2xl p-6 flex flex-col justify-start gap-8">
      <Legend seatAmnt={registeredPeople.length} />

      {selectedSeat !== undefined ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="font-bold flex justify-between items-center">
              {registeredPeople.length === 0 ||
              (registeredPeople[0].firstName === firstName &&
                registeredPeople[0].lastName === lastName) ||
              (isEditing && registeredPeople.length === 1) ? (
                <>Hvem er du?</>
              ) : (
                <>Hvem er gjesten din?</>
              )}
            </h2>
            <p className="px-2 py-1 text-xs flex items-center justify-center h-6 whitespace-nowrap font-bold rounded-sm bg-[#91FFC3] text-black">
              Plass {selectedSeat + 1}
            </p>
          </div>
          <div className="flex flex-col gap-4">
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
          <button
            onClick={savePerson}
            disabled={firstName.length <= 2 || lastName.length <= 2}
            className="py-3 px-5 flex justify-center items-center bg-[#FFCF3F] rounded-3xl font-bold text-gray-900 active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lagre
          </button>
          {registeredPeople.findIndex(
            (person) => person.seatNumber === selectedSeat
          ) !== -1 && (
            <button
              onClick={() => {
                deletePerson(selectedSeat);
                setFirstName("");
                setLastName("");
                setisEditing(false);
                setSelectedSeat(undefined);
              }}
              className="underline text-pink-400"
            >
              Slett plass
            </button>
          )}
          <button
            onClick={() => {
              setFirstName("");
              setLastName("");
              setisEditing(false);
              setSelectedSeat(undefined);
            }}
            className="underline text-gray-200"
          >
            Avbryt
          </button>
        </>
      ) : registeredPeople.length > 0 ? (
        <>
          <h2 className="font-bold text-xl flex justify-between items-center">
            {registeredPeople.length === 1 ? <>Din plass</> : <>Dine plasser</>}
          </h2>
          {registeredPeople.map((person, index) => (
            <SeatListItem
              delDisable={index === 0 && registeredPeople.length > 1}
              firstName={
                index === 0 ? `Du (${person.firstName})` : person.firstName
              }
              seatNumber={person.seatNumber}
              key={`${person.firstName} ${person.lastName}`}
              editSeat={(seatNumber) => {
                setSelectedSeat(seatNumber);
                setFirstName(registeredPeople[index].firstName);
                setLastName(registeredPeople[index].lastName);
                setisEditing(true);
              }}
              deleteSeat={deletePerson}
            />
          ))}
          <div className="h-full flex flex-col justify-end gap-2">
            <p className="font-bold text-sm">Skal du ha med deg noen?</p>
            <p className="text-sm font-medium">
              Trykk på kartet for å velge en plass til gjesten din ✨
            </p>
          </div>
        </>
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
