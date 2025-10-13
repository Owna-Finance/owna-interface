"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSecondaryMarket, CreateOrderParams } from "@/hooks";
import { CONTRACTS } from "@/constants/contracts/contracts";
import { erc20Abi, parseUnits } from "viem";
import { X, Loader2 } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: "sell" | "offer";
}

interface OrderFormData {
  yrtAddress: string;
  yrtAmount: string;
  usdcAmount: string;
  slippagePercent: string;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  orderType,
}: CreateOrderModalProps) {
  const { createAndVerifyOrder, isLoading, error, address, clearError } =
    useSecondaryMarket();

  const [formData, setFormData] = useState<OrderFormData>({
    yrtAddress: "",
    yrtAmount: "",
    usdcAmount: "",
    slippagePercent: "2.0",
  });

  const [success, setSuccess] = useState(false);
  const [approvalStep, setApprovalStep] = useState<
    "idle" | "approving" | "approved"
  >("idle");
  const [pendingOrderParams, setPendingOrderParams] =
    useState<CreateOrderParams | null>(null);

  // Wagmi hooks for approval
  const {
    writeContract,
    data: approvalHash,
    isPending: isApproving,
    error: approvalError,
  } = useWriteContract();

  const { isLoading: isConfirmingApproval, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  // Handle approval confirmation
  useEffect(() => {
    const processOrder = async () => {
      if (
        isApprovalConfirmed &&
        pendingOrderParams &&
        approvalStep === "approving"
      ) {
        setApprovalStep("approved");
        console.log("Token approval confirmed! Creating order...");

        try {
          // Step 2: Create and verify order after approval is confirmed
          const result = await createAndVerifyOrder(pendingOrderParams);

          if (result.success) {
            setSuccess(true);
            // Reset form and states
            setFormData({
              yrtAddress: "",
              yrtAmount: "",
              usdcAmount: "",
              slippagePercent: "2.0",
            });
            setApprovalStep("idle");
            setPendingOrderParams(null);

            // Close modal after 2 seconds
            setTimeout(() => {
              setSuccess(false);
              onClose();
            }, 2000);
          } else {
            console.error("Order creation failed:", result.error);
            setApprovalStep("idle");
            setPendingOrderParams(null);
          }
        } catch (error) {
          console.error("Error after approval:", error);
          setApprovalStep("idle");
          setPendingOrderParams(null);
        }
      }
    };

    processOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApprovalConfirmed, pendingOrderParams, approvalStep]);

  // Handle approval error
  useEffect(() => {
    if (approvalError) {
      console.error("Approval error:", approvalError);
      alert(`Token approval failed: ${approvalError.message}`);
      setApprovalStep("idle");
      setPendingOrderParams(null);
    }
  }, [approvalError]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous errors when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!formData.yrtAddress || !formData.yrtAmount || !formData.usdcAmount) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Convert amounts to wei format (assuming 18 decimals)
      const yrtAmountWei = parseUnits(formData.yrtAmount, 18).toString();
      const usdcAmountWei = parseUnits(formData.usdcAmount, 18).toString();

      let orderParams: CreateOrderParams;
      let tokenToApprove: `0x${string}`;
      let amountToApprove: bigint;

      if (orderType === "sell") {
        // Selling YRT for USDC
        orderParams = {
          maker: address,
          makerToken: formData.yrtAddress, // YRT token address
          makerAmount: yrtAmountWei, // Amount of YRT to sell
          takerToken: CONTRACTS.USDC, // USDC token address
          takerAmount: usdcAmountWei, // Amount of USDC to receive
        };
        tokenToApprove = formData.yrtAddress as `0x${string}`;
        amountToApprove = BigInt(yrtAmountWei);
      } else {
        // Making offer: Offering USDC for YRT
        orderParams = {
          maker: address,
          makerToken: CONTRACTS.USDC, // USDC token address
          makerAmount: usdcAmountWei, // Amount of USDC to offer
          takerToken: formData.yrtAddress, // YRT token address
          takerAmount: yrtAmountWei, // Amount of YRT to receive
        };
        tokenToApprove = CONTRACTS.USDC;
        amountToApprove = BigInt(usdcAmountWei);
      }

      // Save order params for later use after approval
      setPendingOrderParams(orderParams);
      setApprovalStep("approving");

      // Step 1: Approve token to SecondaryMarket contract
      console.log(
        "Approving token:",
        tokenToApprove,
        "amount:",
        amountToApprove.toString()
      );
      writeContract({
        address: tokenToApprove,
        abi: erc20Abi,
        functionName: "approve",
        args: [CONTRACTS.SECONDARY_MARKET, amountToApprove],
      });
    } catch (error) {
      console.error("Error creating order:", error);
      setApprovalStep("idle");
      setPendingOrderParams(null);
    }
  };

  const fillSampleData = () => {
    setFormData({
      yrtAddress: "0x8DE41E5c1CB99a8658401058a0c685caFE06a886",
      yrtAmount: "100",
      usdcAmount: "95",
      slippagePercent: "2.0",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {orderType === "sell" ? "Sell YRT" : "Make Offer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-400 text-lg font-medium mb-2">
              ✅ Order Created Successfully!
            </div>
            <p className="text-gray-400 text-sm">
              Your order is now active and available in the market.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sample Data Button */}
            <div className="text-center">
              <Button
                type="button"
                onClick={fillSampleData}
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white text-sm"
              >
                Fill Sample Data
              </Button>
            </div>

            {/* YRT Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YRT Token Address
              </label>
              <input
                type="text"
                name="yrtAddress"
                value={formData.yrtAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>

            {/* YRT Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YRT Amount
              </label>
              <input
                type="number"
                name="yrtAmount"
                value={formData.yrtAmount}
                onChange={handleInputChange}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>

            {/* USDC Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                USDC Amount
              </label>
              <input
                type="number"
                name="usdcAmount"
                value={formData.usdcAmount}
                onChange={handleInputChange}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>

            {/* Price Info */}
            {formData.yrtAmount && formData.usdcAmount && (
              <div className="bg-[#111111] rounded-lg p-3 border border-[#2A2A2A]">
                <div className="text-sm text-gray-400 mb-1">
                  {orderType === "sell" ? "Selling Price" : "Offering Price"}
                </div>
                <div className="text-white font-medium">
                  1 YRT ={" "}
                  {(
                    parseFloat(formData.usdcAmount) /
                    parseFloat(formData.yrtAmount)
                  ).toFixed(6)}{" "}
                  USDC
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !address ||
                isApproving ||
                isConfirmingApproval ||
                approvalStep !== "idle"
              }
              className="w-full bg-teal-500 hover:bg-teal-600 text-black font-medium py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving || isConfirmingApproval ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {isApproving
                      ? "Approving Token..."
                      : "Waiting for Confirmation..."}
                  </span>
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating & Signing Order...</span>
                </>
              ) : (
                <span>
                  {orderType === "sell"
                    ? "Create & Sign Sell Order"
                    : "Create & Sign Offer"}
                </span>
              )}
            </Button>

            {!address && (
              <p className="text-center text-red-400 text-sm">
                Please connect your wallet to create orders
              </p>
            )}

            {/* Approval Status */}
            {approvalStep !== "idle" && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-400 text-sm">
                  {approvalStep === "approving" && "⏳ Approving token..."}
                  {approvalStep === "approved" &&
                    "✅ Token approved! Creating order..."}
                </p>
              </div>
            )}

            {/* Info */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>
                {orderType === "sell"
                  ? "1. Approve token → 2. Order will be created → 3. Wallet will prompt for signature → 4. Order becomes active"
                  : "1. Approve USDC → 2. Offer will be created → 3. Wallet will prompt for signature → 4. Offer becomes active"}
              </p>
              <p className="text-yellow-500">
                💡 Approval requires gas fee, signature (EIP-712) is free
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
