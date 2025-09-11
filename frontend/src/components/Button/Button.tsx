interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const baseClasses =
    "border rounded-lg";

  return (
    <button
      className={`${baseClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
