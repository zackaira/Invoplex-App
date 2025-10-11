import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative min-w-0 rounded-[calc(var(--radius)-2px)] shadow-sm shadow-black/5",
        "has-[data-slot=input-group-control]:focus-within:outline has-[data-slot=input-group-control]:focus-within:outline-2 has-[data-slot=input-group-control]:focus-within:-outline-offset-1 has-[data-slot=input-group-control]:focus-within:outline-ring/70",
        className
      )}
      {...props}
    />
  );
});
InputGroup.displayName = "InputGroup";

const inputGroupAddonVariants = cva(
  "pointer-events-none absolute z-10 flex items-center gap-1.5 px-3 text-muted-foreground [&>svg]:size-4",
  {
    variants: {
      align: {
        "inline-start": "inset-y-0 start-0",
        "inline-end": "inset-y-0 end-0",
        "block-start": "inset-x-0 top-0 px-3 py-2.5",
        "block-end": "inset-x-0 bottom-0 px-3 py-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof inputGroupAddonVariants>
>(({ className, align, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        inputGroupAddonVariants({ align }),
        "[&>*]:pointer-events-auto",
        className
      )}
      {...props}
    />
  );
});
InputGroupAddon.displayName = "InputGroupAddon";

const inputGroupButtonVariants = cva(
  "h-auto shrink-0 rounded-[calc(var(--radius)-4px)] px-2 py-1 text-xs",
  {
    variants: {
      size: {
        xs: "h-auto px-2 py-1 text-xs",
        "icon-xs": "size-6 p-0",
        sm: "h-7 px-2.5 text-xs",
        "icon-sm": "size-7 p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentProps<typeof Button>, "size"> &
    VariantProps<typeof inputGroupButtonVariants>
>(({ className, size, variant = "ghost", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={
        size === "xs" || size === "icon-xs"
          ? "sm"
          : size === "sm" || size === "icon-sm"
          ? "sm"
          : "sm"
      }
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
});
InputGroupButton.displayName = "InputGroupButton";

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    asChild?: boolean;
  }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      ref={ref}
      className={cn("select-none text-sm", className)}
      {...props}
    />
  );
});
InputGroupText.displayName = "InputGroupText";

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-slot="input-group-control"
      className={cn(
        "shadow-none outline-none",
        "peer-has-[[data-slot=input-group-control]]:shadow-none peer-has-[[data-slot=input-group-control]]:outline-none",
        className
      )}
      {...props}
    />
  );
});
InputGroupInput.displayName = "InputGroupInput";

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      data-slot="input-group-control"
      className={cn("shadow-none outline-none", className)}
      {...props}
    />
  );
});
InputGroupTextarea.displayName = "InputGroupTextarea";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
