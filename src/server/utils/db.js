"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_client_1 = require("../api-client");
var Database = /** @class */ (function () {
    function Database(databaseUrl, username, password) {
        this.config = new api_client_1.Configuration({
            basePath: databaseUrl,
            username: username,
            password: password,
        });
        this.GetSeatsApi = new api_client_1.GetSeatsApi(this.config);
        this.DeleteSeatReservationsApi = new api_client_1.DeleteSeatReservationsApi(this.config);
        this.ReserveSeatsApi = new api_client_1.ReserveSeatsApi(this.config);
        this.AddFeedbackApi = new api_client_1.AddFeedbackApi(this.config);
        this.GetFeedbackOnlyApi = new api_client_1.GetFeedbackOnlyApi(this.config);
        this.GetRatingsAndAverageRatingApi = new api_client_1.GetRatingsAndAverageRatingApi(this.config);
        this.UpdateEmployeeApi = new api_client_1.UpdateEmployeeApi(this.config);
    }
    Database.prototype.getReservedSeats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetSeatsApi.getReservesSeats()];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        // Handle any errors here
                        console.error("Error fetching reserved seats:", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.deleteReservedSeat = function (aNumber, seatsToDelete) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log({
                            employeeId: aNumber,
                            seatReservations: seatsToDelete,
                        });
                        return [4 /*yield*/, this.DeleteSeatReservationsApi.deleteSeats({
                                employeeId: aNumber,
                                seatReservations: seatsToDelete,
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _a.sent();
                        // Handle any errors here
                        console.error("Error deleting reserved seat:", error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.sendFeedback = function (aNumber, rating, feedbackText) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.AddFeedbackApi.addFeedback({ employeeId: aNumber, feedback: feedbackText.length > 5 ? feedbackText : undefined, rating: rating })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        // Handle any errors here
                        console.error("Error sending feedback:", error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.getFeedback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetFeedbackOnlyApi.getFeedbackOnly()];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_4 = _a.sent();
                        // Handle any errors here
                        console.error("Error getting feedback:", error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.getRatings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetRatingsAndAverageRatingApi.getRatingsAndAverageRating()];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_5 = _a.sent();
                        // Handle any errors here
                        console.error("Error getting feedback:", error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.updateEmployeeInfo = function (aNumber, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.UpdateEmployeeApi.updateEmployee({ employeeId: aNumber, newEmployeeId: aNumber, personName: { firstName: firstName, lastName: lastName } })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 2:
                        error_6 = _a.sent();
                        // Handle any errors here
                        console.error("Error updating employee:", error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.reserveSeats = function (aNumber, reserveSeats) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var allSeats_1, seatsToDelete_1, data, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getReservedSeats()];
                    case 1:
                        allSeats_1 = _b.sent();
                        seatsToDelete_1 = [];
                        (_a = reserveSeats.reserveSeats) === null || _a === void 0 ? void 0 : _a.forEach(function (seat) {
                            var _a;
                            if (seat.id) {
                                allSeats_1.reservedSeats.forEach(function (dbSeat) {
                                    var _a;
                                    if (dbSeat.id === seat.id &&
                                        dbSeat.personName.firstName === ((_a = seat.personName) === null || _a === void 0 ? void 0 : _a.firstName) &&
                                        dbSeat.personName.lastName === seat.personName.lastName)
                                        seatsToDelete_1.push({
                                            id: dbSeat.id || -1,
                                            reservationDate: dbSeat.reservationDate,
                                        });
                                });
                                (_a = seat.reservationDates) === null || _a === void 0 ? void 0 : _a.forEach(function (date) {
                                    var s = { id: seat.id || -1, reservationDate: date };
                                    seatsToDelete_1.push(s);
                                });
                            }
                        });
                        return [4 /*yield*/, this.deleteReservedSeat(aNumber, seatsToDelete_1)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.ReserveSeatsApi.reserveSeats(reserveSeats)];
                    case 3:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                    case 4:
                        error_7 = _b.sent();
                        // Handle any errors here
                        console.error("Error reserving seats:", error_7);
                        throw error_7;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Database;
}());
exports.default = Database;
