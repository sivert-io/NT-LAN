const { Server } = require('socket.io');

const heldSeats = {};
const serverPort = 3004;

const io = new Server(serverPort, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User(${socket.id.substring(0, 4)}) connected!`);

  // Emit the updated list of held seats to all users
  socket.emit('userHoldSeats', heldSeats);

  socket.on('disconnect', () => {
    delete heldSeats[socket.id];

    console.log(`User(${socket.id.substring(0, 4)}) disconnected!`);
  
    // Emit the updated list of held seats to all users
    socket.broadcast.emit('userHoldSeats', heldSeats);
  });

  socket.on('HoldingNewSeats', (seats) => {
    console.log(
      `User(${socket.id.substring(0, 4)}) is holding: ${seats.length > 0 ? seats : 'no seats'}`
    );
    
    // Store the held seats for the current user
    heldSeats[socket.id] = seats;

    // Emit the list of held seats to all users
    socket.broadcast.emit('userHoldSeats', heldSeats);
  });

  socket.on('submitSeats', (seatsToUpdate) => {
    console.log(`User(${socket.id.substring(0, 4)}) updated: ${Object.keys(seatsToUpdate)}`);

    // Send updated seats to all users now
  })
});

console.log('Server running at port', serverPort);
