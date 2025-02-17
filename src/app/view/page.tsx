"use client";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { socket } from "@/utils/socket";
import { ADMINS, LAN_DATES } from "@/server/config";
import { ReservationData } from "@/server/utils/types";
import { dayMap } from "@/utils/sidebar";
import Title from "@/components/title/Title";
import { ConnecitonError } from "@/components/connectionError/connecitonError";
import ANumberModal from "@/components/modal/ANumberModal";
import { Card } from "@/components/card/card";
import sad from "../../app/face-sad.svg";
import neutral from "../../app/face-neutral.svg";
import happy from "../../app/face-happy.svg";
import Image from "next/image";

function RatingIcon({
  text,
  textColor,
  icon,
  color,
}: {
  text: string;
  textColor: string;
  icon: any;
  color: string;
}) {
  return (
    <div>
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
    </div>
  );
}

export default function Home() {
  const [aNumber, setaNumber] = useState("");
  const [connectionError, setconnectionError] = useState("");
  const [allSeats, setallSeats] = useState<ReservationData>({
    reservedSeats: [],
  });
  const [dayToDisplay, setdayToDisplay] = useState<
    "alle" | "fredag" | "lørdag" | "søndag"
  >("alle");
  const [seatsToDisplay, setseatsToDisplay] = useState(allSeats);
  const [totalGjester, settotalGjester] = useState(0);
  const [totalAnsatte, settotalAnsatte] = useState(0);
  const [feedBackData, setfeedBackData] = useState<{
    feedBack: string[];
    ratings: number[];
    averageRating: number;
  }>({ feedBack: [], ratings: [], averageRating: 0 });
  const COLORS = ["#CCF3FF", "#EAF7DC", "#FFF2CC", "#FFE5EE"];

  useEffect(() => {
    if (dayToDisplay === "alle") {
      setseatsToDisplay(allSeats);
      updateNumbers(allSeats);
    } else {
      const d: ReservationData = {
        reservedSeats: allSeats.reservedSeats.filter(
          (seat) => dayMap[seat.reservationDate] === dayToDisplay
        ),
      };
      setseatsToDisplay(d);
      updateNumbers(d);
    }
  }, [dayToDisplay, allSeats]);

  const GetLanScore = () => {
    switch (Math.round(feedBackData.averageRating)) {
      case 1:
        return (
          <RatingIcon
            text="Likte ikke"
            textColor="text-[#FFE6F3]"
            icon={sad}
            color="bg-[#FFE6F3]"
          />
        );

      case 2:
        return (
          <RatingIcon
            text="Nøytral"
            textColor="text-[#FEF4C4]"
            icon={neutral}
            color="bg-[#FEF4C4]"
          />
        );

      case 3:
        return (
          <RatingIcon
            text="Likte godt"
            textColor="text-[#E9FCD8]"
            icon={happy}
            color="bg-[#E9FCD8]"
          />
        );
    }
  };

  useEffect(() => {
    socket.on("connect_error", (err) => setconnectionError(err.message));
    socket.on("connect", () => setconnectionError(""));
    socket.on("hereAreAllSeatsMrAdmin", (seats: ReservationData) => {
      const sorted = { ...seats };
      if (sorted.reservedSeats) {
        sorted.reservedSeats.sort((a, b) => {
          const f = a.reservationDate?.split("/").reverse().join("") || "";
          const g = b.reservationDate?.split("/").reverse().join("") || "";
          if (f && g) {
            if (f > g) return 1;
            if (f < g) return -1;
          } else {
            if (f && !g) return 1;
            if (!f && g) return -1;
          }
          const firstNameA = a.reservedBy.employeeId || "";
          const firstNameB = b.reservedBy.employeeId || "";
          const nameComparison = firstNameA.localeCompare(firstNameB);
          if (nameComparison === 0) {
            const seatIdA = a.id.toString() || "";
            const seatIdB = b.id.toString() || "";
            return seatIdA.localeCompare(seatIdB);
          }
          return nameComparison;
        });
      }
      setallSeats(sorted);
      updateNumbers(seats);
    });
    socket.on("hereAreAllFeedbackMrAdmin", (results: typeof feedBackData) => {
      setfeedBackData(results);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("hereAreAllSeatsMrAdmin");
      socket.off("hereAreAllFeedbackMrAdmin");
    };
  }, []);

  useEffect(() => {
    if (ADMINS.includes(aNumber.toLowerCase() as any)) {
      socket.emit("iAmMrAdminGiveMeSeats");
      socket.emit("iAmMrAdminGiveMeFeedback");
    }
  }, [aNumber]);

  const updateNumbers = (seats: ReservationData) => {
    const Gjester: string[] = [];
    const Ansatte: string[] = [];
    seats.reservedSeats.forEach((seat) => {
      if (!Ansatte.includes(seat.reservedBy.employeeId.toUpperCase()))
        Ansatte.push(seat.reservedBy.employeeId.toUpperCase());

      if (
        seat.reservedBy.personName.firstName.toUpperCase() !==
          seat.personName.firstName.toUpperCase() ||
        seat.reservedBy.personName.lastName.toUpperCase() !==
          seat.personName.lastName.toUpperCase()
      ) {
        const l = `${seat.personName.firstName} ${seat.personName.lastName}`;
        if (!Gjester.includes(l.toUpperCase())) Gjester.push(l.toUpperCase());
      }
    });
    settotalAnsatte(Ansatte.length);
    settotalGjester(Gjester.length);
  };

  const daysData = LAN_DATES.map((date, index) => {
    return {
      name: ["Fredag", "Lørdag", "Søndag"][index],
      Gjester: allSeats.reservedSeats.filter(
        (seat) =>
          (seat.personName.firstName.toUpperCase() !==
            seat.reservedBy.personName.firstName.toUpperCase() ||
            seat.personName.lastName.toUpperCase() !==
              seat.reservedBy.personName.lastName.toUpperCase()) &&
          seat.reservationDate === date
      ).length,
      Ansatte: allSeats.reservedSeats.filter(
        (seat) =>
          seat.personName.firstName.toUpperCase() ===
            seat.reservedBy.personName.firstName.toUpperCase() &&
          seat.personName.lastName.toUpperCase() ===
            seat.reservedBy.personName.lastName.toUpperCase() &&
          seat.reservationDate === date
      ).length,
    };
  });

  return (
    <main className="flex w-full flex-col items-center justify-center gap-12 py-32">
      {connectionError !== "" && (
        <ConnecitonError connectionError={connectionError} />
      )}
      {ADMINS.includes(aNumber.toLowerCase() as any) && (
        <div className="w-[80vw] flex items-start justify-start flex-col gap-4">
          <Title />
          <div className="flex gap-4 items-center">
            <p>Velg dag:</p>
            <select
              className="p-2 text-sm rounded-lg bg-[#242127] text-[#F3F2F5]"
              onChange={(event) => setdayToDisplay(event.target.value as any)}
              value={dayToDisplay}
            >
              <option value="alle">Alle dager</option>
              {["fredag", "lørdag", "søndag"].map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <Card className="w-full flex flex-col gap-2">
            <table className="w-full table-auto text-left">
              <thead className="font-normal leading-none">
                <tr className="border-white border-b-2">
                  <th className="py-3">Dato</th>
                  <th>Ansvarlig</th>
                  <th>Deltaker</th>
                  <th>Plass</th>
                </tr>
              </thead>
              <tbody>
                {seatsToDisplay.reservedSeats?.map((seat, index) => {
                  const isLast =
                    index === seatsToDisplay.reservedSeats.length - 1;
                  const classes = isLast ? "" : "border-b border-gray-500";
                  const c = "py-1.5 flex gap-4";
                  return (
                    <tr key={index} className={classes}>
                      <td>
                        <span className={c}>
                          <span>{seat.reservationDate}</span>
                          <span>
                            {seat.reservationDate &&
                              dayMap[seat.reservationDate]}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className={c}>
                          <span className="font-bold">
                            {seat.reservedBy.employeeId}
                          </span>
                          <span>
                            {seat.reservedBy?.personName?.firstName}{" "}
                            <span className="text-xs font-light">
                              {seat.reservedBy?.personName?.lastName}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className={c}>
                          <span>
                            {seat.personName?.firstName}{" "}
                            <span className="text-xs font-light">
                              {seat.personName?.lastName}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className={c}>{seat.id}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex gap-4 items-center text-xs text-gray-400">
              <p>Totale plasser: {seatsToDisplay.reservedSeats.length}</p>
              <p>Totale deltakere: {totalAnsatte + totalGjester}</p>
              <p>Ansatte: {totalAnsatte}</p>
              <p>Gjester: {totalGjester}</p>
            </div>
          </Card>
        </div>
      )}
      {seatsToDisplay.reservedSeats.length > 0 && (
        <div className="flex flex-col gap-6 items-center justify-center">
          <p className="font-bold text-lg">
            Deltakere per dag (totalt 60 plasser)
          </p>
          <BarChart width={1024} height={512} data={daysData}>
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 60]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#242127",
                borderRadius: "16px",
                border: "none",
              }}
              cursor={{ fillOpacity: 0.25 }}
            />
            <Legend />
            <Bar dataKey="Gjester" fill={COLORS[0]} />
            <Bar dataKey="Ansatte" fill={COLORS[1]} />
          </BarChart>
        </div>
      )}
      {seatsToDisplay.reservedSeats.length > 0 && (
        <div className="flex gap-6 items-center justify-center">
          {daysData.map((day, index) => (
            <div
              key={day.name}
              className="flex flex-col items-center justify-center"
            >
              <p>{day.name}</p>
              <PieChart width={350} height={380}>
                <Pie
                  dataKey="value"
                  data={[
                    { name: "Gjester", value: day.Gjester },
                    { name: "Ansatte", value: day.Ansatte },
                  ]}
                  label
                >
                  <LabelList dataKey="name" fill="#222" stroke="none" />
                  {daysData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          ))}
        </div>
      )}
      {feedBackData.ratings.length > 0 && (
        <div className="flex gap-12 items-start justify-center">
          <Card className="flex flex-col gap-4 items-center">
            <h1 className="font-bold">Karakterer</h1>
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 items-center">
                <RatingIcon
                  text="Likte ikke"
                  textColor="text-[#FFE6F3]"
                  icon={sad}
                  color="bg-[#FFE6F3]"
                />
                <p className="text-sm font-bold">
                  {feedBackData.ratings.filter((r) => r === 1).length}
                </p>
              </div>
              <div className="flex flex-col gap-4 items-center">
                <RatingIcon
                  text="Nøytral"
                  textColor="text-[#FEF4C4]"
                  icon={neutral}
                  color="bg-[#FEF4C4]"
                />
                <p className="text-sm font-bold">
                  {feedBackData.ratings.filter((r) => r === 2).length}
                </p>
              </div>
              <div className="flex flex-col gap-4 items-center">
                <RatingIcon
                  text="Likte godt"
                  textColor="text-[#E9FCD8]"
                  icon={happy}
                  color="bg-[#E9FCD8]"
                />
                <p className="text-sm font-bold">
                  {feedBackData.ratings.filter((r) => r === 3).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col gap-4 items-center">
            <h1 className="font-bold">Gjennomsnitlig karakter</h1>
            <GetLanScore />
            <p className="text-xs font-bold">
              {Math.round(feedBackData.averageRating * 10) / 10} av 3
            </p>
          </Card>
          <Card className="flex flex-col gap-4 w-[512px]">
            <h1 className="font-bold">Tilbakemeldinger</h1>
            <div className="flex flex-col gap-3 items-start justify-center w-full">
              {feedBackData.feedBack.map((feedback, i) => (
                <p className="text-sm rounded-lg bg-[#242127] p-2" key={i}>
                  {feedback}
                </p>
              ))}
            </div>
          </Card>
        </div>
      )}
      {!aNumber && <ANumberModal setaNumber={setaNumber} />}
    </main>
  );
}
