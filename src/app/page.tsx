"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Counter from "./counter.json";

export default function Home() {
  const [count, setCount] = useState(0);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  async function initialize() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setProvider(provider);

      const contractAddress = "0x33B7444c8FA9606788C6C7b4F100b46d097d4C32";

      const contract = new ethers.Contract(
        contractAddress,
        Counter,
        provider.getSigner()
      );
      setContract(contract);
    }
  }

  initialize();

  async function update() {
    const updatedCount = await contract?.getCount();
    setCount(updatedCount?.toNumber());
  }
  update();

  const handleIncrement = async () => {
    await contract?.increment();
    const updatedCount = await contract?.getCount();
    setCount(updatedCount?.toNumber());
  };

  const handleDecrement = async () => {
    await contract?.decrement();
    const updatedCount = await contract?.getCount();
    setCount(updatedCount?.toNumber());
  };
  return (
    <main>
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold"> Counter App</h1>
        <p className="py-3">Count: {count}</p>
        <button
          className="text-white mr-2 bg-blue-600 rounded-lg
         px-4 py-3"
          onClick={handleIncrement}
        >
          Increment
        </button>
        <button
          className="text-white bg-blue-600 rounded-lg
         px-4 py-3"
          onClick={handleDecrement}
        >
          Decrement
        </button>
      </div>
    </main>
  );
}
