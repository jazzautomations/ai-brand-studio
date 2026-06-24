import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "link";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
  outline: "border border-border bg-transparent hover:bg-secondary text-foreground",
  ghost: "hover:bg-secondary text-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-md",
  md: "h-11 px-5 text-sm rounded-lg",
  lg: "h-13 px-7 text-base rounded-xl",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
