"use client";
import { useState } from "react";
import { RegisterFieldsType } from "@/components/register/types";
import Module from "@/components/modal/modal";
import Seating from "@/components/seating/Seating";

export default function Register() {
  const [stageIndex, setstageIndex] = useState(0);
  const [registeredPeople, setregisteredPeople] = useState<
    RegisterFieldsType[]
  >([{ firstName: "", lastName: "", aNumber: "", isNT: true }]);

  function updatePerson(
    newValue: string | boolean,
    type: keyof RegisterFieldsType,
    personIndex: number
  ) {
    let g = { ...registeredPeople[personIndex] }; // Make a copy to avoid mutating the original object
    g[type] = newValue;

    setregisteredPeople((old) => {
      const updatedPeople = [...old];
      updatedPeople[personIndex] = g;
      return updatedPeople;
    });
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-12">
      {stageIndex === 0 && (
        <Module
          updatePerson={updatePerson}
          registeredPeople={registeredPeople}
          setregisteredPeople={setregisteredPeople}
          stageIndex={stageIndex}
          setstageIndex={setstageIndex}
        />
      )}

      {stageIndex === 1 && <Seating registeredPeople={registeredPeople}/>}
    </main>
  );
}
