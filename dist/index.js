"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqsCleanUp = exports.sqsSteps = void 0;
var queue_1 = require("./src/utils/configuration/queue");
var test_data_storage_1 = require("./src/utils/test-data-storage");
var sqs_steps_1 = require("./src/step_definitions/sqs-steps");
Object.defineProperty(exports, "sqsSteps", { enumerable: true, get: function () { return sqs_steps_1.sqsSteps; } });
var sqsCleanUp = function () {
    queue_1.queue.deleteAllQueues();
    test_data_storage_1.testDataStorage.reset();
};
exports.sqsCleanUp = sqsCleanUp;
//# sourceMappingURL=index.js.map