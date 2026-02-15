"use client"

import { memo } from "react"
import type { NodeProps } from "@xyflow/react"
import { PlaceholderNode } from "./react-flow/placeholder-node"
import { PlusIcon } from "lucide-react"
import { WorkflowNodes } from "./workflow-nodes"

export const InitialNode=memo((props:NodeProps)=>{
return (
  <WorkflowNodes showToolbar={false}>
    <PlaceholderNode {...props}>
      <div className="flex items-center justify-center cursor-pointer">
        <PlusIcon className="size-4" />
      </div>
    </PlaceholderNode>
  </WorkflowNodes>
);
})
InitialNode.displayName="InitialNode"