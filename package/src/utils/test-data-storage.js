"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDataStorage = void 0;
var uuid_1 = require("uuid");
var TestDataStorage = /** @class */ (function () {
    function TestDataStorage() {
        this.testCaseId = (0, uuid_1.v4)();
        this.polledQueueMsgs = {};
    }
    TestDataStorage.prototype.getTestCaseId = function () {
        return this.testCaseId;
    };
    TestDataStorage.prototype.setPolledQueueMsgs = function (queueName, response) {
        this.polledQueueMsgs[queueName] = response;
    };
    TestDataStorage.prototype.getPolledQueueMsgs = function (queueName) {
        return this.polledQueueMsgs[queueName];
    };
    TestDataStorage.prototype.reset = function () {
        for (var queueName in this.polledQueueMsgs) {
            if (queueName.startsWith(this.testCaseId)) {
                this.polledQueueMsgs[queueName] = undefined;
            }
        }
        this.testCaseId = (0, uuid_1.v4)();
    };
    return TestDataStorage;
}());
var testDataStorage = new TestDataStorage();
exports.testDataStorage = testDataStorage;
//# sourceMappingURL=test-data-storage.js.map