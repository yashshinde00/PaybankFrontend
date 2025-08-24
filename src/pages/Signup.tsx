import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Backend_URL } from "../config";

export default function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const bankerIdRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<"Customer" | "Banker">("Customer");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const username = usernameRef.current?.value || "";
      const password = passwordRef.current?.value || "";
      const bankerId = bankerIdRef.current?.value || "";
      if (!username || !password) {
        setError("Username and Password required");
        return;
      }
      const body: {
        username: string;
        password: string;
        role: "Customer" | "Banker";
        bankerId?: string;
      } = { username, password, role };
      if (role === "Banker") body.bankerId = bankerId;
      await axios.post(Backend_URL + "/user/signup", body);
      setMsg("Signup successful. You can now sign in.");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response) {
        setError(e.response.data.message || "Error signing up");
      } else {
        setError("Error signing up");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4">
      <form
        onSubmit={signup}
        className="bg-white text-gray-500 max-w-[360px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-lg shadow-black/20"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        <label className="block mb-2 text-gray-700 font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "Customer" | "Banker")}
          className="w-full mb-5 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Customer">Customer</option>
          <option value="Banker">Banker</option>
        </select>

        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-2 pl-2">
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
            placeholder="Username"
            required
          />
        </div>

        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-2 pl-2">
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
            placeholder="Password"
            required
          />
        </div>

        {role === "Banker" && (
          <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-2 pl-2">
            <input
              ref={bankerIdRef}
              className="w-full outline-none bg-transparent py-2.5"
              type="text"
              placeholder="Banker ID"
            />
          </div>
        )}

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
        {msg && <p className="text-green-600 text-sm mt-4 text-center">{msg}</p>}

        <button
          type="submit"
          className="w-full mt-6 mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium"
        >
          Create Account
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 underline font-semibold">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
