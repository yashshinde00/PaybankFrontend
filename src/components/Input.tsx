import { ForwardedRef } from "react";

interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  reference?: ForwardedRef<HTMLInputElement>;
}

export const Input = ({ label, placeholder, type = "text", reference }: InputProps) => {
  return (
    <div style={{ margin: "8px 0" }}>
      <label>{label}</label><br />
      <input placeholder={placeholder} type={type} ref={reference} className="px-4 py-2 border rounded m-2 h-12  w-full" />
    </div>
  );
};
