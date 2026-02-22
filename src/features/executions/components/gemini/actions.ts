// ex. /app/actions/get-subscribe-token.ts
"use server";

import { inngest } from "@/inngest/client";
// See the "Typed channels (recommended)" section above for more details:

import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { geminiChannel } from "@/inngest/channels/gemini";

export type GeminiChannelToken = Realtime.Token<typeof geminiChannel, ["status"]>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiChannelToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: geminiChannel(),
    topics: ["status"],
  });

  return token;
}
