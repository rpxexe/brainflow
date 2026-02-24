// ex. /app/actions/get-subscribe-token.ts
"use server";

import { slackChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
// See the "Typed channels (recommended)" section above for more details:

import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type SlackChannelToken = Realtime.Token<typeof slackChannel, ["status"]>;

export async function fetchSlackRealtimeToken(): Promise<SlackChannelToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: slackChannel(),
    topics: ["status"],
  });

  return token;
}
