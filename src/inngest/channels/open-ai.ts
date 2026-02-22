import { channel, topic } from "@inngest/realtime"

export const OPEN_AI_CHANNEL_NAME = "open-ai-execution";
export const openAiChannel = channel(OPEN_AI_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);