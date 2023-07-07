# @gurke/sqs

A collection of cucumber step definitions to help testing sqs configuration.

## Prerequisite

1. Using Jest as a test runner
2. Using Localstack as a AWS SQS emulator

## Features

Available step definitions:

```ts
given(/environment variables are set as follows:/);

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
import { sqsSteps, sqsCleanUp } from "@gurke/sqs";

const features = loadFeatures(/* Your feature file(s) */);

const steps = ({ when }) => {
  when(/amazing things happen/, async () => {
    // insert execution of your amazing event(s) / action(s)
  });
};

afterAll(async () => {
  await sqsCleanUp();
});

autoBindSteps(features, [sqsSteps, steps]);
```

With this setup, the available step definitions can be use in your feature file.
