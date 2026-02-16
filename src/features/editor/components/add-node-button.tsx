import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

export const AddNodeButton=memo(()=>{
    const [selectorOpen,onSelectorOpen]=useState(false)
    return (
      <NodeSelector open={selectorOpen} onOpenChange={onSelectorOpen}>
        <Button
          className="bg-background"
          onClick={() => {}}
          size="icon"
          variant="outline"
        >
          <PlusIcon />
        </Button>
      </NodeSelector>
    );
})
AddNodeButton.displayName="AddNodeButton"