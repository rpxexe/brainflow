import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities";
import ky from "ky";
Handlebars.registerHelper("json", (context) => {
  const jsonStringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringified);
  return safeString;
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  username?: string;
  content?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Discord node:content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("Discord node: webhook url is missing");
      }
      
      await ky.post(data.webhookUrl!, {
        json: {
          content: content.slice(0, 2000), //Discord max message length
          username,
        },
      });
       if (!data.variableName) {
         await publish(
           discordChannel().status({
             nodeId,
             status: "error",
           }),
         );
         throw new NonRetriableError("Discord node: Variable Name is missing");
       }
       return {
         ...context,
         [data.variableName]: {
           content: content.slice(0, 2000),
           username,
         },
       };
    });
    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      }),
    );
    return result
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
