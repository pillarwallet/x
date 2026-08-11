import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Plus, X, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import {
  getAgentWallet,
  getImportedAccount,
} from '../lib/hyperliquid/keystore';
import { getMarkPrice, getUserState } from '../lib/hyperliquid/client';
import { useWalletClient, useAccount } from 'wagmi';
import { useHyperliquid } from '../hooks/useHyperliquid';
import { computeSizeUSD, roundToSzDecimals } from '../lib/hyperliquid/order';
import { TokenIcon } from './TokenIcon';
import {
  placeMarketOrderAgent,
  placeLimitOrderAgent,
  placeTriggerOrderAgent,
  updateLeverageAgent,
} from '../lib/hyperliquid/sdk';
import { parsePositionForSymbol } from '../lib/hyperliquid/parsers';
import { PasteStrategyButton } from './PasteStrategyButton';
import type { AssetInfo, UserState } from '../lib/hyperliquid/types';
import { BUILDER_ADDRESS, BUILDER_FEE_ORDER, BUILDER_FEE_APPROVAL } from '../lib/hyperliquid/builder';
import { approveBuilderFeeSDK } from '../lib/hyperliquid/sdk';

const tradeSchema = z
  .object({
    side: z.enum(['long', 'short']),
    entryPrice: z.number().positive().optional(),
    amountUSD: z
      .number()
      .positive()
      .min(10, { message: 'Amount must be at least 10 USDC' }),
    leverage: z.number().min(1).max(50),
    marginMode: z.enum(['cross', 'isolated']).default('cross'),
    stopLoss: z
      .object({
        price: z.number().nonnegative().optional(),
        distance: z.number().optional(),
      })
      .optional(),
    takeProfits: z
      .array(
        z.object({
          price: z.number().nonnegative(),
          ratio: z.number().min(0).max(100),
          distance: z.number().optional(),
        })
      )
      .optional(),
  })
  .refine((data) => {
    // Basic validation logic
    return true;
  });

type TradeFormData = z.infer<typeof tradeSchema>;

interface TradeFormProps {
  selectedAsset: EnhancedAsset | null;
  onTradeComplete?: () => void;
  onTickerChange?: (ticker: string) => void;
  prefilledData?: {
    side?: 'long' | 'short';
    entryPrice?: number;
    stopLoss?: number;
    takeProfits?: string;
  };
  userState?: UserState | null;
}

export function TradeForm({
  selectedAsset,
  onTradeComplete,
  onTickerChange,
  prefilledData,
  userState,
}: TradeFormProps) {
  const { address: masterAddress } = useHyperliquid();
  const { address: connectedAddress } = useAccount();
  const [isMarketOrder, setIsMarketOrder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [minUSD, setMinUSD] = useState<number | null>(null);
  const isStrategyPasteRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues, // Added getValues
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    mode: 'onChange',
    defaultValues: {
      side: 'long',
      amountUSD: 25,
      leverage: selectedAsset ? Math.floor(selectedAsset.maxLeverage / 2) : 1,
      marginMode: 'cross',
      takeProfits: [], // Initialize as empty array
      stopLoss: undefined,
    },
  });

  const {
    fields: tpFields,
    append: appendTp,
    remove: removeTp,
  } = useFieldArray({
    control,
    name: 'takeProfits',
  });

  const entryPrice = watch('entryPrice');
  const stopLoss = watch('stopLoss');
  const takeProfits = watch('takeProfits');
  const marginMode = watch('marginMode');

  // Helper to calculate distributed ratios
  const getDistributedRatios = (count: number) => {
    if (count <= 0) return [];
    const base = Math.floor(100 / count);
    const remainder = 100 % count;
    return Array(count)
      .fill(base)
      .map((val, i) => (i < remainder ? val + 1 : val));
  };

  // Handle adding TP with auto-redistribution
  const handleAddTp = () => {
    const newCount = tpFields.length + 1;
    const ratios = getDistributedRatios(newCount);

    // Convert existing fields to new ratios
    // We need to flush updates to existing fields first
    const currentValues = getValues('takeProfits') || [];
    const updatedValues = currentValues.map((tp, i) => ({
      ...tp,
      ratio: ratios[i],
    }));

    // Add new field with its calculated ratio
    updatedValues.push({
      price: 0,
      ratio: ratios[newCount - 1],
      distance: 0,
    });

    // Replace all with new values
    setValue('takeProfits', updatedValues);
  };

  // Handle removing TP with auto-redistribution
  const handleRemoveTp = (index: number) => {
    const currentValues = getValues('takeProfits') || [];
    const keptValues = currentValues.filter((_, i) => i !== index);

    if (keptValues.length > 0) {
      const ratios = getDistributedRatios(keptValues.length);
      const updatedValues = keptValues.map((tp, i) => ({
        ...tp,
        ratio: ratios[i],
      }));
      setValue('takeProfits', updatedValues);
    } else {
      setValue('takeProfits', []);
    }
  };

  // Helper to calculate distance from price (Absolute %)
  const calculateDistance = (targetPrice: number, currentEntry: number) => {
    if (!currentEntry) return 0;
    const dist = Math.abs((targetPrice - currentEntry) / currentEntry) * 100;
    return parseFloat(dist.toFixed(2));
  };

  // Helper to calculate price from distance
  const calculatePriceFromDistance = (
    distancePercent: number,
    currentEntry: number,
    isLong: boolean,
    isStopLoss: boolean
  ) => {
    if (!currentEntry) return 0;
    const change = (distancePercent / 100) * currentEntry;
    if (isStopLoss) {
      return isLong ? currentEntry - change : currentEntry + change;
    }
    return isLong ? currentEntry + change : currentEntry - change;
  };

  // Update leverage when asset changes if not set
  useEffect(() => {
    if (selectedAsset) {
      setValue('leverage', Math.floor(selectedAsset.maxLeverage / 2));
    }
  }, [selectedAsset, setValue]);

  const side = watch('side');
  const amountUSD = watch('amountUSD');
  const leverage = watch('leverage');

  // Fetch market price for minimum calculation
  useEffect(() => {
    if (selectedAsset && isMarketOrder) {
      getMarkPrice(selectedAsset.symbol).then((price) => {
        if (price) setMarketPrice(price);
      });
    } else if (selectedAsset && !isMarketOrder) {
      if (isStrategyPasteRef.current) {
        // Skip overwriting entry price if it came from a strategy paste
        isStrategyPasteRef.current = false;
      } else {
        // Pre-fill entry price with current asset price for Limit orders
        setValue('entryPrice', selectedAsset.price);
      }
    }
  }, [selectedAsset, isMarketOrder, setValue]);

  // Calculate minimum USD required
  useEffect(() => {
    if (!selectedAsset) return;

    const price = marketPrice || 1; // Use 1 as fallback for estimation
    const minSize = Math.pow(10, -selectedAsset.szDecimals);
    const minRequired = (minSize * price) / (leverage || 1);
    setMinUSD(minRequired);
  }, [selectedAsset, marketPrice, leverage]);

  // Apply prefilled data when it changes
  useEffect(() => {
    if (prefilledData) {
      if (prefilledData.side) {
        setValue('side', prefilledData.side);
      }
      const ep = prefilledData.entryPrice || entryPrice || 0;
      const isLong = (prefilledData.side || side) === 'long';

      if (prefilledData.entryPrice) {
        setValue('entryPrice', prefilledData.entryPrice);
        setIsMarketOrder(false);
      }
      if (prefilledData.stopLoss) {
        setValue('stopLoss', {
          price: prefilledData.stopLoss,
          distance: calculateDistance(prefilledData.stopLoss, ep),
        });
      }
      if (prefilledData.takeProfits) {
        const tps = prefilledData.takeProfits
          .split(',')
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        const ratio = tps.length > 0 ? Math.floor(100 / tps.length) : 0;
        setValue(
          'takeProfits',
          tps.map((p) => ({
            price: p,
            ratio: ratio,
            distance: calculateDistance(p, ep),
          }))
        );
      }
    }
  }, [prefilledData, setValue, entryPrice, side]);

  // Handle pasted strategy
  const handleStrategyPasted = (strategy: {
    ticker: string;
    side: 'long' | 'short';
    entryPrice: number;
    stopLoss: number;
    takeProfits: string;
  }) => {
    // Notify parent to switch ticker
    if (onTickerChange) {
      onTickerChange(strategy.ticker);
    }

    // Populate form fields
    setValue('side', strategy.side);
    setValue('entryPrice', strategy.entryPrice);

    // Transform SL
    if (strategy.stopLoss) {
      setValue('stopLoss', {
        price: strategy.stopLoss,
        distance: calculateDistance(
          strategy.stopLoss,
          strategy.entryPrice
        ),
      });
    }

    // Transform TP
    if (strategy.takeProfits) {
      const tps = strategy.takeProfits
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
      const baseRatio = tps.length > 0 ? Math.floor(100 / tps.length) : 0;
      const remainder = tps.length > 0 ? 100 - baseRatio * tps.length : 0;

      setValue(
        'takeProfits',
        tps.map((p, index) => ({
          price: p,
          ratio: index === 0 ? baseRatio + remainder : baseRatio,
          distance: calculateDistance(
            p,
            strategy.entryPrice
          ),
        }))
      );
    }

    // If we are currently in market mode, switching to limit mode will trigger the useEffect
    // that sets entry price. We need to flag this to avoid overwriting the strategy price.
    if (isMarketOrder || (selectedAsset && selectedAsset.symbol !== strategy.ticker)) {
      isStrategyPasteRef.current = true;
    }

    setIsMarketOrder(false); // Always use limit order for pasted strategies
  };

  // Check if amount is below minimum
  const isBelowMinimum = minUSD !== null && amountUSD > 0 && amountUSD < minUSD;

  // Verify position was opened after trade (check master wallet, not agent)
  const verifyPositionOpened = async (
    symbol: string,
    masterWalletAddress: string,
    maxAttempts = 5,
    delayMs = 1000
  ): Promise<boolean> => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      const state = await getUserState(masterWalletAddress);
      if (!state) continue;

      const position = parsePositionForSymbol(state, symbol);
      if (position && position.size > 0) {
        return true; // Position found!
      }
    }
    return false; // Position not found after all attempts
  };

  const onSubmit = async (data: TradeFormData) => {
    console.log('Form submitted with data:', data);
    const toastId = toast.loading('Placing order...');

    if (!selectedAsset) {
      toast.error('Please select an asset', { id: toastId });
      return;
    }

    if (!masterAddress) {
      toast.error('Please connect your wallet', { id: toastId });
      return;
    }

    let privateKey: string | undefined;
    let signingAddress: string | undefined = masterAddress;

    // 1. Check for Imported Account (Priority)
    // Only use imported account if it's unlocked and available
    const imported = getImportedAccount();

    console.log('[TradeForm] Wallet Selection Debug:', {
      hasImportedKey: !!imported,
      masterAddress,
      connectedAddress
    });

    if (imported) {
      // Unlocked and ready
      privateKey = imported.privateKey;
      signingAddress = imported.accountAddress;
      console.log('DEBUG: Using imported account', { signingAddress });
    }
    // 2. Fallback to Agent Wallet linked to connected wallet
    else {
      console.log('DEBUG: Fallback to agent wallet');
      const agent = await getAgentWallet(masterAddress);
      if (agent?.approved) {
        if (!agent.builderApproved) {
          toast.error('PillarX Approval Required', {
            description: 'Please go to Settings > Perps Account and approve PillarX to start trading.',
            duration: 5000,
          });
          setIsSubmitting(false); // Reset loading state
          return;
        }
        privateKey = agent.privateKey;
        signingAddress = masterAddress; // Agent trades on behalf of master
      }
    }

    if (!privateKey) {
      console.log('DEBUG: No private key found');
      toast.error(
        'No active signing wallet found. Please create an agent or import an account.',
        { id: toastId }
      );
      return;
    }

    // Only apply builder fee if the signing address matches the connected wallet (Master)
    // If using an imported account that is different from the connected wallet, we cannot approve the builder fee
    // because the connected wallet (Master) cannot sign for the imported account.
    const useBuilderFee = signingAddress === masterAddress;

    setIsSubmitting(true);
    try {
      // Get entry price
      let entryPrice = data.entryPrice;
      if (isMarketOrder || !entryPrice) {
        // toast.info('Fetching market price...');
        entryPrice = await getMarkPrice(selectedAsset.symbol);
        if (!entryPrice) {
          throw new Error('Failed to fetch market price');
        }
      }

      // Calculate size
      const size = computeSizeUSD(
        data.amountUSD,
        data.leverage,
        entryPrice,
        selectedAsset.szDecimals
      );

      if (size <= 0) {
        const minSize = Math.pow(10, -selectedAsset.szDecimals);
        const minRequired = (minSize * entryPrice) / data.leverage;
        toast.error(`Amount too small for ${selectedAsset.symbol}`, {
          id: toastId,
          description: `Minimum required: $${minRequired.toFixed(2)} at ${data.leverage}x leverage`,
        });
        return;
      }

      // Update leverage and margin mode before placing orders
      try {
        await updateLeverageAgent(privateKey as `0x${string}`, {
          coinId: selectedAsset.id,
          leverage: data.leverage,
          isCross: data.marginMode === 'cross',
        });
        console.log(
          `[TradeForm] Updated leverage: ${data.leverage}x ${data.marginMode}`
        );
      } catch (leverageError: any) {
        console.error('[TradeForm] Failed to update leverage:', leverageError);

        const errorMessage = leverageError.message || '';
        if (errorMessage.includes('does not exist')) {
          toast.error('Account not initialized', {
            id: toastId,
            description: 'Please deposit funds into your Hyperliquid account first to enable trading features.',
            duration: 5000,
          });
        } else {
          toast.error('Failed to set leverage/margin mode', {
            id: toastId,
            description: errorMessage || 'Please try again',
          });
        }
        return;
      }

      // Place entry order via SDK
      // toast.info('Placing entry order...');

      // Determine builder fee parameters
      // 1. We are NOT using an imported account (i.e. we are using the Agent)
      // 2. The signing address matches the master address (Agent Flow)
      // If we are using an imported account, we NEVER apply builder fees for now to avoid the "approve" loop issue.
      // Even if imported address match master, we treat it as "User Trading" not "Agent Trading".
      const useBuilderFee = !imported && (signingAddress === masterAddress);

      console.log('[TradeForm] Builder Fee Debug:', {
        masterAddress,
        signingAddress,
        useBuilderFee,
        isImported: !!imported
      });


      if (isMarketOrder) {
        await placeMarketOrderAgent(privateKey as `0x${string}`, {
          coinId: selectedAsset.id,
          isBuy: data.side === 'long',
          size,
          currentPrice: entryPrice,
          builder: useBuilderFee ? { b: BUILDER_ADDRESS, f: BUILDER_FEE_ORDER } : undefined,
        });
      } else {
        await placeLimitOrderAgent(privateKey as `0x${string}`, {
          coinId: selectedAsset.id,
          isBuy: data.side === 'long',
          size,
          limitPrice: entryPrice,
          reduceOnly: false,
          builder: useBuilderFee ? { b: BUILDER_ADDRESS, f: BUILDER_FEE_ORDER } : undefined,
        });
      }

      // Place stop loss if provided
      if (data.stopLoss && data.stopLoss.price) {
        // toast.info('Placing stop loss...');

        // Calculate limit price with slippage buffer
        // For Long: SL triggers below entry, so limit should be even lower (0.99x)
        // For Short: SL triggers above entry, so limit should be even higher (1.01x)
        const slLimitPrice =
          data.side === 'long'
            ? data.stopLoss.price * 0.99
            : data.stopLoss.price * 1.01;

        await placeTriggerOrderAgent(privateKey as `0x${string}`, {
          coinId: selectedAsset.id,
          isBuy: data.side === 'short', // Opposite side for reduce-only
          size,
          triggerPrice: data.stopLoss.price,
          limitPrice: slLimitPrice,
          tpsl: 'sl',
          reduceOnly: true,
          builder: useBuilderFee ? { b: BUILDER_ADDRESS, f: BUILDER_FEE_ORDER } : undefined,
        });
      }

      // Place take profits if provided
      if (data.takeProfits && data.takeProfits.length > 0) {
        const tps = data.takeProfits;

        // Validate total ratio
        const totalRatio = tps.reduce((sum, tp) => sum + (tp.ratio || 0), 0);
        if (Math.abs(totalRatio - 100) > 0.1) {
          toast.error(
            `Total Take Profit ratio must be 100% (Currently: ${totalRatio.toFixed(0)}%)`,
            { id: toastId }
          );
          setIsSubmitting(false);
          return;
        }

        for (let i = 0; i < tps.length; i++) {
          const tp = tps[i];
          if (!tp.price || !tp.ratio) continue;

          // toast.info(`Placing take profit ${i + 1}/${tps.length}...`);

          const rawTpSize = size * (tp.ratio / 100);
          const tpSize = roundToSzDecimals(rawTpSize, selectedAsset.szDecimals);

          if (tpSize <= 0) continue;

          // Calculate limit price with slippage buffer
          // For Long: TP triggers above entry, so limit should be slightly lower (1.01x is generous)
          // For Short: TP triggers below entry, so limit should be slightly higher (0.99x)
          const tpLimitPrice =
            data.side === 'long' ? tp.price * 0.99 : tp.price * 1.01;

          await placeTriggerOrderAgent(privateKey as `0x${string}`, {
            coinId: selectedAsset.id,
            isBuy: data.side === 'short', // Opposite side for reduce-only
            size: tpSize,
            triggerPrice: tp.price,
            limitPrice: tpLimitPrice,
            tpsl: 'tp',
            reduceOnly: true,
            builder: useBuilderFee ? { b: BUILDER_ADDRESS, f: BUILDER_FEE_ORDER } : undefined,
          });
        }
      }

      toast.success('Trade placed successfully!', {
        id: toastId,
        description: `${data.side.toUpperCase()} ${size} ${selectedAsset.symbol}`,
      });

      // Verify position was opened (check signing wallet)
      if (signingAddress) {
        toast.info('Verifying position...', { id: 'verify-position' });

        const positionOpened = await verifyPositionOpened(
          selectedAsset.symbol,
          signingAddress
        );

        if (positionOpened) {
          toast.success('Position confirmed on exchange', {
            id: 'verify-position',
          });
          onTradeComplete?.();
        } else {
          toast.warning('Position not found on exchange', {
            id: 'verify-position',
            description:
              'The order was submitted but position is not visible yet. Check your orders manually.',
            duration: 8000,
          });
          onTradeComplete?.(); // Still call this to refresh UI
        }
      } else {
        onTradeComplete?.(); // No signing address, still refresh
      }
    } catch (error: any) {
      console.error('Trade error:', error);

      // Handle "Builder fee has not been approved"
      // We only attempt to auto-approve if we are using an Imported Account AND it matches the signing address.
      // If we are using Agent (fallback), we cannot auto-approve because we don't have the Master key.
      if (
        useBuilderFee &&
        (error?.message?.includes('Builder fee has not been approved') ||
          error?.response?.data?.includes('Builder fee has not been approved'))
      ) {
        // If useBuilderFee is true, it means signingAddress === masterAddress

        // Check if we are using an imported account that effectively IS the master
        const imported = getImportedAccount();
        if (imported && imported.accountAddress.toLowerCase() === masterAddress?.toLowerCase()) {
          try {
            toast.info('Approving Builder Fee...', {
              id: toastId,
              description: 'One-time approval required for trading.',
            });

            await approveBuilderFeeSDK(
              imported.privateKey,
              BUILDER_ADDRESS,
              BUILDER_FEE_APPROVAL
            );

            toast.success('Builder Fee Approved!', {
              id: toastId,
              description: 'Please try placing your order again.',
              duration: 5000,
            });
            return; // Exit without showing generic error
          } catch (approvalError: any) {
            console.error('Failed to auto-approve builder fee:', approvalError);
            toast.error('Failed to approve builder fee', {
              id: toastId,
              description: approvalError.message,
            });
            return;
          }
        } else {
          // We are using Agent (or Master Wallet via some other means) but don't have the private key to approve.
          toast.error('Builder Fee Not Approved', {
            id: toastId,
            description: 'Please go to Settings > Perps Account and approve PillarX.',
            duration: 5000
          });
          return;
        }
      }


      toast.error(error.message || 'Failed to place trade', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedAsset) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Select an asset to start trading
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error('Form Validation Errors:', errors);
          toast.error('Form validation failed', {
            description: Object.values(errors)
              .map((e) => e?.message)
              .join(', '),
          });
        })}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedAsset && (
                <TokenIcon symbol={selectedAsset.symbol} size={24} />
              )}
              <h3 className="text-lg font-semibold">
                Trade {selectedAsset ? selectedAsset.symbol : ''}
              </h3>
            </div>
            <PasteStrategyButton onStrategyPasted={handleStrategyPasted} />
          </div>

          {/* Trade Configuration Dropdowns */}
          <div className="flex items-center justify-between bg-card/50 -mx-6 px-6 py-1.5 border-y border-border/50">
            {/* Order Type Dropdown */}
            <Select
              value={isMarketOrder ? 'market' : 'limit'}
              onValueChange={(v) => setIsMarketOrder(v === 'market')}
            >
              <SelectTrigger className="w-auto border-0 bg-transparent p-0 h-auto text-sm font-medium focus:ring-0 px-0 hover:bg-transparent data-[state=open]:bg-transparent gap-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>

            {/* Margin Mode Dropdown */}
            <Select
              value={marginMode}
              onValueChange={(v) =>
                setValue('marginMode', v as 'cross' | 'isolated')
              }
            >
              <SelectTrigger className="w-auto border-0 bg-transparent p-0 h-auto text-sm font-medium focus:ring-0 px-0 hover:bg-transparent data-[state=open]:bg-transparent gap-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cross">Cross</SelectItem>
                <SelectItem value="isolated">Isolated</SelectItem>
              </SelectContent>
            </Select>

            {/* Leverage Dropdown */}
            <Select
              value={leverage.toString()}
              onValueChange={(v) => setValue('leverage', parseInt(v))}
            >
              <SelectTrigger className="w-auto border-0 bg-transparent p-0 h-auto text-sm font-medium focus:ring-0 px-0 hover:bg-transparent data-[state=open]:bg-transparent gap-2">
                <SelectValue>{leverage}x</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[2, 5, 10, 20, 50, selectedAsset.maxLeverage]
                  .filter(
                    (v, i, a) =>
                      v <= selectedAsset.maxLeverage && a.indexOf(v) === i
                  )
                  .sort((a, b) => a - b)
                  .map((lev) => (
                    <SelectItem key={lev} value={lev.toString()}>
                      {lev}x
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mt-1">
            <Button
              type="button"
              variant={side === 'long' ? 'default' : 'outline'}
              className={`flex-1 ${side === 'long' ? 'bg-green-500 hover:bg-green-600' : ''}`}
              onClick={() => setValue('side', 'long')}
            >
              Long
            </Button>
            <Button
              type="button"
              variant={side === 'short' ? 'default' : 'outline'}
              className={`flex-1 ${side === 'short' ? 'bg-red-500 hover:bg-red-600' : ''}`}
              onClick={() => setValue('side', 'short')}
            >
              Short
            </Button>
          </div>
          <input type="hidden" {...register('side')} />
        </div>

        {/* Removed Market Order Toggle - handled by Dropdown */}

        {/* Available to Trade Label */}
        {/* Available to Trade Label */}
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Avail. to Trade</span>
          <span className="text-foreground font-mono-numbers">
            {userState?.marginSummary
              ? `$${(
                parseFloat(userState.marginSummary.accountValue) -
                parseFloat(userState.marginSummary.totalMarginUsed)
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USDC`
              : '0.00 USDC'}
          </span>
        </div>

        {!isMarketOrder && (
          <div className="relative flex items-center w-full rounded-md border border-input bg-background/50">
            <div className="pl-3 text-sm text-muted-foreground whitespace-nowrap">
              Price (USDC)
            </div>
            <Input
              id="entryPrice"
              type="number"
              step="any"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-right pr-2 [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
              {...register('entryPrice', {
                setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
              })}
            />
            <button
              type="button"
              className="pr-3 text-sm text-white font-medium hover:text-white/80 transition-colors"
              onClick={async () => {
                if (selectedAsset) {
                  const price = await getMarkPrice(selectedAsset.symbol);
                  if (price) {
                    setValue('entryPrice', price);
                  } else {
                    setValue('entryPrice', selectedAsset.price);
                  }
                }
              }}
            >
              Mid
            </button>
          </div>
        )}
        {errors.entryPrice && !isMarketOrder && (
          <p className="text-xs text-destructive mt-1">
            {errors.entryPrice.message}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="space-y-3">
            {/* Size Input Row */}
            <div
              className={`relative flex items-center w-full rounded-md border bg-background/50 ${errors.amountUSD ? 'border-destructive' : 'border-input'}`}
            >
              <div className="pl-3 text-sm text-muted-foreground whitespace-nowrap">
                Size
              </div>
              <Input
                id="amountUSD"
                type="number"
                step="any"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-right pr-2 [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
                {...register('amountUSD', { valueAsNumber: true })}
              />
              <div className="pr-3 flex items-center gap-1">
                <span className="text-sm font-medium">USDC</span>
              </div>
            </div>

            {/* Slider and Percentage Display */}
            <div className="flex items-center gap-4 pt-2 px-1">
              <div className="flex-1">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[
                    (() => {
                      if (!userState?.marginSummary) return 0;
                      const availableMargin =
                        parseFloat(userState.marginSummary.accountValue) -
                        parseFloat(userState.marginSummary.totalMarginUsed);

                      const maxBuyingPower = availableMargin * (leverage || 1);
                      if (maxBuyingPower <= 0) return 0;

                      return Math.min((amountUSD / maxBuyingPower) * 100, 100);
                    })(),
                  ]}
                  onValueChange={(vals) => {
                    if (!userState?.marginSummary) return;
                    const percentage = vals[0];
                    const availableMargin =
                      parseFloat(userState.marginSummary.accountValue) -
                      parseFloat(userState.marginSummary.totalMarginUsed);

                    if (availableMargin > 0) {
                      const maxBuyingPower = availableMargin * (leverage || 1);
                      const newAmount = (maxBuyingPower * percentage) / 100;
                      setValue('amountUSD', parseFloat(newAmount.toFixed(2)));
                    }
                  }}
                />
              </div>

              {/* Percentage Box */}
              <div className="flex items-center justify-center w-[80px] h-[28px] rounded-lg border border-[#2d3748] bg-[#1a202c]">
                <span className="text-sm font-medium">
                  {(() => {
                    if (!userState?.marginSummary) return 0;
                    const availableMargin =
                      parseFloat(userState.marginSummary.accountValue) -
                      parseFloat(userState.marginSummary.totalMarginUsed);

                    const maxBuyingPower = availableMargin * (leverage || 1);
                    const currentPercent =
                      maxBuyingPower > 0
                        ? (amountUSD / maxBuyingPower) * 100
                        : 0;
                    return Math.round(Math.min(currentPercent, 100));
                  })()}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          {/* Leverage Input Section Removed - Handled by Dropdown */}
          <input type="hidden" {...register('leverage')} />
        </div>

        {/* Stop Loss Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Stop Loss</Label>
            {!stopLoss?.price && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setValue('stopLoss', { price: 0, distance: 0 });
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {stopLoss && (
            <div className="flex gap-3 items-center">
              <div className="relative flex-1 flex items-center rounded-md border border-input bg-background/50">
                <span className="pl-3 text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
                  Price
                </span>
                <Input
                  type="number"
                  step="any"
                  className="border-0 bg-transparent text-right pr-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0.00"
                  {...register('stopLoss.price', { valueAsNumber: true })}
                  onFocus={(e) => {
                    if (e.target.value === '0') {
                      e.target.value = '';
                    }
                  }}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setValue('stopLoss.price', val);
                      const refPrice =
                        entryPrice || marketPrice || selectedAsset?.price || 0;
                      const dist = calculateDistance(val, refPrice);
                      setValue(
                        'stopLoss.distance',
                        parseFloat(dist.toFixed(2))
                      );
                    }
                  }}
                />
              </div>
              <div className="relative w-[110px] flex items-center rounded-md border border-input bg-background/50">
                <Input
                  type="number"
                  step="0.01"
                  className="border-0 bg-transparent text-right pr-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0"
                  {...register('stopLoss.distance', { valueAsNumber: true })}
                  onFocus={(e) => {
                    if (e.target.value === '0') {
                      e.target.value = '';
                    }
                  }}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setValue('stopLoss.distance', val);
                      console.log('DEBUG: SL Distance Change', {
                        val,
                        entryPrice,
                        marketPrice,
                        selectedAssetPrice: selectedAsset?.price,
                        side,
                      });
                      const refPrice =
                        entryPrice || marketPrice || selectedAsset?.price || 0;
                      const price = calculatePriceFromDistance(
                        val,
                        refPrice,
                        side === 'long',
                        true
                      );
                      setValue('stopLoss.price', parseFloat(price.toFixed(2)));
                    }
                  }}
                />
                <span className="pr-3 text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
                  %
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => setValue('stopLoss', undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Take Profits Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Take Profit</Label>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={handleAddTp}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {tpFields.length > 0 && (
            <div className="grid grid-cols-[1fr_70px_80px_24px] gap-2 px-1 text-xs text-muted-foreground">
              <div>Target Price</div>
              <div>Ratio</div>
              <div>Distance</div>
              <div></div>
            </div>
          )}

          <div className="space-y-2">
            {tpFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_70px_90px_24px] gap-2 items-center"
              >
                {/* Price Input */}
                <div className="flex items-center rounded-md border border-input bg-background/50">
                  <Input
                    type="number"
                    step="any"
                    className="border-0 bg-transparent px-3 py-1 text-[16px] md:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                    placeholder="Price"
                    {...register(`takeProfits.${index}.price` as const, {
                      valueAsNumber: true,
                    })}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setValue(`takeProfits.${index}.price`, val);
                        const refPrice =
                          entryPrice ||
                          marketPrice ||
                          selectedAsset?.price ||
                          0;
                        const dist = calculateDistance(val, refPrice);
                        setValue(
                          `takeProfits.${index}.distance`,
                          parseFloat(dist.toFixed(2))
                        );
                      }
                    }}
                  />
                </div>

                {/* Ratio Input */}
                <div className="flex items-center rounded-md border border-input bg-background/50">
                  <Input
                    type="number"
                    className="border-0 bg-transparent text-right pr-1 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 w-full"
                    placeholder="20"
                    {...register(`takeProfits.${index}.ratio` as const, {
                      valueAsNumber: true,
                    })}
                  />
                  <span className="pr-2 text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
                    %
                  </span>
                </div>

                {/* Distance Input */}
                <div className="flex items-center rounded-md border border-input bg-background/50">
                  <Input
                    type="number"
                    step="0.01"
                    className="border-0 bg-transparent text-right pr-1 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 w-full"
                    placeholder="0"
                    {...register(`takeProfits.${index}.distance` as const, {
                      valueAsNumber: true,
                    })}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        e.target.value = '';
                      }
                    }}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setValue(`takeProfits.${index}.distance`, val);
                        const refPrice =
                          entryPrice ||
                          marketPrice ||
                          selectedAsset?.price ||
                          0;
                        const price = calculatePriceFromDistance(
                          val,
                          refPrice,
                          side === 'long',
                          false
                        );
                        setValue(
                          `takeProfits.${index}.price`,
                          parseFloat(price.toFixed(2))
                        );
                      }
                    }}
                  />
                  <span className="pr-2 text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
                    %
                  </span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveTp(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Total Ratio Warning */}
            {(() => {
              const currentTps = watch('takeProfits') || [];
              if (currentTps.length > 0) {
                const totalRatio = currentTps.reduce(
                  (sum, tp) => sum + (tp.ratio || 0),
                  0
                );
                if (Math.abs(totalRatio - 100) > 0.1) {
                  return (
                    <div className="text-xs text-destructive px-1">
                      Total ratio must be 100% (Currently:{' '}
                      {totalRatio.toFixed(0)}%)
                    </div>
                  );
                }
              }
              return null;
            })()}
          </div>
        </div>

        {(errors.amountUSD || (isBelowMinimum && minUSD)) && (
          <div className="hidden" /> // Keeping logical check but hiding element as we move to button
        )}

        {/* Debug logging */}
        {(() => {
          console.log('[TradeForm] Button state:', {
            isSubmitting,
            'errors.amountUSD': errors.amountUSD,
            isBelowMinimum,
            minUSD,
            amountUSD,
            disabled: isSubmitting || !!errors.amountUSD || isBelowMinimum,
          });
          return null;
        })()}

        <Button
          type="submit"
          disabled={isSubmitting || !!errors.amountUSD || isBelowMinimum}
          onClick={(e) => {
            console.log('[TradeForm] Submit button clicked event', {
              disabled: isSubmitting || !!errors.amountUSD || isBelowMinimum,
              defaultPrevented: e.defaultPrevented,
            });
          }}
          className={`w-full ${errors.amountUSD || isBelowMinimum
            ? 'bg-muted text-muted-foreground hover:bg-muted'
            : side === 'long'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
        >
          {errors.amountUSD?.message ||
            (isBelowMinimum && minUSD
              ? `Minimum size: $${minUSD.toFixed(2)}`
              : isSubmitting
                ? 'Placing Trade...'
                : `Place ${side === 'long' ? 'Long' : 'Short'} Order`)}
        </Button>
      </form>
    </Card>
  );
}
