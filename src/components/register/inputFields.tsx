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
    if (event.target.id === "aNumber") {
      const input = event.target.value;
      const regex = /^a\d{0,5}$/;
  
      if (input === '' || regex.test(input)) {
        updateField(input, event.target.id);
      }

    } else {
      updateField(event.target.value || "", event.target.id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        id="firstName"
        onChange={onChange}
        name="Fornavn"
        value={personData.firstName}
      />
      <Input
        id="lastName"
        onChange={onChange}
        name="Etternavn"
        value={personData.lastName}
      />
      {personData.showSwitch && (
        <div className="flex gap-4 items-center">
          <p className="font-medium text-sm">NT-ansatt</p>
          <Toggle
            checked={personData.isNT}
            onClick={() => {
              updateField(!personData.isNT, "isNT");
            }}
          />
        </div>
      )}
      {personData.isNT && (
        <Input
          maxLength={6}
          placeholder="A00000"
          id="aNumber"
          name="A-nummer"
          onChange={onChange}
          value={personData.aNumber}
        />
      )}
    </div>
  );
}
