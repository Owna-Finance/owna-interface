import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { erc20Abi } from "viem";
import { CONTRACTS } from "@/constants/contracts/contracts";
import { SECONDARY_MARKET_ABI } from "@/constants/abis/SECONDARYMARKETAbi";
import { useSecondaryMarket, Order } from "./useSecondaryMarket";
import { toast } from "sonner";

export type ApprovalStep =
  | "idle"
  | "fetching-order"
  | "approving-yrt"
  | "approving-usdc"
  | "executing";

export function useBuyTokenMarket(onOrderExecuted?: () => void) {
  const [approvalStep, setApprovalStep] = useState<ApprovalStep>("idle");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [signedOrderData, setSignedOrderData] = useState<any>(null);

  const { executeOrder } = useSecondaryMarket();
  const { address: account } = useAccount();

  // Contract writing for approvals and executeSwap
  const {
    writeContract,
    data: hash,
    isPending: isExecuting,
    error: executeError,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleBuyOrder = async (order: Order) => {
    if (!order.signature) {
      toast.error("Order signature not available", {
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        }
      });
      return;
    }

    if (!account) {
      toast.error("Please connect your wallet", {
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        }
      });
      return;
    }

    try {
      setCurrentOrder(order);
      setApprovalStep("fetching-order");

      // Step 1: Fetch signed order data from API
      const signedOrder = await executeOrder(order.id.toString());

      setSignedOrderData(signedOrder);

      // Step 2: First approve YRT token 
      setApprovalStep("approving-yrt");

      writeContract({
        address: order.makerToken as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [CONTRACTS.SECONDARY_MARKET, BigInt(order.makerAmount)],
      });
    } catch (error) {
      console.error("Error starting buy process:", error);
      toast.error("Failed to start buy process", {
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        }
      });
      setApprovalStep("idle");
      setCurrentOrder(null);
      setSignedOrderData(null);
    }
  };


  const approveUSDC = (order: Order) => {
    setApprovalStep("approving-usdc");

    writeContract({
      address: order.takerToken as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [CONTRACTS.SECONDARY_MARKET, BigInt(order.takerAmount)],
    });
  };

  const executeSwap = (order: Order) => {
    setApprovalStep("executing");

    if (!signedOrderData) {
      toast.error("Signed order data not available", {
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        }
      });
      setApprovalStep("idle");
      setCurrentOrder(null);
      return;
    }

    // Use the typed data from the API response
    const orderTuple = {
      maker: signedOrderData.typedData.message.maker as `0x${string}`,
      makerToken: signedOrderData.typedData.message.makerToken as `0x${string}`,
      makerAmount: BigInt(signedOrderData.typedData.message.makerAmount),
      takerToken: signedOrderData.typedData.message.takerToken as `0x${string}`,
      takerAmount: BigInt(signedOrderData.typedData.message.takerAmount),
      salt: signedOrderData.typedData.message.salt,
    };

    // Step 3: Execute the swap using the signature from API
    writeContract({
      address: CONTRACTS.SECONDARY_MARKET,
      abi: SECONDARY_MARKET_ABI,
      functionName: "executeSwap",
      args: [orderTuple, signedOrderData.signature as `0x${string}`],
    });
  };

  const resetState = () => {
    setApprovalStep("idle");
    setCurrentOrder(null);
    setSignedOrderData(null);
  };

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && currentOrder) {
      if (approvalStep === "approving-yrt") {
        toast.success("YRT approved! Now approving USDC...", {
          style: {
            background: '#111111',
            border: '1px solid #2A2A2A',
            color: '#ffffff',
          }
        });
        approveUSDC(currentOrder);
      } else if (approvalStep === "approving-usdc") {
        toast.success("USDC approved! Executing swap...", {
          style: {
            background: '#111111',
            border: '1px solid #2A2A2A',
            color: '#ffffff',
          }
        });
        executeSwap(currentOrder);
      } else if (approvalStep === "executing") {
        toast.success("Order executed successfully! View transaction on Base Sepolia", {
          style: {
            background: '#111111',
            border: '1px solid #2A2A2A',
            color: '#ffffff',
          },
          duration: 5000,
          action: {
            label: "View Transaction",
            onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank')
          }
        });
        // Reset state
        resetState();
        // Call the callback to refresh orders
        if (onOrderExecuted) {
          onOrderExecuted();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, approvalStep, currentOrder]);

  // Handle transaction error
  useEffect(() => {
    if (executeError) {
      console.error("Execute error:", executeError);

      let errorMessage = "Transaction failed";
      if (approvalStep === "approving-yrt") {
        errorMessage = "YRT approval failed";
      } else if (approvalStep === "approving-usdc") {
        errorMessage = "USDC approval failed";
      } else if (approvalStep === "executing") {
        errorMessage = "Swap execution failed";
      }

      toast.error(`${errorMessage}: ${executeError.message}`, {
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        }
      });

      // Reset approval state on error
      resetState();
    }
  }, [executeError, approvalStep]);

  return {
    // Functions
    handleBuyOrder,
    resetState,

    // State
    approvalStep,
    currentOrder,
    signedOrderData,
    account,

    // Transaction state
    isExecuting,
    isConfirming,
    isConfirmed,
    executeError,
  };
}