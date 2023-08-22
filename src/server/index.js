const { Server } = require("socket.io");

const heldSeats = {};

const io = new Server(3005, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User(${socket.id.substring(0, 4)}) connected!`);

  // Emit the updated list of held seats to all users
  socket.emit("userHoldSeats", heldSeats);

  socket.on("disconnect", () => {
    delete heldSeats[socket.id];
  
    // Emit the updated list of held seats to all users
    socket.broadcast.emit("userHoldSeats", heldSeats);
  });

  socket.on("HoldingNewSeats", (seats) => {
    console.log(
      `User(${socket.id.substring(0, 4)}) holding current seats: ${seats}`
    );
  
    // Store the held seats for the current user
    heldSeats[socket.id] = seats;

    // Emit the list of held seats to all users
    socket.broadcast.emit("userHoldSeats", heldSeats);
  });
});

console.log("Server running at port 3005");
