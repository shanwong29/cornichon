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
exports.queue = void 0;
var client_sqs_1 = require("@aws-sdk/client-sqs");
var promises_1 = require("timers/promises");
var test_data_storage_1 = require("../test-data-storage");
var getSqs = function () {
    var sqsConfig = {
        region: process.env["AWS_REGION"] || "eu-central-1",
    };
    sqsConfig.endpoint =
        process.env["TEST_SQS_ENDPOINT"] ||
            "http://eu-central-1.queue.localhost.localstack.cloud:4566";
    sqsConfig.credentials = {
        accessKeyId: process.env["TEST_AWS_ACCESS_KEY_ID"] || "test",
        secretAccessKey: process.env["TEST_AWS_SECRET_ACCESS_KEY"] || "test",
    };
    return new client_sqs_1.SQSClient(sqsConfig);
};
var visibilityTimeout = "1";
exports.queue = {
    createQueue: function (queueNameWithTestId, isFifo) {
        if (isFifo === void 0) { isFifo = false; }
        return __awaiter(void 0, void 0, void 0, function () {
            var input, command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            Attributes: {
                                // different setting from terraform for testing convienience, i.e. in flight message will be available 1 second after being consumed
                                VisibilityTimeout: visibilityTimeout,
                                DelaySeconds: "0",
                            },
                            QueueName: queueNameWithTestId,
                        };
                        if (isFifo) {
                            input.Attributes.FifoQueue = "true";
                            input.Attributes.DeduplicationScope = "messageGroup";
                        }
                        command = new client_sqs_1.CreateQueueCommand(input);
                        return [4 /*yield*/, getSqs().send(command)];
                    case 1:
                        response = _a.sent();
                        console.log("Test queue has been created -- ".concat(JSON.stringify(response.QueueUrl)));
                        return [2 /*return*/];
                }
            });
        });
    },
    deleteAllQueues: function () { return __awaiter(void 0, void 0, void 0, function () {
        var testId, command, QueueUrls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testId = test_data_storage_1.testDataStorage.getTestCaseId();
                    command = new client_sqs_1.ListQueuesCommand({});
                    return [4 /*yield*/, getSqs().send(command)];
                case 1:
                    QueueUrls = (_a.sent()).QueueUrls;
                    if (!QueueUrls) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(QueueUrls.map(function (QueueUrl) { return __awaiter(void 0, void 0, void 0, function () {
                            var command_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!QueueUrl.includes(testId)) return [3 /*break*/, 2];
                                        command_1 = new client_sqs_1.DeleteQueueCommand({ QueueUrl: QueueUrl });
                                        return [4 /*yield*/, getSqs().send(command_1)];
                                    case 1:
                                        _a.sent();
                                        console.log("Queue ".concat(QueueUrl, " is deleted"));
                                        return [3 /*break*/, 3];
                                    case 2: return [2 /*return*/, true];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    createTestBatchMessagesInQueue: function (queueName, entries) { return __awaiter(void 0, void 0, void 0, function () {
        var sendParams, command, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sendParams = {
                        QueueUrl: "".concat(process.env["QUEUE_DOMAIN"], "/").concat(queueName),
                        Entries: entries,
                    };
                    command = new client_sqs_1.SendMessageBatchCommand(sendParams);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log(JSON.stringify(sendParams));
                    return [4 /*yield*/, getSqs().send(command)];
                case 2:
                    response = _a.sent();
                    console.log("Test batch messages created: ".concat(JSON.stringify(response.Successful)));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getMessageInQueue: function (queueName) { return __awaiter(void 0, void 0, void 0, function () {
        var response, command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = test_data_storage_1.testDataStorage.getPolledQueueMsgs(queueName);
                    if (!(response === undefined)) return [3 /*break*/, 2];
                    command = new client_sqs_1.ReceiveMessageCommand({
                        MaxNumberOfMessages: 1,
                        QueueUrl: "".concat(process.env["QUEUE_DOMAIN"], "/").concat(queueName),
                        MessageAttributeNames: [".*"],
                    });
                    return [4 /*yield*/, getSqs().send(command)];
                case 1:
                    response = _a.sent();
                    // after polling, messages will be gone and cannot be re-polled, so the polled message are stored in testDataStorage in case of later use
                    test_data_storage_1.testDataStorage.setPolledQueueMsgs(queueName, response);
                    _a.label = 2;
                case 2:
                    if (!(response === null || response === void 0 ? void 0 : response.Messages) || response.Messages.length < 1) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, response.Messages[0]];
            }
        });
    }); },
    getListOfMessageBodyInQueue: function (queueName) { return __awaiter(void 0, void 0, void 0, function () {
        var response, command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = test_data_storage_1.testDataStorage.getPolledQueueMsgs(queueName);
                    if (!(response === undefined)) return [3 /*break*/, 2];
                    command = new client_sqs_1.ReceiveMessageCommand({
                        MaxNumberOfMessages: 10,
                        QueueUrl: "".concat(process.env["QUEUE_DOMAIN"], "/").concat(queueName),
                    });
                    return [4 /*yield*/, getSqs().send(command)];
                case 1:
                    response = _a.sent();
                    // after polling, messages will be gone and cannot be re-polled, so the polled message are stored in testDataStorage in case of later use
                    test_data_storage_1.testDataStorage.setPolledQueueMsgs(queueName, response);
                    _a.label = 2;
                case 2:
                    if (!(response === null || response === void 0 ? void 0 : response.Messages)) {
                        return [2 /*return*/, []];
                    }
                    // remove all white space in json string
                    return [2 /*return*/, response.Messages.map(function (_a) {
                            var Body = _a.Body;
                            return Body;
                        })];
            }
        });
    }); },
    waitForInFlightMessagesToBeVisible: function () {
        var waitingTime = (Number(visibilityTimeout) + 1) * 1000;
        return (0, promises_1.setTimeout)(waitingTime);
    },
};
//# sourceMappingURL=queue.js.map