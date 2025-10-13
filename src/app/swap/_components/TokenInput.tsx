import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

type TokenType = 'YRT' | 'USDC' | 'IDRX';

interface TokenInputProps {
  label: string;
  tokenType: TokenType;
  amount: string;
  onTokenChange: (value: TokenType) => void;
  onAmountChange: (value: string) => void;
  readOnly?: boolean;
  showSwapButton?: boolean;
  onSwap?: () => void;
  showApprovalWarning?: boolean;
  approvalTokens?: string[];
}

export function TokenInput({
  label,
  tokenType,
  amount,
  onTokenChange,
  onAmountChange,
  readOnly = false,
  showSwapButton = false,
  onSwap,
  showApprovalWarning = false,
  approvalTokens = []
}: TokenInputProps) {
  const tokenOptions = [
    { value: 'USDC' as TokenType, label: 'USDC', logo: '/Images/Logo/usdc-logo.png' },
    { value: 'IDRX' as TokenType, label: 'IDRX', logo: '/Images/Logo/idrx-logo.svg' },
    { value: 'YRT' as TokenType, label: 'YRT', logo: '/Images/Logo/logo_YRT.jpg' }
  ];

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          <TokenDropdown 
            value={tokenType}
            onChange={onTokenChange}
            options={tokenOptions}
          />
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.0"
          step="0.000001"
          min="0"
          readOnly={readOnly}
          className={`w-full px-4 py-4 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            readOnly ? 'cursor-not-allowed opacity-75' : ''
          }`}
          required={!readOnly}
        />
        {showApprovalWarning && approvalTokens.length > 0 && (
          <p className="text-xs text-yellow-400">
            ⚠️ Approval required: {approvalTokens.join(' & ')}
          </p>
        )}
      </div>

      {showSwapButton && onSwap && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={onSwap}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-800 p-2"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      )}
    </>
  );
}

interface TokenOption {
  value: TokenType;
  label: string;
  logo: string;
}

interface TokenDropdownProps {
  value: TokenType;
  onChange: (value: TokenType) => void;
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
        className="bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:outline-none flex items-center space-x-2"
      >
        <Image 
          src={selectedOption.logo} 
          alt={selectedOption.label} 
          width={16} 
          height={16}
          className="rounded-full"
        />
        <span>{selectedOption.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-lg z-10 min-w-[100px]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-white hover:bg-[#1A1A1A] flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
            >
              <Image 
                src={option.logo} 
                alt={option.label} 
                width={16} 
                height={16}
                className="rounded-full"
              />
              <span>{option.label}</span>
              {option.value === value && (
                <div className="ml-auto">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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