import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI} from "@ai-sdk/openai";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { openAiChannel } from "@/inngest/channels/open-ai";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
  const jsonStringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringified);
  return safeString;
});


type OpenAiData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    openAiChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  if (!data.variableName) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenAI node: Variable Name is missing");
  }
  if (!data.credentialId) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenAI node: Credential is missing");
  }
  if (!data.userPrompt) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenAI node: User Prompt is missing");
  }
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);
const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id:data.credentialId
      }
    })
  })
  if (!credential) {
    throw new NonRetriableError("Open AI node: Credential is not found")
  }
  const openai = createOpenAI({
    apiKey: credential.value,
  });
  try {
    const { steps } = await step.ai.wrap(
      "openai-generative-text",
      generateText,
      {
        model: openai(data.model || "gpt-5-mini"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );
    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      openAiChannel().status({
        nodeId,
        status: "success",
      }),
    );
    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
