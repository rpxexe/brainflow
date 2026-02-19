import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from "ky";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  //TODO Publish  "Loading" state
    if (!data.endpoint) {
      //TODO :publish "error state"
    throw new NonRetriableError("HTTP request node: No Endpoint configured");
    }
    if (!data.variableName) {
      //TODO :publish "error state"
      throw new NonRetriableError(
        "HTTP request node: Variable Name not Configured",
      );
    }
  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";
    const options: kyOptions = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
          : await response.text();
      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };
      if (data.variableName) {
          return {
              ...context,
              [data.variableName]:responsePayload
        }
    }

      //Fallback to direct  httpresponse for backward compatibility
    return {
      ...context,
      ...responsePayload
    };
  });
  //TODO Publish "Success" State
  return result;
};
