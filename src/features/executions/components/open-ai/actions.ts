// ex. /app/actions/get-subscribe-token.ts
"use server";

import { inngest } from "@/inngest/client";
// See the "Typed channels (recommended)" section above for more details:

import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { openAiChannel } from "@/inngest/channels/open-ai";

export type OpenAiChannelToken = Realtime.Token<typeof openAiChannel, ["status"]>;

export async function fetchOpenAiRealtimeToken(): Promise<OpenAiChannelToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: openAiChannel(),
    topics: ["status"],
  });

  return token;
}
