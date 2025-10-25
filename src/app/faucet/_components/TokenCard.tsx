import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { TokenType } from '@/hooks';

interface TokenCardProps {
  tokenType: TokenType;
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: string;
  onMint: (amount: string) => void;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  isCurrentToken: boolean;
}

export function TokenCard({
  tokenType,
  tokenName,
  tokenSymbol,
  tokenLogo,
  onMint,
  isPending,
  isConfirming,
  isSuccess,
  error,
  isCurrentToken,
}: TokenCardProps) {
  const [amount, setAmount] = useState('1000');

  const handleMint = () => {
    if (amount && parseFloat(amount) > 0) {
      onMint(amount);
    }
  };

  const isLoading = isCurrentToken && (isPending || isConfirming);
  const showSuccess = isCurrentToken && isSuccess;
  const showError = isCurrentToken && error;

  return (
    <div className="bg-[#111111] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
          <Image
            src={tokenLogo}
            alt={`${tokenSymbol} Logo`}
            width={48}
            height={48}
            className="object-contain w-full h-full"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{tokenName}</h3>
          <p className="text-sm text-gray-400">{tokenSymbol}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Amount to Mint
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="bg-black border-gray-800 text-white"
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => setAmount('1000')}
            variant="outline"
            className="flex-1 bg-black hover:bg-gray-800 text-white border-gray-800"
            disabled={isLoading}
          >
            1,000
          </Button>
          <Button
            onClick={() => setAmount('10000')}
            variant="outline"
            className="flex-1 bg-black hover:bg-gray-800 text-white border-gray-800"
            disabled={isLoading}
          >
            10,000
          </Button>
          <Button
            onClick={() => setAmount('100000')}
            variant="outline"
            className="flex-1 bg-black hover:bg-gray-800 text-white border-gray-800"
            disabled={isLoading}
          >
            100,000
          </Button>
        </div>

        <Button
          onClick={handleMint}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-white hover:bg-gray-200 text-black font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {isPending ? 'Confirming...' : 'Minting...'}
            </>
          ) : (
            `Mint ${tokenSymbol}`
          )}
        </Button>

        {showSuccess && (
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Successfully minted {amount} {tokenSymbol}!</span>
          </div>
        )}

        {showError && (
          <div className="flex items-center space-x-2 text-red-400 text-sm">
            <XCircle className="w-4 h-4" />
            <span>Error: {error.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
