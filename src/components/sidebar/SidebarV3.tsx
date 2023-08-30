import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { confettiProps } from "@/utils/confetti";
import { SidebarV3Props } from "./props";
import Input from "../input/Input";
import SeatListItem from "./SeatListItem";

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
}: SidebarV3Props) {
  const [isEditing, setisEditing] = useState(false);

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

  return (
    <div className="bg-zinc-700 w-[300px] shrink-0 h-full relative transition-all shadow rounded-2xl p-6 flex flex-col justify-start gap-8 right-6">
      {selectedSeat !== undefined ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="font-bold flex justify-between items-center">
              {registeredPeople.length === 0 ||
              registeredPeople[0].firstName === firstName ? (
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
              value={firstName}
            />
            <Input
              name="Etternavn"
              id="lastName"
              onChange={(event) => {
                setLastName(event.target.value);
              }}
              value={lastName}
            />
          </div>
          <button
            onClick={() => {
              updateRegisteredPeople({
                firstName: firstName,
                lastName: lastName,
                seatNumber: selectedSeat,
              });
              setFirstName("");
              setLastName("");
              setisEditing(false);
            }}
            disabled={firstName.length <= 3 || lastName.length <= 3}
            className="py-3 px-5 flex justify-center items-center bg-[#FFCF3F] relative rounded-3xl font-bold text-gray-900 active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lagre
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
              key={person.firstName}
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
            <p className="font-bold">Skal du ha med deg noen?</p>
            <p>Trykk på kartet for å velge en plass til gjesten din ✨</p>
          </div>
        </>
      ) : (
        <div>
          <h2 className="font-bold text-xl flex justify-between items-center w-full">
            Hvor vil du sitte?
          </h2>
          <br />
          <p>Trykk på en plass for å komme i gang.</p>
          <br />
          <p>Om du skal ha med deg noen, velg din egen plass først ✨</p>
        </div>
      )}
    </div>
  );
}
