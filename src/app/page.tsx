// Assuming "use client" is an import statement, I'll leave it as is.
"use client";
import { useState, useEffect, FC } from "react";
import { ethers } from "ethers";
import Counter from "./counter.json";
import Header from "@/components/Header";

const Page: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [contract, setContract] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | number>(0);

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
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
      setCount(updatedCount?.toNumber() || 0);
    }
    update();
  }, [contract]);

  const handleIncrement = async () => {
    await contract?.deposit();
    const updatedCount = await contract?.showBalance();
    setCount(updatedCount?.toNumber() || 0);
  };

  const handleDecrement = async () => {
    await contract?.withdraw();
    const updatedCount = await contract?.showBalance();
    setCount(updatedCount?.toNumber() || 0);
  };

  return (
    <main>
      <Header />
      <div className="py-40 text-center">
        <h1 className="text-3xl font-bold">Counter App</h1>
        <p className="py-3">Balance: {count}</p>
        <p className="pt-5">Address: {address}</p>
        <p>ETH Balance: {balance} ETH</p>
        <button
          className="text-white mr-2 bg-blue-600 rounded-lg mt-5 px-4 py-3"
          onClick={handleIncrement}
        >
          Increment
        </button>
        <button
          className="text-white bg-blue-600 rounded-lg px-4 py-3 mt-5"
          onClick={handleDecrement}
        >
          Decrement
        </button>
      </div>
    </main>
  );
};

export default Page;
