import { ChangeEvent } from 'react';
import { Droplets } from 'lucide-react';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { AddLiquidityFormData } from './types';

type TokenPairSectionProps = {
  formData: AddLiquidityFormData;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export function TokenPairSection({ formData, onChange }: TokenPairSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Droplets className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-white">Token Pair</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Token A Address</label>
          <input
            type="text"
            name="tokenA"
            value={formData.tokenA}
            onChange={onChange}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Contract address of YRT Token</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Token B</label>
          <select
            name="tokenB"
            value={formData.tokenB}
            onChange={onChange}
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          >
            <option value={CONTRACTS.USDC}>USDC</option>
            <option value={CONTRACTS.IDRX}>IDRX</option>
          </select>
        </div>
      </div>
    </div>
  );
}
