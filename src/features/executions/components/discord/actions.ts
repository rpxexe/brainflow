// ex. /app/actions/get-subscribe-token.ts
"use server";

import { discordChannel } from "@/inngest/channels/discord";
import { inngest } from "@/inngest/client";
// See the "Typed channels (recommended)" section above for more details:

import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type DiscordChannelToken = Realtime.Token<typeof discordChannel, ["status"]>;

export async function fetchDiscordRealtimeToken(): Promise<DiscordChannelToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: discordChannel(),
    topics: ["status"],
  });

  return token;
}
