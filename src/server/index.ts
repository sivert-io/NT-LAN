import { Server, Socket } from "socket.io";
import Database from "./utils/db";

// Dictionary to hold seats that are currently held by users
const heldSeats: Record<string, any> = {};

// Dictionary to store registered seats and users
const registeredSeats: Record<string, any> = {};

// Dictionary to map socket IDs to user IDs
const idList: Record<string, string> = {};

// Port on which the server is running
const serverPort = 3004;

// Database configuration
const databaseUrl = "http://lan-party-seating.apps.ocpdq02.norsk-tipping.no"; // Replace with your actual database URL
const username = process.env.LAN_USERNAME;
const password = process.env.LAN_PASSWORD;

if (!username || !password) {
  const errorMessage = 'Missing username or password ENV!!! (LAN_USERNAME or LAN_PASSWORD)';
  const boxWidth = errorMessage.length + 4;

  console.log('\x1b[31m%s\x1b[0m', 'ERROR'.padStart(boxWidth, '━'));
  for (let i = 0; i < 3; i++) {
    console.log('\x1b[31m%s\x1b[0m', `┃ ${errorMessage} ┃`);
    if (i < 2) {
      console.log('\x1b[31m%s\x1b[0m', '┃'.padStart(boxWidth - 1, ' ') + '┃');
    }
  }
  console.log('\x1b[31m%s\x1b[0m', '━'.repeat(boxWidth));

  process.exit(1);
}

const db = new Database(databaseUrl, username, password);

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
  const shortSocketId = socket.id?.substring(0, 4);

  // Initialize the user ID for this socket
  idList[socket.id as string] = "";

  // Event handler for when a user disconnects
  socket.on("disconnect", () => {
    const socketId = socket.id as string;
    if (idList[socketId]) console.log(`${idList[socketId]} disconnected!`);

    // Check if the user had held seats and remove them
    if (heldSeats[idList[socketId]]) {
      delete heldSeats[idList[socketId]];
      delete idList[socketId];
    }

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  // Event handler for when a user requests seats
  socket.on("giveMeSeats", (aNumber: string) => {
    console.log(`${aNumber} connected!`);
    // When a user loads the map, provide them with seat information
    socket.emit("updateRegisteredSeats", registeredSeats);
    setTimeout(() => {
      socket.emit("userHoldSeats", heldSeats);
    }, 1000);
    idList[socket.id as string] = aNumber;
  });

  // Event handler for when a user holds new seats
  socket.on("HoldingNewSeats", (aNumber: string, heldSeat: any) => {
    // When a user is holding new seats, update the heldSeats dictionary
    heldSeats[aNumber] = heldSeat;

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  // Event handler for when a user updates their registered seats
  socket.on(
    "updateRegisteredSeats",
    (aNumber: string, registeredPeople: any) => {
      // A user has now changed their registered seats, broadcast it to everyone
      console.log(aNumber, "has registered these", registeredPeople);
      registeredSeats[aNumber] = registeredPeople;
      io.emit("updateRegisteredSeats", registeredSeats);
    }
  );
});

console.log("Server running at port", serverPort);
