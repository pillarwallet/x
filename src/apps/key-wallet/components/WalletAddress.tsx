import { useState } from 'react';
import { shortenAddress } from '../utils/blockchain';

interface WalletAddressProps {
  address: string;
}

const WalletAddress = ({ address }: WalletAddressProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <div className="w-full bg-white/5 rounded-2xl p-6 mb-6">
      <h2 className="text-sm text-white/60 mb-2">Your Key Wallet Address</h2>
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-mono text-white break-all">{address}</p>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 px-4 py-2 bg-purple_medium hover:bg-purple_light rounded-lg transition-colors text-sm font-medium"
          type="button"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-white/40 mt-3">
        Send assets to this address to receive them in your Key Wallet
      </p>
    </div>
  );
};

export default WalletAddress;

