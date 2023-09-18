"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var db_1 = require("./utils/db");
var config_1 = require("./config");
// Dictionary to hold seats that are currently held by users
var heldSeats = {};
// Dictionary to map socket IDs to user IDs
var idList = {};
var cachedAPIData = { reservedSeats: [] };
// Seats mapped by date
var seatsMappedByDate = {};
config_1.LAN_DATES.forEach(function (date) {
    seatsMappedByDate[date] = [];
});
// Seats mapped by number
var seatsMappedBySeatId = {};
// Seats mapped by employee number
var seatsMappedByAnumber = {};
// Port on which the server is running
var serverPort = 3004;
// Database configuration
var databaseUrl = "http://lan-party-seating.apps.ocpdq02.norsk-tipping.no"; // Replace with your actual database URL
var username = process.env.LAN_USERNAME;
var password = process.env.LAN_PASSWORD;
if (!username || !password) {
    var errorMessage = "Missing username or password ENV!!! (LAN_USERNAME or LAN_PASSWORD)";
    var boxWidth = errorMessage.length + 4;
    console.log("\x1b[31m%s\x1b[0m", "ERROR".padStart(boxWidth, "━"));
    for (var i = 0; i < 3; i++) {
        console.log("\x1b[31m%s\x1b[0m", "\u2503 ".concat(errorMessage, " \u2503"));
        if (i < 2) {
            console.log("\x1b[31m%s\x1b[0m", "┃".padStart(boxWidth - 1, " ") + "┃");
        }
    }
    console.log("\x1b[31m%s\x1b[0m", "━".repeat(boxWidth));
    process.exit(1);
}
var db = new db_1.default(databaseUrl, username, password);
function mapSeatsData(reservedSeats) {
    var _a;
    seatsMappedByDate = {};
    config_1.LAN_DATES.forEach(function (date) {
        seatsMappedByDate[date] = [];
    });
    seatsMappedBySeatId = {};
    seatsMappedByAnumber = {};
    (_a = reservedSeats.reservedSeats) === null || _a === void 0 ? void 0 : _a.forEach(function (seat, index) {
        // Create a RegisterFieldsType object
        var registeredSeat = {
            firstName: seat.personName.firstName,
            lastName: seat.personName.lastName,
            seatNumber: seat.id,
            reservationDate: seat.reservationDate,
        };
        // Only map seats that are within the specified LAN DATES
        if (Object.keys(seatsMappedByDate).includes(seat.reservationDate)) {
            seatsMappedByDate[seat.reservationDate].push(registeredSeat);
            if (!seatsMappedBySeatId[seat.id])
                seatsMappedBySeatId[seat.id] = [];
            seatsMappedBySeatId[seat.id].push(registeredSeat);
            if (!seatsMappedByAnumber[seat.reservedBy.employeeId])
                seatsMappedByAnumber[seat.reservedBy.employeeId] = [];
            seatsMappedByAnumber[seat.reservedBy.employeeId].push(registeredSeat);
        }
    }, {});
    var seats = [];
    config_1.LAN_DATES.forEach(function (date) {
        seatsMappedByDate[date].forEach(function (seat) {
            seats.push(seat);
        });
    });
    io.emit("hereAreSeatsForDate", seats);
    io.emit("hereAreAllRegisteredSeats", seatsMappedBySeatId);
    io.sockets.sockets.forEach(function (socket) {
        var aNumber = idList[socket.id];
        socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber.toUpperCase()]);
    });
}
function updateSeatByDate(newSeatData, reservedBy, socket) {
    // UPDATE DATABASE
    var body = {
        reservedBy: reservedBy,
        reserveSeats: [newSeatData],
    };
    try {
        db.reserveSeats(idList[socket.id], body).then(function () {
            fetcDathabase();
        });
    }
    catch (error) {
        console.log("failed to update seat");
    }
}
function deleteSeats(aNumber, seatsToDelete) {
    // UPDATE DATABASE
    try {
        db.deleteReservedSeat(aNumber.toUpperCase(), seatsToDelete).then(function () {
            fetcDathabase();
        });
    }
    catch (error) {
        console.log("failed to delete seat");
    }
}
function fetcDathabase() {
    // Map seats from API
    db.getReservedSeats().then(function (reservedSeats) {
        cachedAPIData = reservedSeats;
        mapSeatsData(reservedSeats);
    });
}
fetcDathabase();
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
    // Initialize the user ID for this socket
    idList[socket.id] = "";
    // User disconnects
    socket.on("disconnect", function () {
        var socketId = socket.id;
        // Clear from held list
        if (heldSeats[idList[socketId]]) {
            delete heldSeats[idList[socketId]];
        }
        // Clear from idList
        if (idList[socketId]) {
            console.log("".concat(idList[socketId], " disconnected!"));
            delete idList[socketId];
        }
        // Send new held list to all users
        io.emit("hereAreAllHeldSeats", flatHeldSeats());
    });
    // ------------------------------- NEW -------------------------------
    function flatHeldSeats() {
        var l = [];
        Object.keys(heldSeats).forEach(function (key) {
            if (heldSeats[key] && heldSeats[key] !== undefined)
                l.push(heldSeats[key]);
        });
        return l;
    }
    function giveAllSeatsByDay(dates) {
        var seats = [];
        dates.forEach(function (date) {
            seatsMappedByDate[date].forEach(function (seat) {
                seats.push(seat);
            });
        });
        socket.emit("hereAreSeatsForDate", seats);
    }
    // When user connects
    socket.on("iHaveArrived", function (aNumber) {
        idList[socket.id] = aNumber.toUpperCase();
        console.log("".concat(aNumber, " connected!"));
        // Send connected user seat-data
        socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber.toUpperCase()]);
        socket.emit("hereAreAllRegisteredSeats", seatsMappedBySeatId);
        socket.emit("hereAreAllHeldSeats", flatHeldSeats());
        giveAllSeatsByDay(config_1.LAN_DATES);
    });
    // Give only registered seats
    socket.on("giveMeMySeats", function () {
        var aNumber = idList[socket.id];
        socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber.toUpperCase()]);
    });
    // Give seats specific to date
    socket.on("giveMeSeatsForDate", function (dates) {
        giveAllSeatsByDay(dates);
    });
    // Give all seats that are registered
    socket.on("giveMeAllRegisteredSeats", function () {
        socket.emit("hereAreAllRegisteredSeats", seatsMappedBySeatId);
    });
    // Give all seats that are held
    socket.on("giveMeAllHeldSeats", function () {
        socket.emit("hereAreAllHeldSeats", flatHeldSeats());
    });
    // User has updated a seat
    socket.on("iHaveUpdatedASeat", function (newSeatInformation, reservedBy) {
        var aNumber = idList[socket.id];
        if (aNumber) {
            updateSeatByDate(newSeatInformation, reservedBy, socket);
            socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber.toUpperCase()]);
        }
    });
    // Event handler for when a user holds new seats
    socket.on("iAmHoldingANewSeat", function (aNumber, heldSeat) {
        // When a user is holding new seats, update the heldSeats dictionary
        heldSeats[aNumber.toUpperCase()] = heldSeat;
        io.emit("hereAreAllHeldSeats", flatHeldSeats());
    });
    // User has deleted a seat
    socket.on("iHaveDeletedASeat", function (seatNumber, firstName) {
        var aNumber = idList[socket.id];
        var seats = seatsMappedBySeatId[seatNumber];
        var seatsToDelete = [];
        if (seats)
            seats.forEach(function (seat) {
                if (seat.firstName === firstName)
                    seatsToDelete.push({
                        id: seatNumber,
                        reservationDate: seat.reservationDate,
                    });
            });
        if (seatsToDelete.length > 0)
            deleteSeats(aNumber.toUpperCase(), seatsToDelete);
    });
    // ------------------------------- NEW -------------------------------
});
console.log("Server running at port", serverPort);
