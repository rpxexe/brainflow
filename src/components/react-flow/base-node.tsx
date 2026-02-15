import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Render a styled container used as the base node for React Flow node content.
 *
 * The element is focusable (tabIndex=0) and applies a visual selected state when placed
 * inside React Flow's node wrapper that receives the `selected` class.
 *
 * @returns A div element that serves as the styled base node container
 */
export function BaseNode({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative rounded-md border",
        "hover:ring-1",
        // React Flow displays node elements inside of a `NodeWrapper` component,
        // which compiles down to a div with the class `react-flow__node`.
        // When a node is selected, the class `selected` is added to the
        // `react-flow__node` element. This allows us to style the node when it
        // is selected, using Tailwind's `&` selector.
        "[.react-flow\\_\\_node.selected_&]:border-muted-foreground",
        "[.react-flow\\_\\_node.selected_&]:shadow-lg",
        className,
      )}
      tabIndex={0}
      {...props}
    />
  );
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        // Remove or modify these classes if you modify the padding in the
        // `<BaseNode />` component.
        className,
      )}
    />
  );
}

/**
 * Render an h3 element used as the node title.
 *
 * The element is marked with `data-slot="base-node-title"`, prevents text selection,
 * and merges any provided `className` into its classes.
 *
 * @returns The configured `h3` element to use as the node's title.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("user-select-none flex-1 font-semibold", className)}
      {...props}
    />
  );
}

/**
 * Container for a node's content area that provides consistent layout and a slot target.
 *
 * Renders a div with a `data-slot="base-node-content"` attribute and default column layout spacing; intended for placement inside `BaseNode`.
 *
 * @returns A div element styled as the node content area and marked for slot-based composition.
 */
export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-2 p-3", className)}
      {...props}
    />
  );
}

/**
 * Render the footer container for a BaseNode, exposed via the `data-slot="base-node-footer"` attribute.
 *
 * @param className - Additional class names to append to the footer's default layout and spacing classes
 * @returns A div element used as the node footer, with default footer layout/styling and any provided class names applied
 */
export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
        className,
      )}
      {...props}
    />
  );
}