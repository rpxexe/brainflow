import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import * as Sentry from "@sentry/nextjs";
const google = createGoogleGenerativeAI();
const openAi = createOpenAI();
const anthropic = createAnthropic();
export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    Sentry.logger.info("user triggered the test log", {
      log_source: "Sentry-test",
    });
    const { steps: googleSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );
    const { steps: openAiSteps } = await step.ai.wrap(
      "openAI-generate-text",
      generateText,
      {
        model: openAi("gpt-4"),
        system: "You are a helpful assistant",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );
    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-3-5-sonnet-20241022"),
        system: "You are a helpful assistant",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );
    return {
      googleSteps,
      openAiSteps,
      anthropicSteps,
    };
  },
);
