"use client"
import { type NodeProps,Position } from "@xyflow/react"
import type { LucideIcon } from "lucide-react"
import { ReactNode,memo } from "react";
import { WorkflowNode } from "@/components/workflow-nodes";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseExecutionNodeProps extends NodeProps{
    icon:LucideIcon | string;
    name:string;
    description?:string;
    children?:ReactNode;
    // status:NodeStatus;
    onSettings?:()=>void;
    onDoubleClick?:()=>void;
}

export const BaseExecutionNode=memo(({
id,
icon:Icon,
name,
description,
children,
onSettings,
onDoubleClick
}:BaseExecutionNodeProps)=>{

    const handleDelete=()=>{}
return (
  <WorkflowNode
    name={name}
    description={description}
    onSettings={onSettings}
    onDelete={handleDelete}
  >
    <BaseNode onDoubleClick={onDoubleClick}>
      <BaseNodeContent>
        {typeof Icon === "string" ? (
          <Image src={Icon} width={16} height={16} alt={name} />
        ) : (
          <Icon className="size-4" />
        )}
        {children}
        <BaseHandle id="target-1" type="target" position={Position.Left} />
        <BaseHandle id="source-1" type="source" position={Position.Right} />
      </BaseNodeContent>
    </BaseNode>
  </WorkflowNode>
);
})
BaseExecutionNode.displayName="BaseExecutionNode" 