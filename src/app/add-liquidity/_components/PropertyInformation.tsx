import { ChangeEvent } from 'react';
import { Building } from 'lucide-react';
import { AddLiquidityFormData } from './types';

type PropertyInformationSectionProps = {
  formData: AddLiquidityFormData;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export function PropertyInformationSection({ formData, onChange }: PropertyInformationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Building className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-white">Property Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Property Name</label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={onChange}
            placeholder="e.g., Sudirman Residence Pool"
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Name for this liquidity pool</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Property Owner</label>
          <input
            type="text"
            name="propertyOwner"
            value={formData.propertyOwner}
            onChange={onChange}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Owner of the property</p>
        </div>
      </div>
    </div>
  );
}
