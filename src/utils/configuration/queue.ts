import {
  CreateQueueCommand,
  CreateQueueCommandInput,
  DeleteQueueCommand,
  ListQueuesCommand,
  ReceiveMessageCommand,
  SendMessageBatchCommand,
  SendMessageBatchRequest,
  SendMessageBatchRequestEntry,
  SQSClient,
  SQSClientConfig,
} from "@aws-sdk/client-sqs";
import { setTimeout } from "timers/promises";
import { testDataStorage } from "../test-data-storage";

const getSqs = () => {
  const sqsConfig: SQSClientConfig = {
    region: process.env["AWS_REGION"] || "eu-central-1",
  };

  sqsConfig.endpoint =
    process.env["TEST_SQS_ENDPOINT"] ||
    "http://eu-central-1.queue.localhost.localstack.cloud:4566";
  sqsConfig.credentials = {
    accessKeyId: (process.env["TEST_AWS_ACCESS_KEY_ID"] as string) || "test",
    secretAccessKey:
      (process.env["TEST_AWS_SECRET_ACCESS_KEY"] as string) || "test",
  };

  return new SQSClient(sqsConfig);
};

const visibilityTimeout = "1";

export const queue = {
  createQueue: async (queueNameWithTestId: string, isFifo = false) => {
    const input: CreateQueueCommandInput = {
      Attributes: {
        // different setting from terraform for testing convienience, i.e. in flight message will be available 1 second after being consumed
        VisibilityTimeout: visibilityTimeout,
        DelaySeconds: "0",
      },
      QueueName: queueNameWithTestId,
    };

    if (isFifo) {
      input!.Attributes!.FifoQueue = "true";
      input!.Attributes!.DeduplicationScope = "messageGroup";
    }

    const command = new CreateQueueCommand(input);
    const response = await getSqs().send(command);

    console.log(
      `Test queue has been created -- ${JSON.stringify(response.QueueUrl)}`
    );
  },

  deleteAllQueues: async () => {
    const testId = testDataStorage.getTestCaseId();
    const command = new ListQueuesCommand({});
    const { QueueUrls } = await getSqs().send(command);

    if (QueueUrls) {
      await Promise.all(
        QueueUrls.map(async (QueueUrl) => {
          if (QueueUrl.includes(testId)) {
            const command = new DeleteQueueCommand({ QueueUrl });
            await getSqs().send(command);
            console.log(`Queue ${QueueUrl} is deleted`);
          } else {
            return true;
          }
        })
      );
    }
  },

  createTestBatchMessagesInQueue: async (
    queueName: string,
    entries: SendMessageBatchRequestEntry[]
  ) => {
    const sendParams: SendMessageBatchRequest = {
      QueueUrl: `${process.env["QUEUE_DOMAIN"]}/${queueName}`,
      Entries: entries,
    };

    const command = new SendMessageBatchCommand(sendParams);
    try {
      console.log(JSON.stringify(sendParams));
      const response = await getSqs().send(command);
      console.log(
        `Test batch messages created: ${JSON.stringify(response.Successful)}`
      );
    } catch (err) {
      console.log(err);
    }
  },

  getListOfMessageBodyInQueue: async (queueName) => {
    let response = testDataStorage.getPolledQueueMsgs(queueName);
    if (response === undefined) {
      const command = new ReceiveMessageCommand({
        MaxNumberOfMessages: 10,
        QueueUrl: `${process.env["QUEUE_DOMAIN"]}/${queueName}`,
      });
      response = await getSqs().send(command);
      // after polling, messages will be gone and cannot be re-polled, so the polled message are stored in testDataStorage in case of later use
      testDataStorage.setPolledQueueMsgs(queueName, response);
    }

    if (!response?.Messages) {
      return [];
    }
    // remove all white space in json string
    return response.Messages.map(({ Body }) => Body);
  },

  waitForInFlightMessagesToBeVisible: () => {
    const waitingTime = (Number(visibilityTimeout) + 1) * 1000;
    return setTimeout(waitingTime);
  },
};
