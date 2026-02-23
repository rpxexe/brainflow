"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenAiFormValues, AVAILABLE_MODELS, OpenAiDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAiRealtimeToken } from "./actions";
import { OPEN_AI_CHANNEL_NAME } from "@/inngest/channels/open-ai";

type OpenAiNodeData = {
  variableName?: string;
  credentialId?:string,
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};
type OpenAiNodeType = Node<OpenAiNodeData>;
export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const handleSubmit = (values: OpenAiFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OPEN_AI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAiRealtimeToken,
  });

  // const status="loading"
  const handelDialogSettings = () => {
    setDialogOpen(true);
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData?.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <OpenAiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/openai.svg"
        name="ChatGPT"
        description={description}
        status={nodeStatus}
        onSettings={handelDialogSettings}
        onDoubleClick={handelDialogSettings}
      />
    </>
  );
});

OpenAiNode.displayName = "OpenAiNode";
