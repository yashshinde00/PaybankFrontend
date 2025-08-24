import { useEffect, useState, useRef } from "react";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import axios from "axios";
import { Backend_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: number;
  deposits: number;
  withdrawals: number;
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<"deposit" | "withdraw">("deposit");
  const amountRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchTransactions() {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await axios.get<Transaction[]>(`${Backend_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch {
      // no-op
    }
  }

  async function fetchBalance() {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await axios.get<{ balance: number }>(`${Backend_URL}/transactions/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  async function handleTransaction() {
    setError("");
    const amount = Number(amountRef.current?.value || "");
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (type === "withdraw" && amount > balance) {
      setError("Insufficient Funds");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken") || "";
      await axios.post(
        `${Backend_URL}/transactions`,
        { type, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      if (amountRef.current) amountRef.current.value = "";
      fetchTransactions();
      fetchBalance();
    } catch {
      setError("Transaction failed");
    }
  }

  
  function handleLogout() {
    localStorage.clear();
    navigate("/signin");
  }

  return (
  <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
    <div className="bg-white rounded-lg shadow-md max-w-xl w-full p-6 flex flex-col">
      <h2 className="text-2xl mb-3">Transactions</h2>
      <p className="mb-4 font-semibold">Balance: ₹{balance.toFixed(2)}</p>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => { setType("deposit"); setShowModal(true); }} variant="primary">
          Deposit
        </Button>
        <Button onClick={() => { setType("withdraw"); setShowModal(true); }} variant="primary">
          Withdraw
        </Button>
      </div>
      <ul className="mb-6">
        {transactions.map(tx => (
          <li key={tx.id} className="mb-1">
            {tx.deposits > 0 ? `Deposit: ₹${tx.deposits}` : `Withdrawal: ₹${tx.withdrawals}`}
          </li>
        ))}
      </ul>
      {showModal && (
        <Modal title={type === "deposit" ? "Deposit" : "Withdraw"} onClose={() => setShowModal(false)}>
          <Input label="Amount" type="number" reference={amountRef} placeholder="Enter amount" />
          {error && <p className="text-red-600">{error}</p>}
          <Button onClick={handleTransaction} variant="primary">
            Submit
          </Button>
        </Modal>
      )}
      <div className="mt-auto flex justify-end">
        <Button onClick={handleLogout} variant="default" fullWidth={false}>
          Logout
        </Button>
      </div>
    </div>
  </div>
);

}
