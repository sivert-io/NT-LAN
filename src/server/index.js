"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
function getANumber(socketId) {
    return idList[socketId].toUpperCase();
}
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
            if (seat.personName.firstName === seat.reservedBy.personName.firstName &&
                seat.personName.lastName === seat.reservedBy.personName.lastName)
                seatsMappedByAnumber[seat.reservedBy.employeeId].push(__assign(__assign({}, registeredSeat), { isYou: true }));
            else
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
        var aNumber = getANumber(socket.id);
        socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber]);
    });
}
function updateSeatByDate(newSeatData, reservedBy, socket) {
    // UPDATE DATABASE
    var body = {
        reservedBy: reservedBy,
        reserveSeats: [newSeatData],
    };
    try {
        db.reserveSeats(getANumber(socket.id), body).then(function () {
            db.getReservedSeats().then(function (reservedSeats) {
                var _a, _b;
                cachedAPIData = reservedSeats;
                mapSeatsData(reservedSeats);
                if (seatsMappedByAnumber[getANumber(socket.id)] !== undefined) {
                    var firstSeat = seatsMappedByAnumber[getANumber(socket.id)][0];
                    if (firstSeat.seatNumber === newSeatData.id) {
                        console.log("Updating user with new info", getANumber(socket.id), newSeatData.personName);
                        db.updateEmployeeInfo(getANumber(socket.id), ((_a = newSeatData.personName) === null || _a === void 0 ? void 0 : _a.firstName) || "", ((_b = newSeatData.personName) === null || _b === void 0 ? void 0 : _b.lastName) || "");
                    }
                }
            });
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
        console.log("".concat(getANumber(socket.id), " connected!"));
        // Send connected user seat-data
        socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber.toUpperCase()]);
        socket.emit("hereAreAllRegisteredSeats", seatsMappedBySeatId);
        socket.emit("hereAreAllHeldSeats", flatHeldSeats());
        giveAllSeatsByDay(config_1.LAN_DATES);
    });
    // Give only registered seats
    socket.on("giveMeMySeats", function () {
        var aNumber = getANumber(socket.id);
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
    // User has updated a seat
    socket.on("iHaveUpdatedASeat", function (newSeatInformation, reservedBy) {
        var aNumber = getANumber(socket.id);
        if (aNumber) {
            updateSeatByDate(newSeatInformation, reservedBy, socket);
            socket.emit("hereAreYourRegisteredSeats", seatsMappedByAnumber[aNumber]);
        }
    });
    // Event handler for when a user holds new seats
    socket.on("iAmHoldingANewSeat", function (heldSeat) {
        // When a user is holding new seats, update the heldSeats dictionary
        heldSeats[getANumber(socket.id)] = heldSeat;
        io.emit("hereAreAllHeldSeats", flatHeldSeats());
    });
    // User has deleted a seat
    socket.on("iHaveDeletedASeat", function (seatNumber, firstName) {
        var aNumber = getANumber(socket.id);
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
            deleteSeats(aNumber, seatsToDelete);
    });
    socket.on("iAmMrAdminGiveMeSeats", function () {
        socket.emit("hereAreAllSeatsMrAdmin", cachedAPIData);
    });
    socket.on("iAmMrAdminGiveMeFeedback", function () {
        db.getRatings().then(function (ratings) {
            var _a, _b;
            var feedbackIds = [];
            var returnValue = { averageRating: 0, feedBack: [], ratings: [] };
            var len = ((_a = ratings.ratings) === null || _a === void 0 ? void 0 : _a.length) || 0;
            for (var i = 0; i < len + 1; i++) {
                feedbackIds.push(i);
                returnValue.ratings.push(((_b = ratings.ratings) === null || _b === void 0 ? void 0 : _b[i]) || 0);
            }
            returnValue.averageRating =
                ratings.averageRating || 0;
            db.getFeedback({ feedbackIds: feedbackIds }).then(function (feedBack) {
                var _a;
                (_a = feedBack.feedbackOnly) === null || _a === void 0 ? void 0 : _a.forEach(function (feedback, i) {
                    returnValue.feedBack.push(feedback);
                });
                socket.emit("hereAreAllFeedbackMrAdmin", returnValue);
            });
        });
    });
    socket.on("hereIsMyFeedback", function (feedbackObject) {
        console.log(feedbackObject);
        db.sendFeedback(getANumber(socket.id), feedbackObject.rating, feedbackObject.feedbackText);
    });
    // ------------------------------- NEW -------------------------------
});
console.log("Server running at port", serverPort);
