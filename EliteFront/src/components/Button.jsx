/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUpRight } from "lucide-react";

export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: "bg-brand-accent text-white shadow-lg shadow-brand-accent/20 hover:scale-105",
    secondary: "bg-white border border-brand-border text-brand-dark hover:bg-brand-surface card-shadow",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
    ghost: "text-brand-dark/60 hover:text-brand-primary",
    dark: "bg-brand-dark text-white hover:bg-brand-dark/90"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-lg",
    lg: "px-10 py-5 text-xl"
  };

  return (
    <button 
      className={`
        group inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      {...props}
    >
      {children}
      {Icon && <Icon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
    </button>
  );
};
