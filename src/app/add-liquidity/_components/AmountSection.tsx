import { ChangeEvent } from 'react';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { AddLiquidityFormData } from './types';

type AmountsSectionProps = {
  formData: AddLiquidityFormData;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  amountAMin: string;
  amountBMin: string;
  needsTokenAApproval: boolean;
  needsTokenBApproval: boolean;
};

export function AmountsSection({
  formData,
  onChange,
  amountAMin,
  amountBMin,
  needsTokenAApproval,
  needsTokenBApproval,
}: AmountsSectionProps) {
  const tokenBLabel = formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX';
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-semibold text-white">Amounts</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">YRT Amount</label>
          <input
            type="number"
            name="amountADesired"
            value={formData.amountADesired}
            onChange={onChange}
            placeholder="1000"
            step="0.000001"
            min="0"
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {needsTokenAApproval ? '⚠️ Will require YRT approval' : 'Sufficient YRT allowance'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{tokenBLabel} Amount</label>
          <input
            type="number"
            name="amountBDesired"
            value={formData.amountBDesired}
            onChange={onChange}
            placeholder="1000"
            step="0.000001"
            min="0"
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {needsTokenBApproval ? `⚠️ Will require ${tokenBLabel} approval` : `Sufficient ${tokenBLabel} allowance`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Slippage Tolerance (%)</label>
          <input
            type="number"
            name="slippage"
            value={formData.slippage}
            onChange={onChange}
            placeholder="5"
            step="0.1"
            min="0.1"
            max="50"
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Maximum price slippage you will accept</p>
        </div>

        <div className="hidden">
          <label className="block text-sm font-medium text-gray-300 mb-2">Min Token A Amount</label>
          <div className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-gray-400">
            {amountAMin || '0'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Calculated from slippage</p>
        </div>

        <div className="hidden">
          <label className="block text-sm font-medium text-gray-300 mb-2">Min Token B Amount</label>
          <div className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-gray-400">
            {amountBMin || '0'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Calculated from slippage</p>
        </div>
      </div>
    </div>
  );
}
