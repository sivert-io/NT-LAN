"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var db_1 = require("./utils/db");
// Dictionary to hold seats that are currently held by users
var heldSeats = {};
// Dictionary to store registered seats and users
var registeredSeats = {};
// Dictionary to map socket IDs to user IDs
var idList = {};
// Port on which the server is running
var serverPort = 3004;
// Database configuration
var databaseUrl = "http://lan-party-seating.apps.ocpdq02.norsk-tipping.no"; // Replace with your actual database URL
var username = process.env.LAN_USERNAME;
var password = process.env.LAN_PASSWORD;
if (!username || !password) {
    var errorMessage = 'Missing username or password ENV!!! (LAN_USERNAME or LAN_PASSWORD)';
    var boxWidth = errorMessage.length + 4;
    console.log('\x1b[31m%s\x1b[0m', 'ERROR'.padStart(boxWidth, '━'));
    for (var i = 0; i < 3; i++) {
        console.log('\x1b[31m%s\x1b[0m', "\u2503 ".concat(errorMessage, " \u2503"));
        if (i < 2) {
            console.log('\x1b[31m%s\x1b[0m', '┃'.padStart(boxWidth - 1, ' ') + '┃');
        }
    }
    console.log('\x1b[31m%s\x1b[0m', '━'.repeat(boxWidth));
    process.exit(1);
}
var db = new db_1.default(databaseUrl, username, password);
// Server configuration options
var options = {
    cors: {
        origin: "*",
    },
};
// Initialize the server
var io = new socket_io_1.Server(serverPort, options);
// Event handler for when a user connects to the server
io.on("connection", function (socket) {
    var _a;
    var shortSocketId = (_a = socket.id) === null || _a === void 0 ? void 0 : _a.substring(0, 4);
    // Initialize the user ID for this socket
    idList[socket.id] = "";
    // Event handler for when a user disconnects
    socket.on("disconnect", function () {
        var socketId = socket.id;
        if (idList[socketId])
            console.log("".concat(idList[socketId], " disconnected!"));
        // Check if the user had held seats and remove them
        if (heldSeats[idList[socketId]]) {
            delete heldSeats[idList[socketId]];
            delete idList[socketId];
        }
        // Emit the updated list of held seats to all users
        io.emit("userHoldSeats", heldSeats);
    });
    // Event handler for when a user requests seats
    socket.on("giveMeSeats", function (aNumber) {
        console.log("".concat(aNumber, " connected!"));
        // When a user loads the map, provide them with seat information
        socket.emit("updateRegisteredSeats", registeredSeats);
        setTimeout(function () {
            socket.emit("userHoldSeats", heldSeats);
        }, 1000);
        idList[socket.id] = aNumber;
    });
    // Event handler for when a user holds new seats
    socket.on("HoldingNewSeats", function (aNumber, heldSeat) {
        // When a user is holding new seats, update the heldSeats dictionary
        heldSeats[aNumber] = heldSeat;
        // Emit the updated list of held seats to all users
        io.emit("userHoldSeats", heldSeats);
    });
    // Event handler for when a user updates their registered seats
    socket.on("updateRegisteredSeats", function (aNumber, registeredPeople) {
        // A user has now changed their registered seats, broadcast it to everyone
        console.log(aNumber, "has registered these", registeredPeople);
        registeredSeats[aNumber] = registeredPeople;
        io.emit("updateRegisteredSeats", registeredSeats);
    });
});
console.log("Server running at port", serverPort);
