import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_1px_1px_1px_rgba(24,25,37,0.08),0_0_0_0.5px_rgba(24,25,37,0.06)] hover:bg-primary/90",
        secondary:
          "border border-border bg-card text-secondary-foreground shadow-[0_1px_1px_rgba(24,25,37,0.06)] hover:bg-secondary",
        ghost: "text-secondary-foreground hover:bg-secondary hover:text-foreground",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
