import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-24 w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#999999] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
