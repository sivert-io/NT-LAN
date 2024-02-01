"use client";
import React, { useEffect } from "react";
import close from "../../app/close.svg";
import Image from "next/image";
import Button from "../button/Button";
import { usePathname } from "next/navigation";

interface Props {
  right?: boolean;
  children: React.ReactNode;
  closeFunction: () => void;
  isVisible: boolean;
  setVisible: (b: boolean) => void;
}

export default function Sheet({
  right,
  children,
  closeFunction,
  isVisible,
  setVisible,
}: Props) {
  const pathname = usePathname();

  useEffect(() => {
    setVisible(false);
  }, [pathname, setVisible]);

  return (
    <div
      className={`fixed flex top-0 left-0 bottom-0 right-0 transition-all ${
        isVisible
          ? "bg-[#00000050] backdrop-blur-sm"
          : "bg-transparent pointer-events-none backdrop-blur-none"
      }
              ${right ? "justify-end" : "justify-start"}
              `}
    >
      {isVisible && (
        <button
          onClick={closeFunction}
          className="fixed top-0 left-0 right-0 bottom-0 cursor-default"
        />
      )}
      <div
        className={`bg-[#242127] w-[512px] h-full p-8 ${
          !right ? "rounded-r-2xl" : "rounded-l-2xl"
        } flex flex-col gap-6 transition-all ${
          isVisible
            ? "translate-x-0"
            : right
            ? "translate-x-[512px]"
            : "-translate-x-[512px]"
        }`}
      >
        <div className="flex w-full justify-end">
          <Button round onClick={closeFunction}>
            <Image src={close} alt="lukk" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
