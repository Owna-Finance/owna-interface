import { Button } from "@/components/ui/button";
import { ArrowUpDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { Order, ApprovalStep } from "@/hooks";
import { formatUnits } from "viem";

interface ListingsTableProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  handleBuyOrder: (order: Order) => void;
  isExecuting: boolean;
  isConfirming: boolean;
  approvalStep: ApprovalStep;
  currentOrder: Order | null;
  account: string | undefined;
}

export function ListingsTable({
  orders,
  isLoading,
  error,
  handleBuyOrder,
  isExecuting,
  isConfirming,
  approvalStep,
  currentOrder,
  account,
}: ListingsTableProps) {
  const formatTokenAmount = (amount: string, decimals: number = 18) => {
    try {
      const formatted = formatUnits(BigInt(amount), decimals);
      const num = parseFloat(formatted);
      // Remove unnecessary decimal places
      return num % 1 === 0 ? num.toString() : num.toFixed(6).replace(/\.?0+$/, '');
    } catch {
      return "0";
    }
  };

  const getTokenSymbol = (address: string) => {
    if (
      address.toLowerCase() ===
      "0x70667aea00Fc7f087D6bFFB9De3eD95Af37140a4".toLowerCase()
    ) {
      return "USDC";
    }
    return "YRT";
  };

  const getYRTName = (address: string) => {
    // Return consistent name for all YRT tokens
    return "YRT-Sudirman";
  };

  const sellOrders = orders;

  // const sellOrders = orders.filter(order =>
  //   getTokenSymbol(order.makerToken) === 'YRT' && getTokenSymbol(order.takerToken) === 'USDC'
  // );

  return (
    <>
      <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#111111] text-xs font-medium text-gray-400 uppercase">
        <div className="flex items-center space-x-1">
          <span>YRT Name</span>
          <ArrowUpDown className="w-3 h-3" />
        </div>
        <div className="text-center">Maker</div>
        <div className="text-center">Amount YRT Token</div>
        <div className="text-center">Amount </div>
        <div className="text-center">Action</div>
      </div>

      <div className="divide-y divide-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-400">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400">Failed to load orders</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
          </div>
        ) : sellOrders.length > 0 ? (
          sellOrders.map((order) => {
            const yrtAmount = formatTokenAmount(
              order.makerAmount,
              order.makerTokenDecimals
            );
            const usdcAmount = formatTokenAmount(
              order.takerAmount,
              order.takerTokenDecimals
            );

            return (
              <div
                key={order.id}
                className="grid grid-cols-5 gap-4 px-4 py-3 text-sm hover:bg-[#111111] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5">
                    <Image
                      src="/Images/Logo/logo_YRT.jpg"
                      alt="YRT Logo"
                      width={20}
                      height={20}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="text-white">
                    {getYRTName(order.makerToken)}
                  </span>
                </div>
                <div className="text-center text-white">
                  <span className="text-xs">
                    {order.maker.slice(0, 6)}...{order.maker.slice(-4)}
                  </span>
                </div>
                <div className="text-center text-white">{yrtAmount}</div>
                <div className="text-center text-white flex items-center justify-center space-x-2">
                  <span>{usdcAmount}</span>
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <Image
                      src="/Images/Logo/usdc-logo.png"
                      alt="USDC Logo"
                      width={16}
                      height={16}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => handleBuyOrder(order)}
                    disabled={
                      isExecuting ||
                      isConfirming ||
                      !order.signature ||
                      order.status !== "ACTIVE" ||
                      approvalStep !== "idle" ||
                      !account
                    }
                    className="cursor-pointer bg-white hover:bg-gray-200 text-black font-medium px-3 py-1 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed min-w-[50px] h-7"
                  >
                    {((isExecuting || isConfirming) &&
                      currentOrder?.id === order.id) ||
                    (approvalStep === "fetching-order" &&
                      currentOrder?.id === order.id) ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        {approvalStep === "fetching-order" && "Fetching Order"}
                        {approvalStep === "approving-yrt" && "Approving YRT"}
                        {approvalStep === "approving-usdc" && "Approving USDC"}
                        {approvalStep === "executing" && "Executing"}
                      </>
                    ) : (
                      "Buy"
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No active orders found</p>
            <p className="text-gray-500 text-sm mt-1">
              Create a sell order to get started
            </p>
          </div>
        )}
      </div>
    </>
  );
}
