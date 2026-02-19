import { NodeExecutor } from "@/features/executions/types"

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
    nodeId,
    context,
    step,
}) => {
    //TODO Publish  "Loading" state 
    const result = await step.run("manual-trigger", async () => context)
    //TODO Publish "Success" State
    return result
}