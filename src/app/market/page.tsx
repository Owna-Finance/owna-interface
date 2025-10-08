'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink, ArrowUpDown, Lock, TrendingUp, Circle, BarChart3, Plus } from 'lucide-react';
import Image from 'next/image';

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState('listings');

  // Mock data with YRT property names
  const listingsData = [
    {
      tokenId: 'YRT-UKDW',
      discount: '26.60%',
      lockedAERO: '3,004',
      price: '2,202.00',
      priceUSD: '$2.4K',
      lock: 'max',
      status: 'lock'
    },
    {
      tokenId: 'YRT-HRA',
      discount: '26.60%',
      lockedAERO: '2,635',
      price: '1,934.00',
      priceUSD: '$2.1K',
      lock: 'max',
      status: 'lock'
    },
    {
      tokenId: 'YRT-HF',
      discount: '26.44% → 28.00%',
      lockedAERO: '7,320',
      price: '5,384.89',
      priceUSD: '$5.9K',
      lock: '3.53y',
      status: 'trending_up'
    },
    {
      tokenId: 'YRT-HMM',
      discount: '26.44% → 28.00%',
      lockedAERO: '6,100',
      price: '4,487.45',
      priceUSD: '$4.9K',
      lock: '3.53y',
      status: 'trending_up'
    },
    {
      tokenId: 'YRT-HG',
      discount: '26.38% → 28.00%',
      lockedAERO: '5,900',
      price: '4,343.40',
      priceUSD: '$4.8K',
      lock: '3.53y',
      status: 'trending_up'
    },
    {
      tokenId: 'YRT-HS',
      discount: '26.36%',
      lockedAERO: '47,188',
      price: '34,750.00',
      priceUSD: '$38.2K',
      lock: 'max',
      status: 'lock'
    },
    {
      tokenId: 'YRT-HGI',
      discount: '26.32% → 28.00%',
      lockedAERO: '4,880',
      price: '3,595.42',
      priceUSD: '$3.9K',
      lock: '3.53y',
      status: 'trending_up'
    },
    {
      tokenId: 'YRT-HM',
      discount: '26.32%',
      lockedAERO: '8,578',
      price: '6,320.00',
      priceUSD: '$6.9K',
      lock: 'max',
      status: 'lock'
    },
    {
      tokenId: 'YRT-HP',
      discount: '26.01%',
      lockedAERO: '2,980',
      price: '2,205.00',
      priceUSD: '$2.4K',
      lock: '3.49y',
      status: 'lock'
    },
    {
      tokenId: 'YRT-HT',
      discount: '26.01%',
      lockedAERO: '26,548',
      price: '19,642.61',
      priceUSD: '$21.6K',
      lock: 'max',
      status: 'lock'
    },
    {
      tokenId: 'YRT-HI',
      discount: '26.00%',
      lockedAERO: '4,629',
      price: '3,425.00',
      priceUSD: '$3.8K',
      lock: 'max',
      status: 'lock'
    }
  ];

  const salesData = [
    {
      time: '05:40',
      tokenId: 'YRT-HOTEL BOROBUDUR',
      discount: '28.28%',
      lockedAERO: '2.7K',
      price: '2.1K',
      status: 'up'
    },
    {
      time: '01:35',
      tokenId: 'YRT-HOTEL YOGYA',
      discount: '20.00%',
      lockedAERO: '5.5',
      price: '4.4',
      status: 'down'
    },
    {
      time: '01:01',
      tokenId: 'YRT-HOTEL PATRA JASA',
      discount: '19.00%',
      lockedAERO: '615.5',
      price: '498.6',
      status: 'down'
    },
    {
      time: '07 Oct',
      tokenId: 'YRT-HOTEL GAJAH MADA',
      discount: '2.00%',
      lockedAERO: '50',
      price: '49',
      status: 'down'
    },
    {
      time: '07 Oct',
      tokenId: 'YRT-HOTEL GRAND QUALITY',
      discount: '11.00%',
      lockedAERO: '25.9',
      price: '23',
      status: 'down'
    }
  ];

  // Offers data matching the screenshot
  const offersData = [
    {
      date: '11 Sep 2025',
      id: '5679',
      discount: '17.50%',
      availableFunds: '1.58',
      nftSizeLimit: '1.92'
    },
    {
      date: '08 Oct 2025',
      id: '6614',
      discount: '19.99%',
      availableFunds: '1,685.31',
      nftSizeLimit: '185.77'
    },
    {
      date: '18 Sep 2025',
      id: '5869',
      discount: '20.00%',
      availableFunds: '148.62',
      nftSizeLimit: '185.77'
    },
    {
      date: '28 Sep 2025',
      id: '6071',
      discount: '28.00%',
      availableFunds: '2.07',
      nftSizeLimit: '2.88'
    },
    {
      date: '08 Oct 2025',
      id: '6615',
      discount: '29.74%',
      availableFunds: '1,685.31',
      nftSizeLimit: '999.00'
    },
    {
      date: '07 Oct 2025',
      id: '6607',
      discount: '29.75%',
      availableFunds: '2,300.00',
      nftSizeLimit: '3,274.02'
    },
    {
      date: '07 Oct 2025',
      id: '6604',
      discount: '30.00%',
      availableFunds: '7,082.90',
      nftSizeLimit: '10,118.43'
    },
    {
      date: '17 Sep 2025',
      id: '5858',
      discount: '30.00%',
      availableFunds: '10.00',
      nftSizeLimit: '14.29'
    },
    {
      date: '08 Oct 2025',
      id: '6618',
      discount: '31.21%',
      availableFunds: '687.18',
      nftSizeLimit: '999.00'
    },
    {
      date: '08 Oct 2025',
      id: '6619',
      discount: '32.91%',
      availableFunds: '1,336.73',
      nftSizeLimit: '1,992.37'
    },
    {
      date: '07 Oct 2025',
      id: '6602',
      discount: '33.50%',
      availableFunds: '3,500.00',
      nftSizeLimit: '5,263.16'
    },
    {
      date: '07 Oct 2025',
      id: '6601',
      discount: '33.89%',
      availableFunds: '3,500.00',
      nftSizeLimit: '5,294.21'
    },
    {
      date: '07 Oct 2025',
      id: '6556',
      discount: '33.90%',
      availableFunds: '21,000.00',
      nftSizeLimit: '31,770.05'
    },
    {
      date: '04 Oct 2025',
      id: '6485',
      discount: '34.00%',
      availableFunds: '66,562.89',
      nftSizeLimit: '100,852.87'
    },
    {
      date: '24 Sep 2025',
      id: '6035',
      discount: '34.00%',
      availableFunds: '1,973.91',
      nftSizeLimit: '2,990.77'
    }
  ];


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
              <span className="text-sm text-gray-400">Avg Discount</span>
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

        {/* Make Offer Button */}
        <div className="flex justify-end mb-6">
          <Button className="bg-teal-500 hover:bg-teal-600 text-black font-medium px-6 py-2 rounded-lg">
            Make Offer
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Listings/Offers */}
          <div className="col-span-8">
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
              <Button className={`${activeTab === 'listings' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'} text-black font-medium px-8 py-2 rounded-lg mb-3 flex items-center space-x-2`}>
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
                  <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-[#111111] text-xs font-medium text-gray-400 uppercase">
                    <div className="flex items-center space-x-1">
                      <span>YRT Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="flex items-center space-x-1 justify-center">
                      <span>Discount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                    <div className="text-center">Locked YRT</div>
                    <div className="text-center">Price</div>
                    <div className="text-center">Price USD</div>
                    <div className="text-center">Lock</div>
                  </div>

                  {/* Listings Table Rows */}
                  <div className="divide-y divide-gray-800">
                    {listingsData.map((item) => (
                      <div key={item.tokenId} className="grid grid-cols-6 gap-4 px-4 py-3 text-sm hover:bg-[#111111] transition-colors">
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
                          <span className="text-white">{item.tokenId}</span>
                        </div>
                        <div className="text-center">
                          <span className={item.discount.includes('→') ? 'text-green-400' : 'text-white'}>
                            {item.discount}
                          </span>
                        </div>
                        <div className="text-center text-white">{item.lockedAERO}</div>
                        <div className="text-center text-white flex items-center justify-center space-x-1">
                          <span>{item.price}</span>
                          <Circle className="w-3 h-3 text-gray-400 fill-current" />
                        </div>
                        <div className="text-center text-white">{item.priceUSD}</div>
                        <div className="text-center text-white">{item.lock}</div>
                      </div>
                    ))}
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
                    {offersData.map((offer) => (
                      <div key={offer.id} className="grid grid-cols-5 gap-4 px-4 py-3 text-sm hover:bg-[#111111] transition-colors">
                        <div className="text-gray-300">{offer.date}</div>
                        <div className="text-center text-white">{offer.id}</div>
                        <div className="text-center text-white">{offer.discount}</div>
                        <div className="text-center text-white flex items-center justify-center space-x-1">
                          <span>{offer.availableFunds}</span>
                          <Circle className="w-3 h-3 text-gray-400 fill-current" />
                        </div>
                        <div className="text-center text-white flex items-center justify-center space-x-1">
                          <span>{offer.nftSizeLimit}</span>
                          <Circle className="w-3 h-3 text-gray-400 fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" className="text-gray-400 text-sm">First</Button>
                  <Button variant="ghost" className="text-gray-400 text-sm">‹</Button>
                </div>
                <div className="text-sm text-gray-400">1 of 1000</div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" className="text-gray-400 text-sm">›</Button>
                  <Button variant="ghost" className="text-gray-400 text-sm">Last</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Sales */}
          <div className="col-span-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Sales</h2>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </div>

            {/* Sales Table */}
            <div className="bg-[#0A0A0A] rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-[#111111] text-xs font-medium text-gray-400 uppercase">
                <div>Time</div>
                <div>YRT Name</div>
                <div>Discount</div>
                <div>Locked YRT</div>
                <div>Price</div>
              </div>

              {/* Sales Rows */}
              <div className="divide-y divide-gray-800">
                {salesData.map((sale, index) => (
                  <div key={`${sale.tokenId}-${index}`} className="grid grid-cols-5 gap-2 px-4 py-3 text-xs hover:bg-[#111111] transition-colors">
                    <div className="text-gray-400">{sale.time}</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5">
                        <Image
                          src="/Images/Logo/logo_YRT.jpg"
                          alt="YRT Logo"
                          width={16}
                          height={16}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span className="text-white">{sale.tokenId}</span>
                    </div>
                    <div className="text-white">{sale.discount}</div>
                    <div className="text-white">{sale.lockedAERO}</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-white">{sale.price}</span>
                      {sale.status === 'up' ? (
                        <Circle className="w-3 h-3 text-blue-400 fill-current" />
                      ) : (
                        <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Analytics Section */}
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-lg font-medium text-white">Market Analytics</h3>
              </div>
              
              {/* Key Metrics Grid */}
              <div className="space-y-4">
                <div className="bg-[#0A0A0A] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Total YRT Value</span>
                    <span className="text-lg font-semibold text-white">$2.45M</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>

                <div className="bg-[#0A0A0A] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Active Properties</span>
                    <span className="text-lg font-semibold text-white">11</span>
                  </div>
                  <div className="text-xs text-green-400">+2 this week</div>
                </div>

                <div className="bg-[#0A0A0A] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Avg Discount</span>
                    <span className="text-lg font-semibold text-white">26.5%</span>
                  </div>
                  <div className="text-xs text-red-400">-1.2% from last week</div>
                </div>

                <div className="bg-[#0A0A0A] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Hotel Market Cap</span>
                    <span className="text-lg font-semibold text-white">$1.8M</span>
                  </div>
                  <div className="text-xs text-gray-400">Yogyakarta Tourism Sector</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}