import { ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
import { v4 } from 'uuid';

class TestDataStorage {
  private testCaseId: string = v4();
  private polledQueueMsgs: { [queueName: string]: ReceiveMessageCommandOutput | undefined } = {};

  getTestCaseId() {
    return this.testCaseId;
  }

  setPolledQueueMsgs(queueName: string, response: ReceiveMessageCommandOutput) {
    this.polledQueueMsgs[queueName] = response;
  }

  getPolledQueueMsgs(queueName: string) {
    return this.polledQueueMsgs[queueName];
  }

  reset() {
    for (const queueName in this.polledQueueMsgs) {
      if (queueName.startsWith(this.testCaseId)) {
        this.polledQueueMsgs[queueName] = undefined;
      }
    }
    this.testCaseId = v4();
  }
}

const testDataStorage = new TestDataStorage();
export { testDataStorage };
