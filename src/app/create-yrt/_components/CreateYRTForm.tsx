import { Button } from '@/components/ui/button';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { Building, DollarSign, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface YRTFormData {
  name: string;
  symbol: string;
  propertyName: string;
  initialSupply: string;
  tokenPrice: string;
  underlyingToken: string;
  fundraisingDuration: number | '';
}

interface CreateYRTFormProps {
  formData: YRTFormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  hash?: `0x${string}`;
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
  address: string | undefined;
  isFormValid: () => boolean;
}

export function CreateYRTForm({
  formData,
  onSubmit,
  onInputChange,
  hash,
  isLoading,
  isSuccess,
  error,
  address,
  isFormValid
}: CreateYRTFormProps) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Building className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Token Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="e.g., YRT Sudirman"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={onInputChange}
                placeholder="e.g., YRT-SDR"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Property Name
            </label>
            <input
              type="text"
              name="propertyName"
              value={formData.propertyName}
              onChange={onInputChange}
              placeholder="e.g., Sudirman Residence"
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Image src="/Images/Logo/usdc-logo.png" alt="USDC" width={20} height={20} />
            <h3 className="text-lg font-semibold text-white">Economic Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Supply
              </label>
              <input
                type="number"
                name="initialSupply"
                value={formData.initialSupply}
                onChange={onInputChange}
                placeholder="0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for unlimited minting during sale periods</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Price (in underlying token)
              </label>
              <input
                type="number"
                name="tokenPrice"
                value={formData.tokenPrice}
                onChange={onInputChange}
                placeholder="1.0"
                step="0.000001"
                min="0"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Price per YRT token</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Underlying Token
              </label>
              <TokenDropdown 
                value={formData.underlyingToken}
                onChange={(value) => {
                  const event = {
                    target: {
                      name: 'underlyingToken',
                      value: value
                    }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onInputChange(event);
                }}
                options={[
                  { value: CONTRACTS.USDC, label: 'USDC', logo: '/Images/Logo/usdc-logo.png' },
                  { value: CONTRACTS.IDRX, label: 'IDRX', logo: '/Images/Logo/idrx-logo.svg' }
                ]}
              />
              <p className="text-xs text-gray-500 mt-1">Token used for purchases and yield distributions</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fundraising Duration (seconds)
              </label>
              <input
                type="number"
                name="fundraisingDuration"
                value={formData.fundraisingDuration || ''}
                onChange={onInputChange}
                placeholder="180"
                step="1"
                min="1"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Duration for token sale period (180s = 3 minutes demo)</p>
            </div>
          </div>
        </div>

        {(hash || error) && (
          <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
            {hash && (
              <>
                <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
                <p className="text-xs font-mono text-white break-all">{hash}</p>
              </>
            )}
            {isLoading && (
              <p className="text-sm text-gray-300 mt-2">⏳ Confirming transaction...</p>
            )}
            {isSuccess && (
              <p className="text-sm text-white mt-2">✅ YRT Series created successfully!</p>
            )}
            {error && (
              <p className="text-sm text-gray-300 mt-2">❌ Error: {error.message}</p>
            )}
          </div>
        )}

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isLoading || !address || !isFormValid()}
            className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Create YRT Series</span>
              </>
            )}
          </Button>
        </div>

        {!address && (
          <p className="text-center text-gray-300 text-sm">
            Please connect your wallet to create a YRT series
          </p>
        )}
      </form>
    </div>
  );
}

interface TokenOption {
  value: string;
  label: string;
  logo: string;
}

interface TokenDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: TokenOption[];
}

function TokenDropdown({ value, onChange, options }: TokenDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 pl-12 pr-10 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white focus:border-white focus:outline-none text-left flex items-center justify-between"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Image 
          src={selectedOption.logo} 
          alt={selectedOption.label} 
          width={20} 
          height={20} 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 pl-12 text-left text-white hover:bg-[#1A1A1A] flex items-center first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="absolute left-3">
                <Image 
                  src={option.logo} 
                  alt={option.label} 
                  width={20} 
                  height={20} 
                />
              </div>
              <span>{option.label}</span>
              {option.value === value && (
                <div className="ml-auto">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}