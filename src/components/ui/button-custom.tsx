
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonCustomProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonCustomProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    children, 
    icon,
    iconPosition = "right",
    ...props 
  }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-200",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200",
      outline: "border border-primary text-primary hover:bg-primary/5 transition-colors duration-200",
      ghost: "text-primary hover:bg-primary/5 transition-colors duration-200",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-11 px-6 text-lg",
    };

    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="inline-flex items-center">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="inline-flex items-center">{icon}</span>
        )}
        <span className="absolute inset-0 rounded-md overflow-hidden shine-effect" aria-hidden="true"></span>
      </button>
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom };
