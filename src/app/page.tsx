"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Counter from "./counter.json";

export default function Home() {
  const [count, setCount] = useState(0);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);

        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));

        const contractAddress = "0x3A2439A5876144546D1d22b487498Af2b7e6ced1";
        const contract = new ethers.Contract(
          contractAddress,
          Counter,
          provider.getSigner()
        );
        setContract(contract);
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    async function update() {
      const updatedCount = await contract?.showBalance();
      setCount(updatedCount?.toNumber());
    }
    update();
  }, [contract]);

  const handleIncrement = async () => {
    await contract?.deposit();
    const updatedCount = await contract?.showBalance();
    setCount(updatedCount?.toNumber());
  };

  const handleDecrement = async () => {
    await contract?.withdraw();
    const updatedCount = await contract?.showBalance();
    setCount(updatedCount?.toNumber());
  };

  const handleConnectWallet = async () => {
    await provider.send("eth_requestAccounts", []);
  };

  const handleDisconnectWallet = () => {
    // Disconnect the wallet (depends on the wallet's API)
  };

  return (
    <main>
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold">Counter App</h1>
        <p className="py-3">Balance: {count}</p>
        <p>Address: {address}</p>
        <p>ETH Balance: {balance} ETH</p>
        <button
          className="text-white mr-2 bg-blue-600 rounded-lg px-4 py-3"
          onClick={handleIncrement}
        >
          Increment
        </button>
        <button
          className="text-white bg-blue-600 rounded-lg px-4 py-3"
          onClick={handleDecrement}
        >
          Decrement
        </button>
        <button
          className="text-white bg-green-600 rounded-lg px-4 py-3 mt-4"
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </button>
        <button
          className="text-white bg-red-600 rounded-lg px-4 py-3 mt-4"
          onClick={handleDisconnectWallet}
        >
          Disconnect Wallet
        </button>
      </div>
    </main>
  );
}
