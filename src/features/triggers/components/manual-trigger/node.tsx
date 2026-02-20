import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode=memo((props:NodeProps)=>{
    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: MANUAL_TRIGGER_CHANNEL_NAME,
      topic: "status",
      refreshToken: fetchManualTriggerRealtimeToken,
  });
  
  // const nodeStatus="loading"
    const [dialogOpen,setDialogOpen]=useState(false)
    const handleOpenSetting=()=>setDialogOpen(true)
    return (
      <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        <BaseTriggerNode
          {...props}
          icon={MousePointerIcon}
          name="When clicking 'Execute Workflow'"
          status={nodeStatus}
          onSettings={handleOpenSetting}
          onDoubleClick={handleOpenSetting}
        />
      </>
    );
})