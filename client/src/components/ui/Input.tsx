interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  className = "",
  ...props
}) => {
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
        className={`px-3 py-2 rounded-xl border border-[#E8EBE5] bg-[#FAFBF9] text-text 
        placeholder:text-[#9CADA0] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary ${className} ${
          icon ? "pl-9" : ""
        }`}
        {...props}
      />
    </div>
  );
};
