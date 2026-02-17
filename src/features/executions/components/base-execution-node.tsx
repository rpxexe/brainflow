"use client";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { ReactNode, memo } from "react";
import { WorkflowNode } from "@/components/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { type NodeStatus,NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status:NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    status="initial",
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    
    const {setNodes,setEdges} =useReactFlow()
    const handleDelete = () => {
      setNodes((currentNodes)=>{
        const updatedNodes=currentNodes.filter((currentNode)=>currentNode.id!==id)
        return updatedNodes
      })
      setEdges((currentEdges)=>{
        const updatedEdges=currentEdges.filter((currentEdge)=>currentEdge.source!==id && currentEdge.target!==id)
        return updatedEdges
      })
    };
    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator
        status={status}
        variant="border"
        >
          <BaseNode status={status} onDoubleClick={onDoubleClick}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} width={16} height={16} alt={name} />
              ) : (
                <Icon className="size-4" />
              )}
              {children}
              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);
BaseExecutionNode.displayName = "BaseExecutionNode";
