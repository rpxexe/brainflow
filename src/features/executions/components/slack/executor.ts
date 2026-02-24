import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
import { decode } from "html-entities";
import ky from "ky";
Handlebars.registerHelper("json", (context) => {
  const jsonStringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonStringified);
  return safeString;
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
}
export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
  slackChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  if (!data.content) {
    await publish(
    slackChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Slack node:content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
        slackChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("slack node: webhook url is missing");
      }
      
      await ky.post(data.webhookUrl!, {
        json: {
          content: content
      
        },
      });
       if (!data.variableName) {
         await publish(
          slackChannel().status({
             nodeId,
             status: "error",
           }),
         );
         throw new NonRetriableError("slack node: Variable Name is missing");
       }
       return {
         ...context,
         [data.variableName]: {
           content: content.slice(0, 2000),
           
         },
       };
    });
    await publish(
    slackChannel().status({
        nodeId,
        status: "success",
      }),
    );
    return result
  } catch (error) {
    await publish(
    slackChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
