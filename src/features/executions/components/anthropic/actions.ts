// ex. /app/actions/get-subscribe-token.ts
"use server";

import { inngest } from "@/inngest/client";
// See the "Typed channels (recommended)" section above for more details:

import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { anthropicChannel } from "@/inngest/channels/anthropic";

export type AnthropicChannelToken = Realtime.Token<typeof anthropicChannel, ["status"]>;

export async function fetchAnthropicRealtimeToken(): Promise<AnthropicChannelToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: anthropicChannel(),
    topics: ["status"],
  });

  return token;
}
