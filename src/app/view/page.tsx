"use client";
import { ConnecitonError } from "@/components/connectionError/connecitonError";
import ANumberModal from "@/components/modal/ANumberModal";
import { ADMINS, LAN_DATES } from "@/server/config";
import { ReservationData } from "@/server/utils/types";
import { dayMap } from "@/utils/sidebar";
import { socket } from "@/utils/socket";
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
  const COLORS = ["#CCF3FF", "#EAF7DC", "#FFF2CC", "#FFE5EE"];

  function updateNumbers(seats: ReservationData) {
    let Gjester: string[] = [];
    let Ansatte: string[] = [];

    seats.reservedSeats.forEach((seat) => {
      if (!Ansatte.includes(seat.reservedBy.employeeId.toUpperCase()))
        Ansatte.push(seat.reservedBy.employeeId.toUpperCase());

      if (
        seat.reservedBy.personName.firstName !== seat.personName.firstName ||
        seat.reservedBy.personName.lastName !== seat.personName.lastName
      ) {
        const l = `${seat.personName.firstName} ${seat.personName.lastName}`;
        if (!Gjester.includes(l.toUpperCase())) Gjester.push(l.toUpperCase());
      }
    });

    settotalAnsatte(Ansatte.length);
    settotalGjester(Gjester.length);
  }

  const daysData = [
    {
      name: "Fredag",
      Gjester: allSeats.reservedSeats.filter(
        (seat) =>
          seat.personName.firstName !== seat.reservedBy.personName.firstName &&
          seat.personName.lastName !== seat.reservedBy.personName.lastName &&
          seat.reservationDate === LAN_DATES[0]
      ).length,
      Ansatte: allSeats.reservedSeats.filter(
        (seat) =>
          seat.personName.firstName === seat.reservedBy.personName.firstName &&
          seat.personName.lastName !== seat.reservedBy.personName.lastName &&
          seat.reservationDate === LAN_DATES[0]
      ).length,
    },
    {
      name: "Lørdag",
      Gjester: allSeats.reservedSeats.filter(
        (seat) =>
          seat.personName.firstName !== seat.reservedBy.personName.firstName &&
          seat.personName.lastName !== seat.reservedBy.personName.lastName &&
          seat.reservationDate === LAN_DATES[1]
      ).length,
      Ansatte: allSeats.reservedSeats.filter(
        (seat) =>
          seat.personName.firstName === seat.reservedBy.personName.firstName &&
          seat.personName.lastName !== seat.reservedBy.personName.lastName &&
          seat.reservationDate === LAN_DATES[1]
      ).length,
    },
    {
      name: "Søndag",
      Gjester: allSeats.reservedSeats.filter(
        (seat) =>
          seat.personName.firstName !== seat.reservedBy.personName.firstName &&
          seat.personName.lastName !== seat.reservedBy.personName.lastName &&
          seat.reservationDate === LAN_DATES[2]
      ).length,
      Ansatte: allSeats.reservedSeats.filter(
        (seat) =>
          seat.personName.firstName === seat.reservedBy.personName.firstName &&
          seat.personName.lastName !== seat.reservedBy.personName.lastName &&
          seat.reservationDate === LAN_DATES[2]
      ).length,
    },
  ];

  useEffect(() => {
    if (dayToDisplay === "alle") setseatsToDisplay(allSeats);
    else {
      const d: ReservationData = { reservedSeats: [] };
      allSeats.reservedSeats.forEach((seat) => {
        if (dayMap[seat.reservationDate] === dayToDisplay)
          d.reservedSeats.push(seat);
      });
      setseatsToDisplay(d);
      updateNumbers(d);
    }
  }, [dayToDisplay, allSeats]);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      setconnectionError(err.message);
    });

    socket.on("connect", () => {
      setconnectionError("");
    });

    socket.on("hereAreAllSeatsMrAdmin", (seats: ReservationData) => {
      const sorted = { ...seats }; // Create a shallow copy of the seats object

      if (sorted.reservedSeats) {
        sorted.reservedSeats.sort(function (a, b) {
          const f = a.reservationDate?.split("/").reverse().join("") || "";
          const g = b.reservationDate?.split("/").reverse().join("") || "";

          // First, compare by reservation date
          if (f && g) {
            if (f > g) return 1;
            if (f < g) return -1;
          } else {
            // Handle cases where reservationDate is undefined
            if (f && !g) return 1;
            if (!f && g) return -1;
          }

          // If reservation dates are the same, compare by name
          const firstNameA = a.reservedBy.employeeId || "";
          const firstNameB = b.reservedBy.employeeId || "";

          const nameComparison = firstNameA.localeCompare(firstNameB);

          // If names are the same, compare by seat ID
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

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("hereAreAllSeatsMrAdmin");
    };
  }, []);

  useEffect(() => {
    if (ADMINS.includes(aNumber.toLowerCase() as any))
      socket.emit("iAmMrAdminGiveMeSeats");
  }, [aNumber]);

  return (
    <main className="flex w-full flex-col items-center justify-center gap-12 py-32">
      {connectionError !== "" && (
        <ConnecitonError connectionError={connectionError} />
      )}
      {ADMINS.includes(aNumber.toLowerCase() as any) && (
        <div className="w-[80vw] h-[80vh] overflow-auto flex items-start justify-start flex-col gap-4">
          <div className="flex gap-4 items-center">
            <p>Velg dag:</p>
            <select
              className="p-2 text-sm rounded-lg bg-[#242127] text-[#F3F2F5]"
              onChange={(event) => {
                setdayToDisplay(event.target.value as any);
              }}
              value={dayToDisplay}
            >
              <option value="alle">Alle dager</option>
              <option value="fredag">Fredag</option>
              <option value="lørdag">Lørdag</option>
              <option value="søndag">Søndag</option>
            </select>
          </div>
          <div className="w-full bg-[#423E49] p-6 rounded-2xl text-[#E8E6EB] flex flex-col gap-2">
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
                  const isLast = seatsToDisplay.reservedSeats
                    ? index === seatsToDisplay.reservedSeats.length - 1
                    : false;
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
              <p>Totalt: {seatsToDisplay.reservedSeats.length}</p>
              <p>Ansatte: {totalAnsatte}</p>
              <p>Gjester: {totalGjester}</p>
            </div>
          </div>
        </div>
      )}

      {seatsToDisplay.reservedSeats.length > 0 && (
        <div className="flex flex-col gap-6 items-center justify-center">
          <p>Deltakere per dag</p>
          <BarChart width={1024} height={512} data={daysData}>
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis />
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
          <div className="flex flex-col items-center justify-center">
            <p>Fredag</p>
            <PieChart width={350} height={380}>
              <Pie
                dataKey="value"
                data={[
                  { name: "Gjester", value: daysData[0].Gjester },
                  { name: "Ansatte", value: daysData[0].Ansatte },
                ]}
                fill="#08B8A1"
                label
              >
                <LabelList dataKey="name" fill="#222" stroke="none" />
                {daysData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p>Lørdag</p>
            <PieChart width={350} height={380}>
              <Pie
                dataKey="value"
                data={[
                  { name: "Gjester", value: daysData[1].Gjester },
                  { name: "Ansatte", value: daysData[1].Ansatte },
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
          <div className="flex flex-col items-center justify-center">
            <p>Søndag</p>
            <PieChart width={350} height={380}>
              <Pie
                dataKey="value"
                data={[
                  { name: "Gjester", value: daysData[2].Gjester },
                  { name: "Ansatte", value: daysData[2].Ansatte },
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
        </div>
      )}

      {aNumber === "" && <ANumberModal setaNumber={setaNumber} />}
    </main>
  );
}
