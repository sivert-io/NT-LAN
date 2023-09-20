import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import close from "../../app/close.svg";
import sad from "../../app/face-sad.svg";
import neutral from "../../app/face-neutral.svg";
import happy from "../../app/face-happy.svg";
import Image from "next/image";
import ConfettiExplosion from "react-confetti-explosion";
import { confettiProps } from "@/utils/confetti";

export function Feedback({
  closeFunction,
  sendFeedback,
}: {
  closeFunction: () => void;
  sendFeedback: () => void;
}) {
  function RatingButton({
    text,
    textColor,
    icon,
    color,
    rating,
  }: {
    text: string;
    textColor: string;
    icon: any;
    color: string;
    rating: number;
  }) {
    return (
      <Button
        transparent
        onClick={() => {
          setrating(rating);
        }}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <span
            className={`rounded-full ${color} flex items-center justify-center w-10 h-10`}
          >
            <Image
              width={24}
              height={24}
              alt="Smilefjes"
              src={icon}
              className={`w-6 h-6`}
            />
          </span>
          <p className={`text-xs font-bold ${textColor}`}>{text}</p>
        </div>
      </Button>
    );
  }

  const [rating, setrating] = useState(-1);
  const [feedbackText, setfeedbackText] = useState("");
  const [done, setdone] = useState(false);
  const [isVisible, setisVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setisVisible(true);
    }, 1000);
  }, []);

  return (
    <div className="absolute left-0 top-0 bottom-0 p-6 w-[300px] flex items-end">
      <div
        className={`bg-[#242127] rounded-2xl p-3 w-full transition-all duration-500 ${
          !isVisible ? "translate-y-[150%]" : "translate-y-0"
        }`}
      >
        {rating === -1 && (
          <div className="text-center flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col justify-center items-end">
                <Button
                  transparent
                  onClick={() => {
                    closeFunction();
                  }}
                >
                  <Image src={close} width={16} height={16} alt="Kryss ikon" />
                </Button>
                <p className="text-xs font-medium w-full">
                  Hjelp oss å bli bedre
                </p>
              </div>
              <p className="font-bold text-sm">Hva synes du om bookingen?</p>
            </div>
            <div className="flex justify-evenly">
              <RatingButton
                rating={0}
                text="Likte ikke"
                textColor="text-[#FFE6F3]"
                icon={sad}
                color="bg-[#FFE6F3]"
              />
              <RatingButton
                rating={1}
                text="Nøytral"
                textColor="text-[#FEF4C4]"
                icon={neutral}
                color="bg-[#FEF4C4]"
              />
              <RatingButton
                rating={2}
                text="Likte godt"
                textColor="text-[#E9FCD8]"
                icon={happy}
                color="bg-[#E9FCD8]"
              />
            </div>
          </div>
        )}
        {rating !== -1 && !done && (
          <div className="text-left flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-xs">Takk for din tilbakemelding!</p>
              <p className="font-medium text-xs">
                Kunne du tenke deg å utdype litt? Eller har du forslag til
                forbedringer?
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                value={feedbackText}
                onChange={(event) => {
                  setfeedbackText(event.target.value);
                }}
                className="h-[112px] resize-none w-full px-3 py-2 text-xs bg-[#57535F] rounded-lg border-2 border-[#423E49]"
              />
              <div className="flex w-full justify-end gap-2">
                <Button
                  onClick={() => {
                    setdone(true);
                    sendFeedback();
                    setTimeout(() => {
                      setisVisible(false);
                      setTimeout(() => {
                        closeFunction();
                      }, 1000);
                    }, 5000);
                  }}
                  isActive
                  activeClass="text-[#C7D7FF] bg-[#423E49]"
                >
                  Hopp over
                </Button>
                <Button
                  onClick={() => {
                    setdone(true);
                    sendFeedback();
                    setTimeout(() => {
                      setisVisible(false);
                      setTimeout(() => {
                        closeFunction();
                      }, 1000);
                    }, 5000);
                  }}
                  isActive
                  activeClass="text-[#00309F] bg-[#C7D7FF]"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
        {done && (
          <div className="flex relative items-center justify-center">
            <ConfettiExplosion {...confettiProps} />
            <p className="font-bold">Tusen takk! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}
