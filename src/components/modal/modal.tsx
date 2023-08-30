import add from "../../app/add-circle.svg";
import del from "../../app/delete-circle.svg";
import Title from "@/components/title/Title";
import InputFields from "../register/inputFields";
import Image from "next/image";
import { RegisterFieldsType } from "../register/types";
import { Dispatch, SetStateAction } from "react";

function areAllFieldsFilled(people: RegisterFieldsType[]): boolean {
  return people.every((person) => {
    let b = true;
    if (person.firstName.length <= 3) b = false;
    if (person.lastName.length <= 3) b = false;
    if (person.isNT && person.aNumber.length !== 6) b = false;

    return b;
  });
}

export default function Module({
  registeredPeople,
  updatePerson,
  setregisteredPeople,
  setstageIndex,
  stageIndex,
}: {
  registeredPeople: RegisterFieldsType[];
  updatePerson: (
    newValue: string | boolean,
    type: keyof RegisterFieldsType,
    personIndex: number
  ) => any;
    setstageIndex: Dispatch<SetStateAction<number>>;
    stageIndex: number;
  setregisteredPeople: Dispatch<SetStateAction<RegisterFieldsType[]>>;
}) {
  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <Title />
      <div className="px-20 py-10 rounded-2xl bg-[#423E49] w-[562px] flex flex-col gap-6">
        <div className="flex flex-col gap-12 max-h-[900px] overflow-auto">
          {registeredPeople.map((person, index) => (
            <div className="flex flex-col gap-4" key={index}>
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl">
                  {index === 0 ? <>Hvem er du?</> : <>Gjest {index}</>}
                </h2>
                {index > 0 && (
                  <button
                    onClick={() => {
                      setregisteredPeople((old) => {
                        const updatedPeople = [...old];
                        updatedPeople.splice(index, 1);
                        return updatedPeople;
                      });
                    }}
                    className="rounded-3xl px-4 py-2 flex gap-1 bg-[#FFDBEB] text-[#82052F] justify-center items-center active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Fjern gjest
                    <Image src={del} width={18} height={18} alt="minus ikon" />
                  </button>
                )}
              </div>
              <InputFields
                personData={person}
                updateField={(newValue: string | boolean, type: string) => {
                  updatePerson(newValue, type, index);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setregisteredPeople((old) => [
                ...old,
                {
                  firstName: "",
                  lastName: "",
                  isNT: false,
                  aNumber: "",
                  showSwitch: true,
                },
              ]);
            }}
            className="rounded-3xl px-4 py-2 flex gap-1 bg-[#D8D6DB] text-[#242127] justify-center items-center active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Legg til gjest
            <Image src={add} width={18} height={18} alt="pluss ikon" />
          </button>
          <button
            onClick={() => {
              setstageIndex(stageIndex + 1);
            }}
            disabled={!areAllFieldsFilled(registeredPeople)}
            className="rounded-3xl px-5 py-3 bg-[#91FFC3] text-[#242127] active:scale-95 transition-all duration-[50ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Neste
          </button>
        </div>
      </div>
    </div>
  );
}
