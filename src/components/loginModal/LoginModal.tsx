import React, { useState } from "react";
import { Card } from "../card/card";
import Input from "../input/Input";
import Button from "../button/Button";
import { aNumberRegex, verifyANumberRegex } from "@/utils/regex";

export default function LoginModal({
  loginFunction,
}: {
  loginFunction: (aNumber: string) => void;
}) {
  const [aNumber, setaNumber] = useState("");
  return (
    <Card className="flex flex-col gap-4 absolute top-12 right-0 w-[300px]">
      <h1 className="font-bold text-lg">Logg inn</h1>
      <Input
        name="Ansatt nummer"
        value={aNumber}
        onChange={(event) => {
          if (
            event.target.value === "" ||
            aNumberRegex.test(event.target.value)
          )
            setaNumber(event.target.value);
        }}
        id="aNummer"
      />
      <Button
        disabled={!verifyANumberRegex.test(aNumber)}
        bold
        isActive
        activeClass="bg-[#C7D7FF] text-[#00309F]"
        onClick={() => {
          loginFunction(aNumber);
        }}
      >
        Logg inn
      </Button>
    </Card>
  );
}
