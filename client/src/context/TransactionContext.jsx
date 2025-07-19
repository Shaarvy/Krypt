import React, { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

// Create context
export const TransactionContext = createContext();

const getEthereumObject = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  } else {
    console.error("MetaMask not detected");
    return null;
  }
};

const createEthereumContract = async () => {
  const ethereum = getEthereumObject();
  if (!ethereum) return null;

  try {
    const provider = new ethers.BrowserProvider(ethereum); // Ethers v6
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  } catch (err) {
    console.error("Contract creation failed:", err);
    return null;
  }
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount") || 0);
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    const contract = await createEthereumContract();
    if (!contract) return;

    try {
      const rawTransactions = await contract.getAllTransactions();
      const structured = rawTransactions.map((tx) => ({
        addressTo: tx.receiver,
        addressFrom: tx.sender,
        timestamp: new Date(Number(tx.timestamp) * 1000).toLocaleString(),
        message: tx.message,
        keyword: tx.keyword,
        amount: Number(tx.amount) / 1e18,
      }));

      setTransactions(structured);
    } catch (err) {
      console.error("Fetching transactions failed:", err);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const ethereum = getEthereumObject();
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        await getAllTransactions();
      }
    } catch (err) {
      console.error("Wallet connection check failed:", err);
    }
  };

  const checkIfTransactionsExist = async () => {
    const contract = await createEthereumContract();
    if (!contract) return;

    try {
      const txCount = await contract.getTransactionCount();
      localStorage.setItem("transactionCount", txCount.toString());
    } catch (err) {
      console.error("Transaction count check failed:", err);
    }
  };

  const connectWallet = async () => {
    const ethereum = getEthereumObject();
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        window.location.reload();
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const sendTransaction = async () => {
    const ethereum = getEthereumObject();
    const contract = await createEthereumContract();
    if (!ethereum || !contract) return;

    try {
      const { addressTo, amount, keyword, message } = formData;
      const parsedAmount = ethers.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: "0x5208", // 21000 Gwei
          value: parsedAmount.toString(16), // hex string
        }],
      });

      const tx = await contract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      await tx.wait();
      setIsLoading(false);

      const txCount = await contract.getTransactionCount();
      setTransactionCount(Number(txCount));
      localStorage.setItem("transactionCount", txCount.toString());

      window.location.reload();
    } catch (err) {
      console.error("Sending transaction failed:", err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
