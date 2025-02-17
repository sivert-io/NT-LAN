import Title from "@/components/title/Title";
import Input from "../input/Input";
import { useState } from "react";

export default function ANumberModal({
  setaNumber,
}: {
  setaNumber: (newValue: string) => any;
}) {
  const [tempANumber, settempANumber] = useState("");
  const verifyRegex = /^[aAkK]\d{5}$/;

  function onChange(event: any) {
    const input = event.target.value;
    const regex = /^[aAkK]\d{0,5}$/;

    if (input === "" || regex.test(input)) {
      settempANumber(input);
    }
  }

  const handleEnterKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (verifyRegex.test(tempANumber)) setaNumber(tempANumber.toLowerCase());
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center fixed top-0 bottom-0 left-0 right-0">
      <Title />
      <div className="px-20 py-10 rounded-2xl bg-ntlan_gray w-[562px] flex flex-col gap-6">
        <label htmlFor="A-nummer" className="flex flex-col gap-1 font-medium">
          Hva er ansattnummeret ditt?
          <div className="flex gap-1 items-center justify-center">
            {/* <p className="p-3 rounded-lg bg-zinc-800">A</p>
            <p>-</p> */}
            <input
              id="aNumber"
              onKeyDown={handleEnterKeyPress}
              type="text"
              name="A-nummer"
              placeholder="a00000"
              maxLength={6}
              className="w-full rounded-lg bg-zinc-800 p-3 border-2 focus:border-ntlan_green border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              value={tempANumber}
              onChange={onChange}
            />
          </div>
        </label>
        <div className="flex justify-end items-center">
          <button
            disabled={!verifyRegex.test(tempANumber)}
            onClick={() => {
              if (verifyRegex.test(tempANumber))
                setaNumber(tempANumber.toLowerCase());
            }}
            className="rounded-3xl px-5 py-3 bg-ntlan_green text-[#242127] active:scale-95 transition-all duration-[50ms] disabled:bg-[#D8D6DB] disabled:text-[#6D6973] disabled:cursor-not-allowed"
          >
            Neste
          </button>
        </div>
      </div>
    </div>
  );
}
