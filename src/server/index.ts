import { Server, Socket } from "socket.io";
import Database from "./utils/db";
import { RegisterFieldsType, mappedSeats } from "../components/register/types";
import { LAN_DATES } from "./config";

// Dictionary to hold seats that are currently held by users
const heldSeats: Record<string, number | undefined> = {};

// Dictionary to map socket IDs to user IDs
const idList: Record<string, string> = {};

let cachedAPIData: ReservationData = { reservedSeats: [] };

// Seats mapped by date
let seatsMappedByDate: mappedSeats = {};
LAN_DATES.forEach((date) => {
  seatsMappedByDate[date] = [];
});

// Seats mapped by number
let seatsMappedBySeatId: mappedSeats = {};

// Seats mapped by employee number
let seatsMappedByAnumber: mappedSeats = {};

// Port on which the server is running
const serverPort = 3004;

// Database configuration
const databaseUrl = "http://lan-party-seating.apps.ocpdq02.norsk-tipping.no"; // Replace with your actual database URL
const username = process.env.LAN_USERNAME;
const password = process.env.LAN_PASSWORD;

if (!username || !password) {
  const errorMessage =
    "Missing username or password ENV!!! (LAN_USERNAME or LAN_PASSWORD)";
  const boxWidth = errorMessage.length + 4;

  console.log("\x1b[31m%s\x1b[0m", "ERROR".padStart(boxWidth, "━"));
  for (let i = 0; i < 3; i++) {
    console.log("\x1b[31m%s\x1b[0m", `┃ ${errorMessage} ┃`);
    if (i < 2) {
      console.log("\x1b[31m%s\x1b[0m", "┃".padStart(boxWidth - 1, " ") + "┃");
    }
  }
  console.log("\x1b[31m%s\x1b[0m", "━".repeat(boxWidth));

  process.exit(1);
}

const db = new Database(databaseUrl, username, password);

import { ReservationData, ReservedSeat } from "./utils/types";
import {
  FeedbackOnly,
  PersonName,
  RatingsWithAverageRating,
  ReserveSeat,
  ReserveSeats,
  ReservedBy,
} from "./api-client";

function getANumber(socketId: string) {
  return idList[socketId].toUpperCase();
}

function mapSeatsData(reservedSeats: ReservationData) {
  seatsMappedByDate = {};
  LAN_DATES.forEach((date) => {
    seatsMappedByDate[date] = [];
  });
  seatsMappedBySeatId = {};
  seatsMappedByAnumber = {};

  reservedSeats.reservedSeats?.forEach((seat, index) => {
    // Create a RegisterFieldsType object
    const registeredSeat: RegisterFieldsType = {
      firstName: seat.personName.firstName,
      lastName: seat.personName.lastName,
      seatNumber: seat.id,
      reservationDate: seat.reservationDate,
    };

    // Only map seats that are within the specified LAN DATES
    if (Object.keys(seatsMappedByDate).includes(seat.reservationDate)) {
      seatsMappedByDate[seat.reservationDate].push(registeredSeat);

      if (!seatsMappedBySeatId[seat.id]) seatsMappedBySeatId[seat.id] = [];

      seatsMappedBySeatId[seat.id].push(registeredSeat);

      if (!seatsMappedByAnumber[seat.reservedBy.employeeId])
        seatsMappedByAnumber[seat.reservedBy.employeeId] = [];

      if (
        seat.personName.firstName === seat.reservedBy.personName.firstName &&
        seat.personName.lastName === seat.reservedBy.personName.lastName
      )
        seatsMappedByAnumber[seat.reservedBy.employeeId].push({
          ...registeredSeat,
          isYou: true,
        });
      else
        seatsMappedByAnumber[seat.reservedBy.employeeId].push(registeredSeat);
    }
  }, {});

  let seats: RegisterFieldsType[] = [];
  LAN_DATES.forEach((date) => {
    seatsMappedByDate[date].forEach((seat) => {
      seats.push(seat);
    });
  });

  io.emit("hereAreSeatsForDate", seats);
  io.emit("hereAreAllRegisteredSeats", seatsMappedBySeatId);
  io.sockets.sockets.forEach((socket) => {
    const aNumber = getANumber(socket.id);
    socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber]);
  });
}

function updateSeatByDate(
  newSeatData: ReserveSeat,
  reservedBy: any,
  socket: Socket
) {
  // UPDATE DATABASE
  const body: ReserveSeats = {
    reservedBy,
    reserveSeats: [newSeatData],
  };

  try {
    db.reserveSeats(getANumber(socket.id), body).then(() => {
      fetcDathabase();
    });
  } catch (error) {
    console.log("failed to update seat");
  }
}

function deleteSeats(
  aNumber: string,
  seatsToDelete: { id: number; reservationDate: string }[]
) {
  // UPDATE DATABASE
  try {
    db.deleteReservedSeat(aNumber.toUpperCase(), seatsToDelete).then(() => {
      fetcDathabase();
    });
  } catch (error) {
    console.log("failed to delete seat");
  }
}

function fetcDathabase() {
  // Map seats from API
  db.getReservedSeats().then((reservedSeats) => {
    cachedAPIData = reservedSeats;
    mapSeatsData(reservedSeats);
  });
}

fetcDathabase();

// Server configuration options
const options: any = {
  cors: {
    origin: "*",
  },
};

// Initialize the server
const io = new Server(serverPort, options);

// Event handler for when a user connects to the server
io.on("connection", (socket: Socket) => {
  // Initialize the user ID for this socket
  idList[socket.id as string] = "";

  // User disconnects
  socket.on("disconnect", () => {
    const socketId = socket.id;

    // Clear from held list
    if (heldSeats[idList[socketId]]) {
      delete heldSeats[idList[socketId]];
    }

    // Clear from idList
    if (idList[socketId]) {
      console.log(`${idList[socketId]} disconnected!`);
      delete idList[socketId];
    }

    // Send new held list to all users
    io.emit("hereAreAllHeldSeats", flatHeldSeats());
  });

  // ------------------------------- NEW -------------------------------
  function flatHeldSeats() {
    let l: (number | undefined)[] = [];
    Object.keys(heldSeats).forEach((key) => {
      if (heldSeats[key] && heldSeats[key] !== undefined)
        l.push(heldSeats[key]);
    });
    return l;
  }

  function giveAllSeatsByDay(dates: string[]) {
    let seats: RegisterFieldsType[] = [];
    dates.forEach((date) => {
      seatsMappedByDate[date].forEach((seat) => {
        seats.push(seat);
      });
    });

    socket.emit("hereAreSeatsForDate", seats);
  }

  // When user connects
  socket.on("iHaveArrived", (aNumber: string) => {
    idList[socket.id as string] = aNumber.toUpperCase();
    console.log(`${getANumber(socket.id)} connected!`);

    // Send connected user seat-data
    socket.emit(
      "hereAreYourRegisteredSeats",
      seatsMappedByAnumber[aNumber.toUpperCase()]
    );
    socket.emit("hereAreAllRegisteredSeats", seatsMappedBySeatId);
    socket.emit("hereAreAllHeldSeats", flatHeldSeats());
    giveAllSeatsByDay(LAN_DATES);
  });

  // Give only registered seats
  socket.on("giveMeMySeats", () => {
    const aNumber = getANumber(socket.id);
    socket.emit(
      "hereAreYourRegisteredSeats",
      seatsMappedByAnumber[aNumber.toUpperCase()]
    );
  });

  // Give seats specific to date
  socket.on("giveMeSeatsForDate", (dates: string[]) => {
    giveAllSeatsByDay(dates);
  });

  // Give all seats that are registered
  socket.on("giveMeAllRegisteredSeats", () => {
    socket.emit("hereAreAllRegisteredSeats", seatsMappedBySeatId);
  });

  // User has updated a seat
  socket.on(
    "iHaveUpdatedASeat",
    (newSeatInformation: ReserveSeat, reservedBy: ReservedBy) => {
      const aNumber = getANumber(socket.id);
      console.log(seatsMappedByAnumber[aNumber]);
      if (aNumber) {
        if (
          seatsMappedByAnumber[aNumber] === undefined
        ) {
          console.log('Updating user with new info', aNumber, newSeatInformation.personName);
          
          db.updateEmployeeInfo(
            aNumber,
            newSeatInformation.personName?.firstName || "",
            newSeatInformation.personName?.lastName || ""
          );
        }

        updateSeatByDate(newSeatInformation, reservedBy, socket);

        socket.emit(
          "hereAreYourRegisteredSeats",
          seatsMappedByAnumber[aNumber]
        );
      }
    }
  );

  // Event handler for when a user holds new seats
  socket.on("iAmHoldingANewSeat", (heldSeat: number) => {
    // When a user is holding new seats, update the heldSeats dictionary
    heldSeats[getANumber(socket.id)] = heldSeat;
    io.emit("hereAreAllHeldSeats", flatHeldSeats());
  });

  // User has deleted a seat
  socket.on("iHaveDeletedASeat", (seatNumber: number, firstName: string) => {
    const aNumber = getANumber(socket.id);
    const seats = seatsMappedBySeatId[seatNumber];
    const seatsToDelete: { id: number; reservationDate: string }[] = [];
    if (seats)
      seats.forEach((seat) => {
        if (seat.firstName === firstName)
          seatsToDelete.push({
            id: seatNumber,
            reservationDate: seat.reservationDate,
          });
      });

    if (seatsToDelete.length > 0) deleteSeats(aNumber, seatsToDelete);
  });

  socket.on("iAmMrAdminGiveMeSeats", () => {
    socket.emit("hereAreAllSeatsMrAdmin", cachedAPIData);
  });

  socket.on("iAmMrAdminGiveMeFeedback", () => {
    db.getRatings().then((ratings: unknown) => {
      const feedbackIds: number[] = [];
      const returnValue: {
        feedBack: string[];
        ratings: number[];
        averageRating: number;
      } = { averageRating: 0, feedBack: [], ratings: [] };
      const len = (ratings as RatingsWithAverageRating).ratings?.length || 0;

      for (let i = 0; i < len + 1; i++) {
        feedbackIds.push(i);
        returnValue.ratings.push(
          (ratings as RatingsWithAverageRating).ratings?.[i] || 0
        );
      }

      returnValue.averageRating =
        (ratings as RatingsWithAverageRating).averageRating || 0;

      db.getFeedback({ feedbackIds }).then((feedBack: unknown) => {
        (feedBack as FeedbackOnly).feedbackOnly?.forEach((feedback, i) => {
          returnValue.feedBack.push(feedback);
        });

        socket.emit("hereAreAllFeedbackMrAdmin", returnValue);
      });
    });
  });

  socket.on(
    "hereIsMyFeedback",
    (feedbackObject: { rating: number; feedbackText: string }) => {
      console.log(feedbackObject);

      db.sendFeedback(
        getANumber(socket.id),
        feedbackObject.rating,
        feedbackObject.feedbackText
      );
    }
  );
  // ------------------------------- NEW -------------------------------
});

console.log("Server running at port", serverPort);
