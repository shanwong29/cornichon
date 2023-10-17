# @gurke/sqs

A collection of cucumber step definitions to help testing sqs configuration.

## Prerequisite

1. Using Jest as a test runner
2. Using [jest-cucumber library](https://www.npmjs.com/package/jest-cucumber) for cucumber setup

## Features

Available step definitions:

```ts
given(/a (fifo|standard) queue with queue name variable "(.*)" exists/);

given(
  /the following batch of queue messages has been sent to queue with queue name variable "(.*)":/
);

then(/queue with variable name "(.*)" should have "(.*)" (message|messages)/);

then(
  /queue with variable name "(.*)" should have message with following message Body:/
);
```

## Example usage

```ts
import { autoBindSteps, loadFeatures } from "jest-cucumber";
import {
  sqsSteps,
  sqsCleanUp,
  waitForInFlightMessagesToBeVisible,
} from "@gurke/sqs";

const features = loadFeatures(/* Your feature file(s) */);

const steps = ({ when }) => {
  when(/amazing things happen/, async () => {
    // insert execution of your amazing event(s) / action(s)

    // remember to wait for the message to be visible in the last step of your when scenario
    await waitForInFlightMessagesToBeVisible();
  });
};

afterEach(async () => {
  await sqsCleanUp();
});

autoBindSteps(features, [sqsSteps, steps]);
```

With this setup, the available step definitions can be use in your feature file.

## Default environment variables

The default value of the environment variables for AWS in this library are:
|Variable Name|Value|
| -------- | ---- |
|AWS_REGION|eu-central-1|
|TEST_SQS_ENDPOINT|http://eu-central-1.queue.localhost.localstack.cloud:4566|
|TEST_AWS_ACCESS_KEY_ID|test|
|TEST_AWS_SECRET_ACCESS_KEY|test|

If you need to pass a different value, you can configure it by overwriting it.
