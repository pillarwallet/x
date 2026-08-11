import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowDownUp, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { checkUSDCBalance } from '../lib/hyperliquid/bridge';
import useTransactionKit from '../../../hooks/useTransactionKit';
import { useHyperliquid } from '../hooks/useHyperliquid';
import { erc20Abi, parseUnits } from 'viem';
import { cn } from '../lib/utils';

// Contract addresses
const USDC_CONTRACT_ADDRESS =
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as const;
const BRIDGE_CONTRACT_ADDRESS =
  '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7' as const;

interface DepositModalProps {
  userState: any;
  targetAddress?: string;
  trigger?: React.ReactNode;
  disabled?: boolean;
  ethPrice?: number;
}

export function DepositModal({
  userState,
  targetAddress,
  trigger,
  disabled,
  ethPrice,
}: DepositModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [arbitrumBalance, setArbitrumBalance] = useState<string | null>(null);
  const [arbitrumEthBalance, setArbitrumEthBalance] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { kit, walletProvider } = useTransactionKit();
  const { address, walletClient } = useHyperliquid();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const isAddressMatch =
    !targetAddress ||
    !address ||
    targetAddress.toLowerCase() === address.toLowerCase();

  const checkNetwork = async () => {
    if (walletProvider && 'request' in walletProvider) {
      try {
        // @ts-ignore
        const chainId = await walletProvider.request({ method: 'eth_chainId' });
        // Arbitrum One is 0xa4b1 (42161)
        setIsWrongNetwork(chainId !== '0xa4b1');
      } catch (e) {
        console.warn('Failed to check network', e);
      }
    }
  };
  // ... checkNetwork ...

  const switchToArbitrum = async () => {
    if (!walletProvider || !('request' in walletProvider)) return;

    try {
      // @ts-ignore
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }],
      });
      setIsWrongNetwork(false);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          // @ts-ignore
          await walletProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xa4b1',
                chainName: 'Arbitrum One',
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://arbiscan.io'],
              },
            ],
          });
          setIsWrongNetwork(false);
        } catch (addError) {
          console.error('Failed to add Arbitrum network', addError);
        }
      } else {
        console.error('Failed to switch to Arbitrum', switchError);
      }
    }
  };

  const fetchArbitrumBalance = async () => {
    if (!address || !kit) return;
    try {
      if (!walletProvider) return;
      const provider = new ethers.providers.Web3Provider(walletProvider as any);

      const balance = await checkUSDCBalance(address, provider);
      setArbitrumBalance(balance);

      const ethBal = await provider.getBalance(address);
      setArbitrumEthBalance(ethers.utils.formatEther(ethBal));
    } catch (error) {
      console.warn('Failed to fetch Arbitrum balance', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      checkNetwork();
      fetchArbitrumBalance();
      setTxHash(null);
    }
  };

  // Check network periodically or on provider change
  useEffect(() => {
    if (open) {
      checkNetwork();
      if (!isWrongNetwork) {
        fetchArbitrumBalance();
      }
    }
  }, [open, walletProvider, isWrongNetwork]);

  const handleMaxClick = () => {
    if (arbitrumBalance) {
      setAmount(arbitrumBalance);
    }
  };

  const handleDeposit = async () => {
    if (isWrongNetwork) {
      await switchToArbitrum();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Invalid Amount', {
        description: 'Please enter a valid amount',
      });
      return;
    }
    // ... existing validation ...
    // Check min deposit of 5 USDC for ALL deposits
    if (parseFloat(amount) < 5) {
      toast.error('Amount Too Low', {
        description: 'Minimum deposit is 5 USDC',
      });
      return;
    }

    if (!address || !walletClient) {
      toast.error('Wallet Not Connected', {
        description: 'Please connect your wallet',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Re-check network just in case
      if (walletProvider && 'request' in walletProvider) {
        // @ts-ignore
        const chainId = await walletProvider.request({ method: 'eth_chainId' });
        if (chainId !== '0xa4b1') {
          await switchToArbitrum();
          // If switch failed or user cancelled, stop
          // NOTE: switchToArbitrum handles errors but we need to check execution
          // @ts-ignore
          const newChainId = await walletProvider.request({ method: 'eth_chainId' });
          if (newChainId !== '0xa4b1') {
            setIsLoading(false);
            return;
          }
        }
      }

      // Check ETH Balance for gas
      try {
        if (walletProvider) {
          const provider = new ethers.providers.Web3Provider(
            walletProvider as any
          );
          const ethBalance = await provider.getBalance(address);
          if (ethBalance.lt(ethers.utils.parseEther('0.0001'))) {
            toast.error('Insufficient ETH', {
              description: 'You need ETH on Arbitrum for gas fees.',
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to check ETH balance:', e);
      }

      const amountInWei = parseUnits(amount, 6);

      // Transfer USDC directly to bridge contract using viem walletClient
      toast.info('Confirming Transaction', {
        description: 'Please sign the transfer transaction in your wallet...',
      });

      const txHash = await walletClient.writeContract({
        account: address as `0x${string}`,
        address: USDC_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [BRIDGE_CONTRACT_ADDRESS as `0x${string}`, amountInWei],
      });

      if (txHash) {
        toast.success('Success!', {
          description: `Bridging ${amount} USDC. It will arrive in 5-10 minutes.`,
          action: {
            label: 'View on Arbiscan',
            onClick: () => window.open(`https://arbiscan.io/tx/${txHash}`, '_blank'),
          },
        });
        setOpen(false);
        setTxHash(null);
        setAmount('');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Bridge error:', error);
      toast.error('Bridge Failed', {
        description: error.message || 'Failed to bridge USDC',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up float for display
  const ethDisplay = arbitrumEthBalance ? parseFloat(arbitrumEthBalance).toFixed(4) : '0';

  const isLowEth = arbitrumEthBalance && parseFloat(arbitrumEthBalance) < 0.0001;

  const currentBalance = userState?.marginSummary?.accountValue || '0';
  // ...
  <p className="text-[10px] text-muted-foreground">
    Min: 0.0001 ETH
  </p>

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" disabled={disabled}>
            <ArrowDownUp className="h-4 w-4 mr-2" />
            Deposit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit USDC</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!isAddressMatch && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <div>
                <strong>Wallet Mismatch</strong>
                <p className="mt-1">
                  You are connected with {address?.slice(0, 6)}... but trying to
                  deposit to {targetAddress?.slice(0, 6)}...
                  <br />
                  Please switch your wallet to the correct account to deposit
                  defined funds.
                </p>
              </div>
            </div>
          )}

          {isWrongNetwork && (
            <div className="bg-yellow-500/15 text-yellow-500 text-sm p-3 rounded-md flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <div className="flex-1">
                <strong>Wrong Network</strong>
                <p className="mt-1">
                  You are not on Arbitrum One. Please switch networks to deposit.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 h-7 border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-500"
                  onClick={switchToArbitrum}
                >
                  Switch to Arbitrum
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Current Hyperliquid Balance
            </Label>
            <p className="text-2xl font-bold">
              ${parseFloat(currentBalance).toFixed(2)}
            </p>
          </div>

          {/* ... Balance Section ... */}
          {arbitrumBalance !== null && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Arbitrum USDC Balance
                </Label>
                <p className="text-lg font-semibold">
                  {parseFloat(arbitrumBalance).toFixed(2)} USDC
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Arbitrum ETH Balance
                </Label>
                <div className="text-right">
                  <p className={cn("text-sm font-semibold", isLowEth ? "text-destructive" : "")}>
                    {ethDisplay} ETH

                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Min: 0.0001 ETH
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                disabled={!arbitrumBalance}
                className="h-6 text-xs"
              >
                Max
              </Button>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading || isWrongNetwork}
              step="0.01"
            />
          </div>

          <div className="rounded-lg bg-muted p-3 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">NOTE:</span>
              <span className="text-muted-foreground">Min deposit is $5</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Network:</span>
              <span className="text-muted-foreground">Arbitrum One</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Estimated Time:</span>
              <span className="text-muted-foreground">5-10 minutes</span>
            </div>
          </div>

          <Button
            onClick={isWrongNetwork ? switchToArbitrum : handleDeposit}
            disabled={
              isLoading || (!isWrongNetwork && (!amount || parseFloat(amount) <= 0 || !isAddressMatch))
            }
            className="w-full"
            variant={isWrongNetwork ? "secondary" : "default"}
          >
            {isLoading
              ? 'Processing...'
              : isWrongNetwork
                ? 'Switch to Arbitrum'
                : 'Bridge USDC'
            }
          </Button>

          {txHash && (
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <span className="text-sm">Transaction submitted</span>
              <a
                href={`https://arbiscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View on Arbiscan
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
