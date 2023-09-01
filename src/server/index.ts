import { Server, Socket } from "socket.io";
import Database from "./utils/db";

const heldSeats: Record<string, any> = {};
const registeredSeats: Record<string, any> = {};
const idList: Record<string, string> = {};
const serverPort = 3004;

// Database
const databaseUrl = "http://lan-party-seating.apps.ocpdq02.norsk-tipping.no"; // Replace with your actual database URL
const username = "admin";
const password = "IAMthecaptainnow100";
const db = new Database(databaseUrl, username, password);

const options: any = {
  cors: {
    origin: "*",
  },
};

// Initialize server
const io = new Server(serverPort, options);

io.on("connection", (socket: Socket) => {
  const shortSocketId = socket.id?.substring(0, 4);
  console.log(`User(${shortSocketId}) connected!`);

  idList[socket.id as string] = "";

  socket.on("disconnect", () => {
    const socketId = socket.id as string;
    if (idList[socketId] && heldSeats[idList[socketId]]) {
      delete heldSeats[idList[socketId]];
      delete idList[socketId];
    }

    console.log(`User(${shortSocketId}) disconnected!`);

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  socket.on("giveMeSeats", (aNumber: string) => {
    // When a user loads the map
    socket.emit("updateRegisteredSeats", registeredSeats);
    socket.emit("userHoldSeats", heldSeats);
    idList[socket.id as string] = aNumber;
  });

  socket.on("HoldingNewSeats", (aNumber: string, heldSeat: any) => {
    // When a user is holding a new seat
    heldSeats[aNumber] = heldSeat;

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  socket.on("updateRegisteredSeats", (aNumber: string, registeredPeople: any) => {
    // A user has now changed their registered seats, so let's broadcast it to everyone
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
