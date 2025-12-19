type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const baseStyles =
  "px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:opacity-90 focus:ring-primary",
  secondary:
    "bg-secondary text-background hover:opacity-90 focus:ring-secondary",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-background focus:ring-primary",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
