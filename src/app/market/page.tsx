'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Info, ArrowUpDown, Circle, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useSecondaryMarket, Order, useBuyTokenMarket } from '@/hooks';
import { CreateOrderModal } from '@/components/secondary-market/CreateOrderModal';
import { formatUnits } from 'viem';

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState('listings');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [orderType, setOrderType] = useState<'sell' | 'offer'>('sell');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  const { getOrders, isLoading, error } = useSecondaryMarket();

  // Refresh function for orders
  const refreshOrders = useCallback(async () => {
    try {
      const ordersResponse = await getOrders({ page: currentPage, limit: 10 });
      setOrders(ordersResponse.data);
      setTotalPages(ordersResponse.meta.totalPages);
      setTotalOrders(ordersResponse.meta.total);
    } catch (error) {
      console.error('Failed to refresh orders:', error);
      // Set empty state if refresh fails
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

  // Load orders from API using GET /orders endpoint
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Call GET /orders with pagination
        const ordersResponse = await getOrders({ page: currentPage, limit: 10 });
        
        // Update state with response data
        setOrders(ordersResponse.data);
        setTotalPages(ordersResponse.meta.totalPages);
        setTotalOrders(ordersResponse.meta.total);
        
        console.log('Orders loaded:', {
          total: ordersResponse.meta.total,
          page: ordersResponse.meta.page,
          totalPages: ordersResponse.meta.totalPages,
          ordersCount: ordersResponse.data.length
        });
      } catch (error) {
        console.error('Failed to load orders:', error);
        // Reset to empty state if API fails
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
      }
    };

    loadOrders();
  }, [currentPage]); // Remove getOrders dependency to prevent infinite loop

  // Helper functions
  const handleCreateOrder = (type: 'sell' | 'offer') => {
    setOrderType(type);
    setShowCreateOrderModal(true);
  };


  const formatTokenAmount = (amount: string, decimals: number = 18) => {
    try {
      const formatted = formatUnits(BigInt(amount), decimals);
      return parseFloat(formatted).toFixed(6);
    } catch {
      return '0.000000';
    }
  };

  const getTokenSymbol = (address: string) => {
    // Map token addresses to symbols
    if (address.toLowerCase() === '0x70667aea00Fc7f087D6bFFB9De3eD95Af37140a4'.toLowerCase()) {
      return 'USDC';
    }
    return 'YRT'; // Assume YRT for other addresses
  };

  const getYRTName = (address: string) => {
    // Map specific YRT token addresses to names
    if (address.toLowerCase() === '0x8DE41E5c1CB99a8658401058a0c685caFE06a886'.toLowerCase()) {
      return 'YRT-SUDIRMAN';
    }
    return `YRT-${address.slice(2, 8).toUpperCase()}`; // Default format
  };




  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Logo and Title */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/Images/Logo/logo_YRT.jpg"
              alt="YRT Logo"
              width={48}
              height={48}
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">YRT Market</h1>
          </div>
        </div>

        {/* Stats Header */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">7-Day Sales</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-white">169</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">Avg Sales</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-white">24.03%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">7-Day Volume</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-white">$859,870</div>
          </div>
        </div>


        {/* Main Content */}
        <div>
          {/* Listings/Offers */}
          <div>
            {/* Tabs with Sell Button */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-800">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'listings'
                      ? 'text-white border-b-2 border-teal-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Listings
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'offers'
                      ? 'text-white border-b-2 border-teal-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Offers
                </button>
              </div>
              
              {/* Action Button */}
              <Button 
                onClick={() => handleCreateOrder(activeTab === 'listings' ? 'sell' : 'offer')}
                className={`${activeTab === 'listings' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'} text-black font-medium px-8 py-2 rounded-lg mb-3 flex items-center space-x-2`}
              >
                {activeTab === 'listings' ? (
                  <span>Sell</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Offer</span>
                  </>
                )}
              </Button>
            </div>

            {/* Table */}
            <div className="bg-[#0A0A0A] rounded-lg overflow-hidden">
              {activeTab === 'listings' ? (
                <>
                  {/* Listings Table Header */}
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#111111] text-xs font-medium text-gray-400 uppercase">
                    <div className="flex items-center space-x-1">
                      <span>YRT Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="text-center">Maker</div>
                    <div className="text-center">Amount YRT Token</div>
                    <div className="text-center">Amount USDC</div>
                    <div className="text-center">Action</div>
                  </div>

                  {/* Listings Table Rows */}
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
                    ) : orders.length > 0 ? (
                      orders.filter(order => 
                        // Show sell orders (where maker is selling YRT for USDC)
                        getTokenSymbol(order.makerToken) === 'YRT' && getTokenSymbol(order.takerToken) === 'USDC'
                      ).map((order) => {
                        const yrtAmount = formatTokenAmount(order.makerAmount, order.makerTokenDecimals);
                        const usdcAmount = formatTokenAmount(order.takerAmount, order.takerTokenDecimals);
                        
                        return (
                          <div key={order.id} className="grid grid-cols-5 gap-4 px-4 py-3 text-sm hover:bg-[#111111] transition-colors">
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
                              <span className="text-white">{getYRTName(order.makerToken)}</span>
                            </div>
                            <div className="text-center text-white">
                              <span className="text-xs">{order.maker.slice(0, 6)}...{order.maker.slice(-4)}</span>
                            </div>
                            <div className="text-center text-white">{yrtAmount}</div>
                            <div className="text-center text-white">{usdcAmount}</div>
                            <div className="text-center">
                              <Button
                                onClick={() => handleBuyOrder(order)}
                                disabled={
                                  isExecuting || 
                                  isConfirming || 
                                  !order.signature || 
                                  order.status !== 'ACTIVE' || 
                                  approvalStep !== 'idle' ||
                                  !account
                                }
                                className="bg-teal-500 hover:bg-teal-600 text-black font-medium px-4 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {((isExecuting || isConfirming) && currentOrder?.id === order.id) || (approvalStep === 'fetching-order' && currentOrder?.id === order.id) ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                    {approvalStep === 'fetching-order' && 'Fetching Order'}
                                    {approvalStep === 'approving-yrt' && 'Approving YRT'}
                                    {approvalStep === 'approving-usdc' && 'Approving USDC'}
                                    {approvalStep === 'executing' && 'Executing'}
                                  </>
                                ) : (
                                  'Buy'
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // No orders available
                      <div className="text-center py-8">
                        <p className="text-gray-400">No active orders found</p>
                        <p className="text-gray-500 text-sm mt-1">Create a sell order to get started</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Offers Table Header */}
                  <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#111111] text-xs font-medium text-gray-400 uppercase">
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                    </div>
                    <div className="text-center">ID</div>
                    <div className="flex items-center justify-center space-x-1">
                      <span>Discount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Circle className="w-3 h-3" />
                      <span>Available Funds</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Circle className="w-3 h-3" />
                      <span>YRT Size limit</span>
                    </div>
                  </div>

                  {/* Offers Table Rows */}
                  <div className="divide-y divide-gray-800">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-400">Loading offers...</span>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <p className="text-red-400">Failed to load offers</p>
                        <p className="text-gray-500 text-sm mt-1">{error}</p>
                      </div>
                    ) : orders.length > 0 ? (
                      orders.filter(order => 
                        // Show offers (where maker is offering USDC for YRT)
                        getTokenSymbol(order.makerToken) === 'USDC' && getTokenSymbol(order.takerToken) === 'YRT'
                      ).map((order) => {
                        const usdcAmount = formatTokenAmount(order.makerAmount, order.makerTokenDecimals);
                        const yrtAmount = formatTokenAmount(order.takerAmount, order.takerTokenDecimals);
                        const price = parseFloat(usdcAmount) / parseFloat(yrtAmount);
                        
                        return (
                          <div key={order.id} className="grid grid-cols-5 gap-4 px-4 py-3 text-sm hover:bg-[#111111] transition-colors">
                            <div className="text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="text-center text-white">{order.id}</div>
                            <div className="text-center text-white">{((1 - price) * 100).toFixed(2)}%</div>
                            <div className="text-center text-white flex items-center justify-center space-x-1">
                              <span>{usdcAmount}</span>
                              <Circle className="w-3 h-3 text-gray-400 fill-current" />
                            </div>
                            <div className="text-center text-white flex items-center justify-center space-x-1">
                              <span>{yrtAmount}</span>
                              <Circle className="w-3 h-3 text-gray-400 fill-current" />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // No offers available
                      <div className="text-center py-8">
                        <p className="text-gray-400">No active offers found</p>
                        <p className="text-gray-500 text-sm mt-1">Make an offer to get started</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 text-sm disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    First
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 text-sm disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    ‹
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  {currentPage} of {totalPages > 0 ? totalPages : 1} ({totalOrders} total orders)
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 text-sm disabled:opacity-50"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    ›
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 text-sm disabled:opacity-50"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Order Modal */}
        <CreateOrderModal
          isOpen={showCreateOrderModal}
          onClose={() => setShowCreateOrderModal(false)}
          orderType={orderType}
        />
      </div>
    </DashboardLayout>
  );
}