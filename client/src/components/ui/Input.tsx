import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  forgotPasswordLink?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  type,
  forgotPasswordLink,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-text">{label}</label>
      )}

      {icon && (
        <div className="absolute left-3 top-12 -translate-y-1/2 text-text/70">
          {icon}
        </div>
      )}

      <input
        type={isPassword && showPassword ? "text" : type}
        className={`
          px-3 py-2 rounded-xl border border-[#E8EBE5] bg-[#FAFBF9] text-text
          placeholder:text-[#9CADA0] placeholder:text-sm
          focus:outline-none focus:ring-2 focus:ring-primary
          ${icon ? "pl-9" : ""}
          ${isPassword ? "pr-10" : ""}
          ${className}
        `}
        {...props}
      />

      {forgotPasswordLink && (
        <Link
          to="/forgot-password"
          className="text-xs underline text-text-light hover:text-text mt-2 mb-6 block text-right"
        >
          Forgot Password?
        </Link>
      )}

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-12 -translate-y-1/2 text-text/70 hover:text-text cursor-pointer transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};
