import { useEffect, useState } from "react";
import axios from "axios";
import { Backend_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: number;
  username: string;
}

interface Transaction {
  id: number;
  deposits: number;
  withdrawals: number;
}

export function BankerAccounts() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  async function fetchCustomers() {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await axios.get<Customer[]>(`${Backend_URL}/banker/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch {
      // no-op
    }
  }

  async function fetchTransactions(customerId: number) {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await axios.get<Transaction[]>(
        `${Backend_URL}/banker/customers/${customerId}/transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(res.data);
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function handleCustomerClick(customer: Customer) {
    setSelectedCustomer(customer);
    fetchTransactions(customer.id);
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/signin");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full flex flex-col p-0 relative">
        <div className="flex w-full flex-1">
          {/* Customers List */}
          <div className="w-1/3 border-r border-gray-300 p-6 overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-semibold mb-4 text-center">Customers</h2>
            <ul className="list-disc list-inside space-y-2">
              {customers.map((customer) => (
                <li
                  key={customer.id}
                  onMouseEnter={() => handleCustomerClick(customer)}
                  className={`cursor-pointer p-2 rounded ${
                    selectedCustomer?.id === customer.id ? "bg-blue-100 font-semibold" : "hover:bg-blue-50"
                  }`}
                >
                  {customer.username}
                </li>
              ))}
            </ul>
          </div>

          {/* Transaction History */}
          <div className="w-2/3 p-6 overflow-y-auto max-h-[70vh]">
            <h2 className="text-xl font-semibold mb-4 text-center">Transaction History</h2>
            {selectedCustomer ? (
              transactions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {transactions.map((tx) => (
                    <li key={tx.id}>
                      {tx.deposits > 0
                        ? `Deposit: ₹${tx.deposits}`
                        : `Withdrawal: ₹${tx.withdrawals}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No transactions found.</p>
              )
            ) : (
              <p className="text-gray-500 text-center">
                Hover over a customer to view transactions
              </p>
            )}
          </div>
        </div>
        {/* Logout Button */}
        <div className="flex justify-end p-4 pt-0">
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-red-400 text-gray-700 hover:text-white font-semibold py-2 px-6 rounded focus:outline-none transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
