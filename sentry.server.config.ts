// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8dbde0444e3970c723e2b6d640ce8942@o4510871806869504.ingest.us.sentry.io/4510873098190848",

  integrations:[
    Sentry.vercelAIIntegration({
      recordInputs:true,
      recordOutputs:true
    }),
    Sentry.consoleLoggingIntegration({levels:["log","warn","error"]}),
  ],
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
