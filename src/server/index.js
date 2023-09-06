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
var username = "admin";
var password = "IAMthecaptainnow100";
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
        socket.emit("userHoldSeats", heldSeats);
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
