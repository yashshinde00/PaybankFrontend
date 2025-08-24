

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "default";
  loading?: boolean;
}

export const Button = ({ onClick, children, type = "button", disabled, fullWidth, variant = "default", loading }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: "8px 16px",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : undefined,
        backgroundColor: variant === "primary" ? "#4f46e5" : "#e5e7eb",
        color: variant === "primary" ? "white" : "black",
        border: "none",
        borderRadius: 4,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};
