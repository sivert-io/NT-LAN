import { Server, Socket } from "socket.io"; // Import Server and Socket types
import Database from "./utils/db";

const heldSeats: { [key: string]: any } = {};
const registeredSeats: { [key: string]: any } = {};
const idList: { [key: string]: string } = {};
const serverPort: number = 3004;

// Database
const databaseUrl: string = "http://lan-party-seating.apps.ocpdq02.norsk-tipping.no"; // Replace with your actual database URL
const username: string = "admin";
const password: string = "IAMthecaptainnow100";
const db = new Database(databaseUrl, username, password);

const options: any = {
  cors: {
    origin: "*",
  }
}

// Initialize server
const io = new Server(serverPort, options);

io.on("connection", (socket: Socket) => {
  console.log(`User(${socket.id?.substring(0, 4)}) connected!`);

  idList[socket.id as string] = "";

  socket.on("disconnect", () => {
    if (idList[socket.id as string] && heldSeats[idList[socket.id as string]]) {
      delete heldSeats[idList[socket.id as string]];
      delete idList[socket.id as string];
    }

    console.log(`User(${socket.id?.substring(0, 4)}) disconnected!`);

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  socket.on("giveMeSeats", (aNumber: string) => {

    // When user loads map
    socket.emit("updateRegisteredSeats", registeredSeats);
    socket.emit("userHoldSeats", heldSeats);
    idList[socket.id as string] = aNumber;
  });

  socket.on("HoldingNewSeats", (aNumber: string, heldSeat: any) => {
    // When user is holding new seat
    heldSeats[aNumber] = heldSeat;

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  socket.on("updateRegisteredSeats", (aNumber: string, registeredPeople: any) => {
    // A user has now changed their registered Seats, so let's broadcast it to everyone
    console.log(aNumber, "has registered these", registeredPeople);
    registeredSeats[aNumber] = registeredPeople;
    io.emit("updateRegisteredSeats", registeredSeats);
  });

  socket.on("updateUser", async (userId: string, updatedUser: any) => {
    try {
      const user = await db.updateEmployee({});
      // Handle the updated user data as needed
      io.emit("userUpdated", user); // Emit an event to inform clients about the update
    } catch (error) {
      // Handle errors
    }
  });
});

console.log("Server running at port", serverPort);
