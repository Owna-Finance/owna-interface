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

export type ApprovalStep =
  | "idle"
  | "fetching-order"
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
      alert("Order signature not available");
      return;
    }

    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    try {
      setCurrentOrder(order);
      setApprovalStep("fetching-order");

      // Step 1: Fetch signed order data from API
      const signedOrder = await executeOrder(order.id.toString());

      setSignedOrderData(signedOrder);

      // Step 2: Approve USDC token (buyer only needs to approve USDC)
      setApprovalStep("approving-usdc");

      writeContract({
        address: order.takerToken as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [CONTRACTS.SECONDARY_MARKET, BigInt(order.takerAmount)],
      });
    } catch (error) {
      console.error("Error starting buy process:", error);
      alert("Failed to start buy process");
      setApprovalStep("idle");
      setCurrentOrder(null);
      setSignedOrderData(null);
    }
  };


  const executeSwap = (order: Order) => {
    setApprovalStep("executing");

    if (!signedOrderData) {
      alert("Signed order data not available");
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
      if (approvalStep === "approving-usdc") {
        alert("USDC approval successful! Now executing swap...");
        executeSwap(currentOrder);
      } else if (approvalStep === "executing") {
        alert("Order executed successfully!");
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
      if (approvalStep === "approving-usdc") {
        errorMessage = "USDC approval failed";
      } else if (approvalStep === "executing") {
        errorMessage = "Swap execution failed";
      }

      alert(`${errorMessage}: ${executeError.message}`);

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
