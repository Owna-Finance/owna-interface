import Image from "next/image";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { CONTRACTS } from "@/constants/contracts/contracts";
import { formatUnits } from "viem";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TokenHolding {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  address: string;
  logoPath: string;
}

interface TokenHoldingsTableProps {
  title: string;
  subtitle: string;
}

export function YRTHoldingsTable({ title, subtitle }: TokenHoldingsTableProps) {
  const { address } = useAccount();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (addressToCopy: string) => {
    try {
      await navigator.clipboard.writeText(addressToCopy);
      setCopiedAddress(addressToCopy);
      toast.success("Address copied to clipboard!", {
        style: {
          background: "#111111",
          border: "1px solid #2A2A2A",
          color: "#ffffff",
        },
        duration: 2000,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      toast.error("Failed to copy address", {
        style: {
          background: "#111111",
          border: "1px solid #2A2A2A",
          color: "#ffffff",
        },
      });
    }
  };

  // Read YRT-SUDIRMAN balance
  const { data: yrtBalance } = useReadContract({
    address: "0x4e0f63A8a31156DE5d232F47AD7aAFd2C9014991" as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read YRT-SUDIRMAN name
  const { data: yrtName } = useReadContract({
    address: "0x4e0f63A8a31156DE5d232F47AD7aAFd2C9014991" as `0x${string}`,
    abi: erc20Abi,
    functionName: "name",
  });

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: CONTRACTS.USDC as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read IDRX balance
  const { data: idrxBalance } = useReadContract({
    address: CONTRACTS.IDRX as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const formatTokenAmount = (
    balance: bigint | undefined,
    decimals: number = 18
  ) => {
    if (!balance) return "0";
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    const finalNum =
      num % 1 === 0 ? num : parseFloat(num.toFixed(6).replace(/\.?0+$/, ""));
    return finalNum.toLocaleString("en-US", { maximumFractionDigits: 6 });
  };

  const tokenHoldings: TokenHolding[] = [
    {
      symbol: "YRT-SUDIRMAN",
      name: yrtName || "YRT-SUDIRMAN",
      balance: formatTokenAmount(yrtBalance),
      value: "$0.00", // Mock value for now
      address: "0x4e0f63A8a31156DE5d232F47AD7aAFd2C9014991",
      logoPath: "/Images/Logo/logo_YRT.jpg",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: formatTokenAmount(usdcBalance, 18),
      value: "$0.00", // Mock value for now
      address: CONTRACTS.USDC,
      logoPath: "/Images/Logo/usdc-logo.png",
    },
    {
      symbol: "IDRX",
      name: "Indonesian Rupiah Token",
      balance: formatTokenAmount(idrxBalance, 18),
      value: "$0.00", // Mock value for now
      address: CONTRACTS.IDRX,
      logoPath: "/Images/Logo/idrx-logo.svg",
    },
  ].filter((holding) => parseFloat(holding.balance) > 0);

  const totalValue = tokenHoldings.reduce(
    (sum, holding) =>
      sum + parseFloat(holding.value.replace("$", "").replace(",", "")),
    0
  );
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300 font-medium">
              {subtitle}
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Total Value: ${totalValue.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div>Token</div>
          <div className="text-right">Balance</div>
          <div className="text-right">Value</div>
          <div className="text-right">Address</div>
        </div>
        <div className="space-y-1">
          {tokenHoldings.map((holding, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 p-4 hover:bg-[#111111]/50 transition-colors rounded-lg border-b border-white/5 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center p-1">
                  <Image
                    src={holding.logoPath}
                    alt={`${holding.symbol} Logo`}
                    width={24}
                    height={24}
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {holding.symbol}
                  </div>
                  <div className="text-xs text-gray-500">{holding.name}</div>
                </div>
              </div>
              <div className="text-right text-white font-medium">
                {holding.balance}
              </div>
              <div className="text-right text-white font-medium">
                {holding.value}
              </div>
              <div className="text-right">
                <button
                  onClick={() => copyToClipboard(holding.address)}
                  className="flex items-center space-x-2 text-white hover:text-white text-xs font-mono transition-colors cursor-pointer group ml-auto"
                >
                  <span>
                    {holding.address.slice(0, 6)}...{holding.address.slice(-4)}
                  </span>
                  {copiedAddress === holding.address ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 group-hover:opacity-100 transition-opacity text-white" />
                  )}
                </button>
              </div>
            </div>
          ))}
          {tokenHoldings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No token holdings found</p>
              <p className="text-gray-500 text-sm mt-1">
                Connect your wallet to view your token balances
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
