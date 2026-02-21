// ex. /app/actions/get-subscribe-token.ts
"use server";


import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { inngest } from "@/inngest/client";
// See the "Typed channels (recommended)" section above for more details:

import { getSubscriptionToken, Realtime } from "@inngest/realtime";


export type StripeTriggerChannelToken = Realtime.Token<
  typeof stripeTriggerChannel,
  ["status"]
>;

export async function fetchStripeTriggerRealtimeToken(): Promise<StripeTriggerChannelToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: stripeTriggerChannel(),
    topics: ["status"],
  });

  return token;
}
