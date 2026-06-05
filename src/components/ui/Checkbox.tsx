import React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, label, className = "", disabled, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div className="w-5 h-5 border border-border bg-background transition-all duration-100 flex items-center justify-center peer-checked:bg-success peer-checked:border-success peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
            <svg
              className={`w-3.5 h-3.5 text-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
