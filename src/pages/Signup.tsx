import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Backend_URL } from "../config";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    bankerId: "",
    role: "Customer" as "Customer" | "Banker",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.username || !form.password) {
      setError("Username and Password required");
      return;
    }

    try {
      const body = {
        username: form.username,
        password: form.password,
        role: form.role,
        ...(form.role === "Banker" && { bankerId: form.bankerId }),
      };

      await axios.post(Backend_URL + "/user/signup", body);
      setMsg("Signup successful. You can now sign in.");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error signing up");
      } else {
        setError("Error signing up");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4">
      <form
        onSubmit={signup}
        className="bg-white text-gray-500 max-w-[360px] w-full p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        <label className="block mb-2 text-gray-700 font-medium">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-5 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Customer">Customer</option>
          <option value="Banker">Banker</option>
        </select>

        <div className="flex items-center my-2 border bg-indigo-500/5 rounded gap-2 pl-2">
          <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
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
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full outline-none bg-transparent py-2.5"
            type="text"
            placeholder="Username"
            required
          />
        </div>

        <div className="flex items-center my-2 border bg-indigo-500/5 rounded gap-2 pl-2">
          <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full outline-none bg-transparent py-2.5"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        {form.role === "Banker" && (
          <div className="flex items-center my-2 border bg-indigo-500/5 rounded gap-2 pl-2">
            <input
              name="bankerId"
              value={form.bankerId}
              onChange={handleChange}
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
          className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 transition-all py-2.5 rounded text-white font-medium"
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
