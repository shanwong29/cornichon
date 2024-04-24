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
exports.sqsSteps = void 0;
var queue_1 = require("../utils/configuration/queue");
var test_data_storage_1 = require("../utils/test-data-storage");
var sqsSteps = function (_a) {
    var given = _a.given, then = _a.then;
    given(/a (fifo|standard) queue with queue name variable "(.*)" exists/, function (queueType, queueVariableName) { return __awaiter(void 0, void 0, void 0, function () {
        var isFifo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isFifo = queueType === "fifo";
                    // queueName needs to be unique here to avoid messages storing in the same queue in localstack
                    process.env[queueVariableName] = "".concat(test_data_storage_1.testDataStorage.getTestCaseId(), "-").concat(process.env[queueVariableName]);
                    return [4 /*yield*/, queue_1.queue.createQueue(process.env[queueVariableName], isFifo)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    given(/the following batch of queue messages has been sent to queue with queue name variable "(.*)":/, function (queueVariableName, listOfQueueMessages) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queue_1.queue.createTestBatchMessagesInQueue(process.env[queueVariableName], JSON.parse(listOfQueueMessages))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    then(/queue with variable name "(.*)" should have "(.*)" (message|messages)/, function (queueNameVariable, numberOfMsg) { return __awaiter(void 0, void 0, void 0, function () {
        var listOfMsgInQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queue_1.queue.getListOfMessageBodyInQueue(process.env[queueNameVariable])];
                case 1:
                    listOfMsgInQueue = _a.sent();
                    expect(listOfMsgInQueue.length).toBe(Number(numberOfMsg));
                    return [2 /*return*/];
            }
        });
    }); });
    then(/queue with variable name "(.*)" should have message with the following MessageBody\(JSON parsed\) and MessageAttributes:/, function (queueNameVariable, expectedMessage) { return __awaiter(void 0, void 0, void 0, function () {
        var message, parsedMessage, _loop_1, _i, _a, _b, value;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, queue_1.queue.getMessageInQueue(process.env[queueNameVariable])];
                case 1:
                    message = _c.sent();
                    parsedMessage = JSON.parse(expectedMessage);
                    expect(parsedMessage.MessageAttributes).toBeDefined();
                    expect(parsedMessage.MessageBody).toBeDefined();
                    _loop_1 = function (value) {
                        Object.keys(value).forEach(function (nestedKey) { return value[nestedKey] === undefined ? delete value[nestedKey] : {}; });
                    };
                    // Remove all the undefined values within MessageAttributes.
                    for (_i = 0, _a = Object.entries(message.MessageAttributes); _i < _a.length; _i++) {
                        _b = _a[_i], value = _b[1];
                        _loop_1(value);
                    }
                    expect(parsedMessage.MessageAttributes).toStrictEqual(message.MessageAttributes);
                    expect(parsedMessage.MessageBody).toStrictEqual(JSON.parse(message.Body));
                    return [2 /*return*/];
            }
        });
    }); });
    then(/queue with variable name "(.*)" should have message with following message Body:/, function (queueNameVariable, expectedMessageBody) { return __awaiter(void 0, void 0, void 0, function () {
        var listOfMsgInQueue, listOfParsedMsgBody;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queue_1.queue.getListOfMessageBodyInQueue(process.env[queueNameVariable])];
                case 1:
                    listOfMsgInQueue = _a.sent();
                    listOfParsedMsgBody = listOfMsgInQueue === null || listOfMsgInQueue === void 0 ? void 0 : listOfMsgInQueue.map(function (el) {
                        return el ? JSON.parse(el) : el;
                    });
                    expect(listOfParsedMsgBody).toContainEqual(JSON.parse(expectedMessageBody));
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.sqsSteps = sqsSteps;
//# sourceMappingURL=sqs-steps.js.map