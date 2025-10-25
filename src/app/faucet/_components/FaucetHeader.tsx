import { Droplets, Info } from 'lucide-react';

export function FaucetHeader() {
  return (
    <>
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-white">Token Faucet</h1>
          <p className="text-sm text-gray-400 mt-1">Mint test tokens for development</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">Network</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">Base Sepolia</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">Status</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">Active</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">Available Tokens</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">2</div>
        </div>
      </div>
    </>
  );
}
