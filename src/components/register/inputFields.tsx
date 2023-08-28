import React, { useState } from "react";
import Input from "../input/Input";
import { RegisterFieldsType } from "./types";
import Toggle from "../input/toggle";

export default function InputFields({
  updateField,
  personData,
}: {
  updateField: (newValue: string | boolean, type: string) => void;
  personData: RegisterFieldsType;
}) {
  function onChange(event: any) {
    updateField(event.target.value || "", event.target.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <Input id="firstName" onChange={onChange} name="Fornavn" value={personData.firstName} />
      <Input id="lastName" onChange={onChange} name="Etternavn" value={personData.lastName} />
      {personData.isNT && (
        <Input
          id="aNumber"
          type="number"
          onChange={onChange}
          name="A-nummer"
          value={personData.aNumber}
        />
      )}
      {personData.showSwitch && (
        <div className="flex gap-4 items-center">
          <p className="font-medium text-sm">NT-ansatt</p>
          <Toggle checked={personData.isNT} onClick={() => {
              updateField(!personData.isNT, "isNT");
          }}/>
        </div>
      )}
    </div>
  );
}
