import { ChangeEvent, useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
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
        <h3 className="text-lg font-semibold text-white">Token Pair</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">YRT Token Address</label>
          <input
            type="text"
            name="tokenA"
            value={formData.tokenA}
            onChange={onChange}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Contract address of YRT Token</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Token B Address</label>
          <TokenDropdown 
            value={formData.tokenB}
            onChange={(value) => {
              const event = {
                target: {
                  name: 'tokenB',
                  value: value
                }
              } as React.ChangeEvent<HTMLSelectElement>;
              onChange(event);
            }}
            options={[
              { value: CONTRACTS.USDC, label: 'USDC', logo: '/Images/Logo/usdc-logo.png' },
              { value: CONTRACTS.IDRX, label: 'IDRX', logo: '/Images/Logo/idrx-logo.svg' }
            ]}
          />
        </div>
      </div>
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
