'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useSecondaryMarket, Order, useBuyTokenMarket } from '@/hooks';
import { CreateOrderModal } from '@/components/secondary-market/CreateOrderModal';
import { MarketHeader, MarketTabs, MarketTable, MarketPagination } from './_components';

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState('listings');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [orderType, setOrderType] = useState<'sell' | 'offer'>('sell');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  const { getOrders, isLoading, error } = useSecondaryMarket();

  const refreshOrders = useCallback(async () => {
    try {
      const ordersResponse = await getOrders({ page: currentPage, limit: 10 });
      setOrders(ordersResponse.data);
      setTotalPages(ordersResponse.meta.totalPages);
      setTotalOrders(ordersResponse.meta.total);
    } catch (error) {
      setOrders([]);
      setTotalPages(1);
      setTotalOrders(0);
    }
  }, [currentPage, getOrders]);

  const { 
    handleBuyOrder, 
    approvalStep, 
    currentOrder, 
    account, 
    isExecuting, 
    isConfirming 
  } = useBuyTokenMarket(refreshOrders);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersResponse = await getOrders({ page: currentPage, limit: 10 });
        setOrders(ordersResponse.data);
        setTotalPages(ordersResponse.meta.totalPages);
        setTotalOrders(ordersResponse.meta.total);
      } catch (error) {
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
      }
    };

    loadOrders();
  }, [currentPage]);

  const handleCreateOrder = (type: 'sell' | 'offer') => {
    setOrderType(type);
    setShowCreateOrderModal(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <MarketHeader />
        
        <div>
          <div>
            <MarketTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onCreateOrder={handleCreateOrder}
              onRefresh={refreshOrders}
              isRefreshing={isLoading}
            />

            <MarketTable
              activeTab={activeTab}
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

            <MarketPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalOrders={totalOrders}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        <CreateOrderModal
          isOpen={showCreateOrderModal}
          onClose={() => setShowCreateOrderModal(false)}
          orderType={orderType}
        />
      </div>
    </DashboardLayout>
  );
}