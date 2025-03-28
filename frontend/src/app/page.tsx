"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, useContractRead } from "wagmi";
import { useState, useEffect, useRef } from "react";

const ETH_FLASH_ADDRESS = "0xfD49f5225eEee29fCd3f829D0F96e53F9eC4B486";
const USDT_FLASH_ADDRESS = "0xAf1C67c5c1C4B662C809df67c0071C22def31502";

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState("ETH");
  const pollingInterval = useRef<NodeJS.Timeout>();

  const { write: mintEthFlash } = useContractWrite({
    address: ETH_FLASH_ADDRESS,
    abi: ABI,
    functionName: "mint",
  });

  const { write: mintUsdtFlash } = useContractWrite({
    address: USDT_FLASH_ADDRESS,
    abi: ABI,
    functionName: "mint",
  });

  const {
    data: ethBalance,
    refetch: refetchEthBalance,
    error: ethError,
  } = useContractRead({
    address: ETH_FLASH_ADDRESS,
    abi: ABI,
    functionName: "balanceOf",
    args: [address],
    enabled: isConnected,
  });

  const {
    data: usdtBalance,
    refetch: refetchUsdtBalance,
    error: usdtError,
  } = useContractRead({
    address: USDT_FLASH_ADDRESS,
    abi: ABI,
    functionName: "balanceOf",
    args: [address],
    enabled: isConnected,
  });

  useEffect(() => {
    if (isConnected) {
      // Start polling
      pollingInterval.current = setInterval(() => {
        refetchEthBalance();
        refetchUsdtBalance();
      }, 2000); // Poll every 2 seconds

      // Cleanup function
      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }
  }, [isConnected, refetchEthBalance, refetchUsdtBalance]);

  const handleMint = () => {
    const amount = selectedToken === "ETH" ? 1000000000000000000n : 1000000n; // 1 ETH or 1 USDT
    if (selectedToken === "ETH") {
      mintEthFlash({ args: [address, amount] });
    } else {
      mintUsdtFlash({ args: [address, amount] });
    }
  };

  const addToMetaMask = async (
    tokenAddress: string,
    symbol: string,
    decimals: number
  ) => {
    if (typeof window === "undefined") return;

    try {
      if (typeof window !== "undefined" && window.ethereum) {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: symbol,
              decimals: decimals,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error adding token to MetaMask:", error);
    }
  };

  const formattedEthBalance = ethError
    ? 0
    : ethBalance
    ? Number(ethBalance) / 1e18
    : 0;
  const formattedUsdtBalance = usdtError
    ? 0
    : usdtBalance
    ? Number(usdtBalance) / 1e6
    : 0;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">FlashCoin</h1>
          <ConnectButton />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is FlashCoin?</h2>
          <p className="text-gray-600 mb-4">
            FlashCoin is an innovative ERC20 token that appears in your wallet
            for a brief moment (20 seconds) after minting and then disappears.
            It's available in two variants: FlashETH (FETH) and FlashUSDT
            (FUSDT).
          </p>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              ⚡ Perfect for testing and demonstrations
              <br />
              🕒 Tokens disappear after 20 seconds
              <br />
              🔄 Available in ETH and USDT variants
            </p>
          </div>
        </div>

        {isConnected && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {typeof window === "undefined"
                ? "Add to MetaMask"
                : "Mint FlashCoin"}
            </h2>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setSelectedToken("ETH")}
                className={`px-4 py-2 rounded ${
                  selectedToken === "ETH"
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                FlashETH
              </button>
              <button
                onClick={() => setSelectedToken("USDT")}
                className={`px-4 py-2 rounded ${
                  selectedToken === "USDT"
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                FlashUSDT
              </button>
            </div>
            <button
              onClick={handleMint}
              className="bg-secondary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Mint 1 {selectedToken === "ETH" ? "FlashETH" : "FlashUSDT"}
            </button>
            <div className="mt-4 text-sm text-gray-600">
              Current Balance:
              <br />
              FlashETH:{" "}
              {formattedEthBalance === 0
                ? "0"
                : formattedEthBalance.toFixed(18)}
              <br />
              FlashUSDT:{" "}
              {formattedUsdtBalance === 0
                ? "0"
                : formattedUsdtBalance.toFixed(6)}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Add to MetaMask</h2>
          <div className="space-y-4">
            <button
              onClick={() => addToMetaMask(ETH_FLASH_ADDRESS, "FETH", 18)}
              className="w-full bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Add FlashETH to MetaMask
            </button>
            <button
              onClick={() => addToMetaMask(USDT_FLASH_ADDRESS, "FUSDT", 6)}
              className="w-full bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Add FlashUSDT to MetaMask
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
