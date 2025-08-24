import { Routes, Route, Navigate } from "react-router-dom";
import  Signin  from "./pages/Signin";
import  Signup  from "./pages/Signup";
import { Transactions } from "./pages/Transactions";
import { BankerAccounts } from "./pages/BankerAccounts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/banker/accounts" element={<BankerAccounts />} />
    </Routes>
  );
}
