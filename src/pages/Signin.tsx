import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Backend_URL } from "../config";

export default function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function signin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const username = usernameRef.current?.value || "";
      const password = passwordRef.current?.value || "";
      if (!username || !password) {
        setError("Username and Password required");
        return;
      }
      const body = { username, password };
      const response = await axios.post<{
        accessToken: string;
        role: "Customer" | "Banker";
        bankerId?: string;
      }>(Backend_URL + "/user/signin", body);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("role", response.data.role);
      if (response.data.bankerId) localStorage.setItem("bankerId", response.data.bankerId);
      if (response.data.role === "Banker") {
        navigate("/banker/accounts");
      } else {
        navigate("/transactions");
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response) {
        setError(e.response.data.message || "Signin failed");
      } else {
        setError("Signin failed");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4">
      <form
        onSubmit={signin}
        className="bg-white text-gray-500 max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-bold mb-9 text-center text-gray-800">Sign In</h2>
        <p>signup end Point has bugs need to befixed for now use give credentials</p>

        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            ref={usernameRef}
            className="w-full outline-none bg-transparent py-2.5"
            type="text"
            placeholder="Megha for customer && dev for Banker"
            required
          />
        </div>

        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={passwordRef}
            className="w-full outline-none bg-transparent py-2.5"
            type="password"
            placeholder="customer{`secret123`} && {`123456`} for Banker"
            required
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium mt-6"
        >
          Sign In
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline font-semibold">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
