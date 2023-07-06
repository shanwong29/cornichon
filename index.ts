import { queue } from "./src/utils/configuration/queue";
import { testDataStorage } from "./src/utils/test-data-storage";

export { sqsSteps } from "./src/step_definitions/sqs-steps";

const sqsCleanUp = () => {
  queue.deleteAllQueues();
  testDataStorage.reset();
};
export { sqsCleanUp };
