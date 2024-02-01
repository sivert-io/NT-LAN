"use client";
import React, { useEffect, useState } from "react";
import { NavLink } from "./NavLink";
import Button, { buttonAnimation } from "../button/Button";
import { useLocalStorage, useStateList } from "react-use";
import LoginModal from "../loginModal/LoginModal";
import Image from "next/image";
import hamburger from "../../app/tabbar-mer-selected.svg";
import Sheet from "../sheet/Sheet";
import settings from "../../app/settings.svg";
import logout from "../../app/logout.svg";
import trophee from "../../app/prize.svg";
import group from "../../app/users.svg";
import seat from "../../app/rekker.svg";
import danger from "../../app/danger-triangle.svg";
import heart from "../../app/heart.svg";
import dashboard from "../../app/sidebar.svg";
import insight from "../../app/spillregnskap.svg";
import cloud from "../../app/cloud.svg";
import apps from "../../app/link.svg";
import { SheetGroup, SheetGroupItem } from "../sheet/SheetGroup";
import { verifyANumberRegex } from "@/utils/regex";
import ConfettiExplosion from "react-confetti-explosion";
import { confettiProps } from "@/utils/confetti";
import Link from "next/link";

const happy = (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Icon">
      <path
        id="Vector"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5076 2.28711C22.2764 2.28711 23.7157 3.72341 23.7157 5.49518V20.5076C23.7157 22.2764 22.2794 23.7157 20.5076 23.7157H5.49518C3.72637 23.7157 2.28711 22.2794 2.28711 20.5076V5.49518C2.28711 3.72637 3.72341 2.28711 5.49518 2.28711H20.5076ZM20.5076 4.42997H5.49518C4.90821 4.42997 4.42997 4.90851 4.42997 5.49518V20.5076C4.42997 21.0946 4.90851 21.5728 5.49518 21.5728H20.5076C21.0946 21.5728 21.5728 21.0943 21.5728 20.5076V5.49518C21.5728 4.90821 21.0943 4.42997 20.5076 4.42997ZM19.2879 11.9001C18.8805 12.1419 18.3571 12.055 18.0537 11.7066L17.8982 11.5019C17.6998 11.2734 17.3977 11.136 17.073 11.136C16.7483 11.136 16.4462 11.2734 16.2478 11.5019L16.0923 11.7066C15.7888 12.055 15.2655 12.1419 14.8581 11.9001C14.3969 11.6265 14.2526 11.0324 14.5481 10.5842C15.0963 9.75281 16.0502 9.25139 17.073 9.25139C18.0957 9.25139 19.0497 9.75281 19.5978 10.5842C19.8933 11.0324 19.749 11.6265 19.2879 11.9001ZM9.91081 11.7066C10.2142 12.055 10.7376 12.1419 11.145 11.9001C11.6062 11.6265 11.7504 11.0324 11.4549 10.5842C10.9068 9.75281 9.95283 9.25139 8.93011 9.25139C7.90739 9.25139 6.95342 9.75281 6.40527 10.5842C6.10979 11.0324 6.25406 11.6265 6.71523 11.9001C7.12263 12.1419 7.64597 12.055 7.94942 11.7066L8.10491 11.5019C8.3033 11.2734 8.60542 11.136 8.93011 11.136C9.25481 11.136 9.55692 11.2734 9.75532 11.5019L9.91081 11.7066ZM9.07282 15.1443H16.93C17.1272 15.1443 17.2832 15.3033 17.2496 15.4977C17.105 16.3328 16.4037 18.3585 13.0014 18.3585C9.5991 18.3585 8.89778 16.3328 8.75322 15.4977C8.71957 15.3033 8.87558 15.1443 9.07282 15.1443Z"
        fill="white"
      />
    </g>
  </svg>
);

export default function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const [aNumber, setaNumber] = useState<string | undefined>(undefined);
  const [localNumber, setLocalNumber, removeANumber] = useLocalStorage<
    typeof aNumber
  >("aNumber", undefined);
  const [loginVisible, setloginVisible] = useState(false);
  const [sidebarVisible, setsidebarVisible] = useState(false);
  const [showFeedback, setshowFeedback] = useState(false);
  const [feedbackText, setfeedbackText] = useState("");
  const [feedbackSent, setfeedbackSent] = useState(false);

  const [showBug, setshowBug] = useState(false);
  const [bugText, setbugText] = useState("");
  const [bugSent, setbugSent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setaNumber(localNumber);

      if (!localNumber) {
        setsidebarVisible(false);
        setloginVisible(false);
      }
    }
  }, [localNumber]);

  useEffect(() => {
    setfeedbackSent(false);
    setfeedbackText("");
  }, [showFeedback]);

  useEffect(() => {
    setbugSent(false);
    setbugText("");
  }, [showBug]);

  return (
    <nav className="bg-[#1A171F] rounded-b-xl fixed top-0 left-0 right-0 flex justify-between items-center p-8 h-24">
      <Link
        href="/v2"
        className="flex select-none pointer-events-auto items-center justify-center gap-2 font-bold text-3xl tracking-widest sm:active:scale-95 duration-100 transition-all"
      >
        <Image src="/NT.svg" width={24} height={24} alt="NT Logo" />
        NTLAN
      </Link>
      <div className="flex items-center relative gap-4">
        {aNumber && aNumber.length > 1 ? (
          <>
            <button
              onClick={() => setsidebarVisible(!sidebarVisible)}
              className={`p-1 ${buttonAnimation}`}
            >
              <Image src={hamburger} alt="hamburber" />
            </button>
          </>
        ) : (
          <>
            <Button transparent onClick={() => setloginVisible(!loginVisible)}>
              Logg inn
            </Button>
            {loginVisible && (
              <LoginModal
                loginFunction={(loginNumber: string) => {
                  if (verifyANumberRegex.test(loginNumber))
                    setLocalNumber(loginNumber.toUpperCase());
                }}
              />
            )}
          </>
        )}
      </div>
      <Sheet
        setVisible={setsidebarVisible}
        closeFunction={() => {
          setsidebarVisible(false);
        }}
        isVisible={sidebarVisible}
        right
      >
        <h1 className="font-bold text-xl">✨ Hei, {aNumber}</h1>
        <SheetGroup title="Meg selv">
          <SheetGroupItem href="/min-profil">
            {happy}
            Min profil
          </SheetGroupItem>
          <SheetGroupItem href="/min-profil/innstillinger">
            <Image src={settings} width={24} height={24} alt="brytere" />
            Innstillinger
          </SheetGroupItem>
          <SheetGroupItem href="/min-profil/trofeer">
            <Image src={trophee} width={24} height={24} alt="trofe"></Image>
            Mine trofeer
          </SheetGroupItem>
          <SheetGroupItem href="/min-profil">
            <Image src={apps} width={24} height={24} alt="brytere" />
            Tilkoblede apper
          </SheetGroupItem>
        </SheetGroup>

        <SheetGroup title="NTLAN">
          <SheetGroupItem href="/kart">
            <Image src={seat} width={24} height={24} alt="sete" />
            Kart
          </SheetGroupItem>
          <SheetGroupItem href="/grupper">
            <Image src={group} width={24} height={24} alt="gruppe" />
            Grupper
          </SheetGroupItem>
          <SheetGroupItem href="/v2/arrangementer">
            <Image src={trophee} width={24} height={24} alt="gruppe" />
            Arrangementer
          </SheetGroupItem>
          <SheetGroupItem href="/dedikerte-servere">
            <Image src={cloud} width={24} height={24} alt="gruppe" />
            Dedikerte servere
          </SheetGroupItem>
        </SheetGroup>

        {isAdmin && (
          <SheetGroup title="Admin">
            <SheetGroupItem href="/admin/dashboard">
              <Image src={dashboard} width={24} height={24} alt="brytere" />
              Dashbord
            </SheetGroupItem>
            <SheetGroupItem href="/admin/innsikt">
              <Image src={insight} width={24} height={24} alt="sete" />
              Innsikt
            </SheetGroupItem>
            <SheetGroupItem href="/admin/arrangementer">
              <Image src={trophee} width={24} height={24} alt="trofe" />
              Arrangementer
            </SheetGroupItem>
            <SheetGroupItem href="/admin/brukere">
              <Image src={group} width={24} height={24} alt="gruppe" />
              Brukere
            </SheetGroupItem>
            <SheetGroupItem href="/admin/kart">
              <Image src={seat} width={24} height={24} alt="sete" />
              Kart
            </SheetGroupItem>
          </SheetGroup>
        )}

        <div className="flex items-center gap-3">
          <Button
            isActive
            activeClass="bg-[#D7AAFF] text-black"
            onClick={() => {
              setshowFeedback(true);
            }}
          >
            <Image src={heart} alt="fare" width={16} height={16} />
            Gi tilbakemelding
          </Button>
          <Button transparent onClick={() => setshowBug(true)}>
            <Image src={danger} alt="fare" width={16} height={16} />
            Rapporter bug
          </Button>
        </div>

        <Button bold onClick={removeANumber}>
          <Image src={logout} alt="logg ut" height={20} width={20} />
          Logg ut
        </Button>
      </Sheet>
      <Sheet
        setVisible={setshowFeedback}
        closeFunction={() => setshowFeedback(false)}
        isVisible={showFeedback}
        right
      >
        <h1 className="font-bold text-xl">Gi tilbakemelding</h1>
        {!feedbackSent && (
          <>
            <p className="text-sm font-medium">
              Har du forslag til forbedringer?
            </p>
            <label htmlFor="tilbakemelding" className="flex flex-col relative">
              <textarea
                name="tilbakemelding"
                maxLength={200}
                value={feedbackText}
                onChange={(event) => {
                  setfeedbackText(event.target.value);
                }}
                className="h-[112px] resize-none w-full px-3 py-2 text-xs bg-[#57535F] rounded-lg border-2 border-[#423E49]"
              />
              <p className="text-xs font-medium absolute bottom-0 opacity-50 right-0 p-2 text-[#C7D7FF]">
                {feedbackText.length} / 200
              </p>
            </label>
            <Button
              isActive={feedbackText.length > 4}
              activeClass="bg-[#C7D7FF] text-[#00309F]"
              onClick={() => {
                if (feedbackText.length > 4) setfeedbackSent(true);
                setTimeout(() => {
                  setshowFeedback(false);
                }, 2000);
              }}
            >
              Send
            </Button>
          </>
        )}
        {feedbackSent && (
          <div className="flex relative items-center justify-center">
            <ConfettiExplosion {...confettiProps} />
            <p className="font-bold">Tusen takk! ✨</p>
          </div>
        )}
      </Sheet>
      <Sheet
        setVisible={setshowBug}
        closeFunction={() => setshowBug(false)}
        isVisible={showBug}
        right
      >
        <h1 className="font-bold text-xl">Rapporter bug</h1>
        {!bugSent && (
          <>
            <div className="text-sm font-medium">
              <p>Beskriv:</p>
              <ol className="list-decimal list-inside">
                <li>Hvor den oppstår</li>
                <li>Hvilke steg du tar for at den oppstår</li>
              </ol>
            </div>
            <label htmlFor="tilbakemelding" className="flex flex-col relative">
              <textarea
                name="tilbakemelding"
                maxLength={200}
                value={bugText}
                onChange={(event) => {
                  setbugText(event.target.value);
                }}
                className="h-[112px] resize-none w-full px-3 py-2 text-xs bg-[#57535F] rounded-lg border-2 border-[#423E49]"
              />
              <p className="text-xs font-medium absolute bottom-0 opacity-50 right-0 p-2 text-[#C7D7FF]">
                {bugText.length} / 200
              </p>
            </label>
            <Button
              isActive={bugText.length > 4}
              activeClass="bg-[#C7D7FF] text-[#00309F]"
              onClick={() => {
                if (bugText.length > 4) setbugSent(true);
                setTimeout(() => {
                  setshowBug(false);
                }, 2000);
              }}
            >
              Send
            </Button>
          </>
        )}
        {bugSent && (
          <div className="flex relative items-center justify-center">
            <ConfettiExplosion {...confettiProps} />
            <p className="font-bold">Tusen takk! ✨</p>
          </div>
        )}
      </Sheet>
    </nav>
  );
}
