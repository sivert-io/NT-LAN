import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { confettiProps } from "@/utils/confetti";
import { InputBoxType, SidebarProps } from "./props";
import Image from "next/image";
import logo from "../../app/logo.svg";

export default function Sidebar({
  seatsSelected,
  updateSeat,
  seats,
  successFunction,
}: SidebarProps) {
  const [inputBoxes, setInputBoxes] = useState<InputBoxType>({});
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [isFinished, setisFinished] = useState(false);

  useEffect(() => {
    const seatOccupantValues: InputBoxType = {};

    seatsSelected.forEach((value) => {
      const seatIndex = seats.findIndex((seat) => seat.id === value);
      seatOccupantValues[value] = seats[seatIndex].occupant;
    });

    setInputBoxes(seatOccupantValues);
  }, [seats, seatsSelected]);

  const handleInputChange = (id: number, newValue: string) => {
    setInputBoxes((prevInputBoxes) => ({
      ...prevInputBoxes,
      [id]: newValue || "",
    }));

    updateSeat(id, newValue);
  };

  return (
    <div className="bg-zinc-700 w-[300px] h-[792px] relative transition-all shadow rounded-2xl py-12 px-8 flex flex-col justify-start items-center gap-6 right-6">
      {!isFinished ? (
        <>
          <h2 className="font-medium flex justify-between items-center w-full">
            {seatsSelected.length === 0 ? (
              <span>
                Hvor vil du sitte?
                <br />
                <br />
                Trykk på en plass for å komme i gang
              </span>
            ) : (
              <>
                <p>Hvem er du?</p>
                <div className="py-1 px-2 flex gap-1 items-center justify-center text-[#242127] bg-[#91FFC3] rounded-sm">
                  <Image
                    src={logo}
                    alt="Norsk Tipping Logo"
                    width={12}
                    height={12}
                  />
                  <p>Plass {seatsSelected[0] + 1}</p>
                </div>
              </>
            )}
          </h2>
          <div className="flex flex-col gap-6 overflow-auto">
            {seatsSelected.map((id, index) => {
              return index === 0 ? (
                <div className="flex flex-col gap-4">
                  <div key={id} className="flex flex-col gap-1 w-[236px]">
                    <label htmlFor={`input_${id}`}>Fornavn:</label>
                    <input
                      disabled={!submitEnabled}
                      name={`input_${id}`}
                      maxLength={32}
                      className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={inputBoxes[id] || ""}
                      onChange={(event) =>
                        handleInputChange(id, event.target.value)
                      }
                    />
                  </div>

                  <div key={id} className="flex flex-col gap-1 w-[236px]">
                    <label htmlFor={`input_${id}`}>Etternavn:</label>
                    <input
                      disabled={!submitEnabled}
                      name={`input_${id}`}
                      maxLength={32}
                      className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={inputBoxes[id] || ""}
                      onChange={(event) =>
                        handleInputChange(id, event.target.value)
                      }
                    />
                  </div>

                  <div key={id} className="flex flex-col gap-1 w-[236px]">
                    <label htmlFor={`input_${id}`}>A-nummer:</label>
                    <input
                      disabled={!submitEnabled}
                      name={`input_${id}`}
                      maxLength={6}
                      className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={inputBoxes[id] || ""}
                      onChange={(event) =>
                        handleInputChange(id, event.target.value)
                      }
                    />
                  </div>
                  <p>Ta med en venn?<br />Velg en plass til</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div key={id} className="flex flex-col gap-1 w-[236px]">
                    <label htmlFor={`input_${id}`}>Fornavn:</label>
                    <input
                      disabled={!submitEnabled}
                      name={`input_${id}`}
                      maxLength={32}
                      className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={inputBoxes[id] || ""}
                      onChange={(event) =>
                        handleInputChange(id, event.target.value)
                      }
                    />
                  </div>

                  <div key={id} className="flex flex-col gap-1 w-[236px]">
                    <label htmlFor={`input_${id}`}>Etternavn:</label>
                    <input
                      disabled={!submitEnabled}
                      name={`input_${id}`}
                      maxLength={32}
                      className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={inputBoxes[id] || ""}
                      onChange={(event) =>
                        handleInputChange(id, event.target.value)
                      }
                    />
                  </div>

                  <div key={id} className="flex flex-col gap-1 w-[236px]">
                    <label htmlFor={`input_${id}`}>A-nummer:</label>
                    <input
                      disabled={!submitEnabled}
                      name={`input_${id}`}
                      maxLength={6}
                      className="w-full capitalize rounded bg-zinc-800 p-2 border-2 focus:border-[#91FFC3] border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      value={inputBoxes[id] || ""}
                      onChange={(event) =>
                        handleInputChange(id, event.target.value)
                      }
                    />
                  </div>
                  <p>Ta med en venn?<br />Velg en plass til</p>
                </div>
              );
            })}
          </div>
          {seatsSelected.length > 0 && (
            <button
              disabled={!submitEnabled}
              onClick={() => {
                setSubmitEnabled(false);
                successFunction();
                setisFinished(true);

                setTimeout(() => {
                  setisFinished(false);
                  setSubmitEnabled(true);
                }, 2000);
              }}
              className="py-3 px-5 flex content-center items-center bg-[#91FFC3] relative rounded-3xl font-medium text-gray-900 active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Oppdater
            </button>
          )}
        </>
      ) : (
        <span className="relative">
          Done :)
          {<ConfettiExplosion {...confettiProps} />}
        </span>
      )}
    </div>
  );
}
