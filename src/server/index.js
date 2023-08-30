const { Server } = require("socket.io");

const heldSeats = {};
const registeredSeats = {};
const serverPort = 3004;
const idList = {};

const io = new Server(serverPort, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User(${socket.id.substring(0, 4)}) connected!`);

  idList[socket.id] = "";

  socket.on("disconnect", () => {
    if (idList[socket.id] && heldSeats[idList[socket.id]]) {
      delete heldSeats[idList[socket.id]];
      delete idList[socket.id];
    }

    console.log(`User(${socket.id.substring(0, 4)}) disconnected!`);

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  socket.on("giveMeSeats", (aNumber) => {
    // When user loads map
    socket.emit("updateRegisteredSeats", registeredSeats);
    socket.emit("userHoldSeats", heldSeats);
    idList[socket.id] = aNumber;
  });

  socket.on("HoldingNewSeats", (aNumber, heldSeat) => {
    // When user is holding new seat
    heldSeats[aNumber] = heldSeat;

    // Emit the updated list of held seats to all users
    io.emit("userHoldSeats", heldSeats);
  });

  socket.on("updateRegisteredSeats", (aNumber, registeredPeople) => {
    // A user has now changed their registered Seats, so lets broadcast it to everyone
    console.log(aNumber, "has registered these", registeredPeople);
    registeredSeats[aNumber] = registeredPeople;
    io.emit("updateRegisteredSeats", registeredSeats);
  });
});

console.log("Server running at port", serverPort);
