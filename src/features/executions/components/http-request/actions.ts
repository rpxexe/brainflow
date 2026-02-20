// ex. /app/actions/get-subscribe-token.ts
"use server";

import { inngest } from "@/inngest/client";
// See the "Typed channels (recommended)" section above for more details:

import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { httpRequestChannel } from "@/inngest/channels/http-request";

export type HttpRequestChannelToken = Realtime.Token<typeof httpRequestChannel, ["status"]>;

export async function fetchHttpRealtimeToken(): Promise<HttpRequestChannelToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ["status"],
  });

  return token;
}
