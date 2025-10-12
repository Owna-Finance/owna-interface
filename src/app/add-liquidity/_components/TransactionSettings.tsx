import { ChangeEvent } from 'react';
import { Clock } from 'lucide-react';
import { AddLiquidityFormData } from './types';

type TransactionSettingsSectionProps = {
  formData: AddLiquidityFormData;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export function TransactionSettingsSection({ formData, onChange }: TransactionSettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-white">Transaction Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Deadline (minutes)</label>
          <input
            type="number"
            name="deadline"
            value={formData.deadline}
            onChange={onChange}
            placeholder="20"
            step="1"
            min="1"
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Transaction deadline from now</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={onChange}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Address to receive LP tokens</p>
        </div>
      </div>
    </div>
  );
}
