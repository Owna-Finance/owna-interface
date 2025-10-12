import { Order, ApprovalStep } from '@/hooks';
import { ListingsTable } from './ListingsTable';
import { OffersTable } from './OffersTable';

interface MarketTableProps {
  activeTab: string;
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

export function MarketTable({
  activeTab,
  orders,
  isLoading,
  error,
  handleBuyOrder,
  isExecuting,
  isConfirming,
  approvalStep,
  currentOrder,
  account
}: MarketTableProps) {
  return (
    <div className="bg-[#0A0A0A] rounded-lg overflow-hidden">
      {activeTab === 'listings' ? (
        <ListingsTable
          orders={orders}
          isLoading={isLoading}
          error={error}
          handleBuyOrder={handleBuyOrder}
          isExecuting={isExecuting}
          isConfirming={isConfirming}
          approvalStep={approvalStep}
          currentOrder={currentOrder}
          account={account}
        />
      ) : (
        <OffersTable
          orders={orders}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}