// services
import { RelayRequest } from '../services/relayApi';
import { fetchRelayRequestByHash } from '../services/relayApiAsync';

// types
import {
  MobulaTransactionRow,
  PnLMetrics,
  ReconstructedTrade,
} from '../types/api';

// constants
import { allStableCurrencies } from '../apps/pulse/constants/tokens';

// Pre-compute normalized USDC addresses across all chains for efficient O(1) lookup
const USDC_ADDRESSES = allStableCurrencies.map(
  (currency: { chainId: number; address: string }) =>
    currency.address.toLowerCase()
);

/**
 * Retrieve USDC token decimals for a given chain, defaults to 6 (standard ERC20 decimals)
 * if the token is not found in our supported currencies list.
 */
const getUSDCDecimalsByChainId = (chainId: number): number => {
  const usdcToken = allStableCurrencies.find(
    (currency: { chainId: number; address: string; decimals: number }) =>
      currency.chainId === chainId
  ) as { chainId: number; address: string; decimals: number } | undefined;
  return usdcToken?.decimals ?? 6; // Most USDC deployments use 6 decimals
};

export const reconstructTrades = (
  transactions: MobulaTransactionRow[],
  walletAddress: string
): ReconstructedTrade[] => {
  const trades: ReconstructedTrade[] = [];
  const groupedByTxHash: { [txHash: string]: MobulaTransactionRow[] } = {};

  // Deduplicate identical transactions from Mobula API
  // The API may return duplicate transfer events for the same transaction
  // We identify duplicates by matching: hash, sender, receiver, amount, and token symbol
  const uniqueTransactions = transactions.filter(
    (tx, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          (t.tx_hash || t.hash) === (tx.tx_hash || tx.hash) &&
          t.from === tx.from &&
          t.to === tx.to &&
          t.amount === tx.amount &&
          t.asset.symbol === tx.asset.symbol
      )
  );

  // Group transfer events by their transaction hash
  // A single blockchain transaction often contains multiple transfer events
  // (e.g., swap: ERC20 token transfer, fee transfer, and internal transfers)
  // We need to analyze all transfers together to calculate net token and USDC changes
  uniqueTransactions.forEach((tx) => {
    const hash = tx.tx_hash || tx.hash;
    if (!hash) return; // Skip transfers without a transaction hash
    if (!groupedByTxHash[hash]) {
      groupedByTxHash[hash] = [];
    }
    groupedByTxHash[hash].push(tx);
  });

  // Reconstruct trades by analyzing net token and USDC changes per transaction
  Object.keys(groupedByTxHash).forEach((txHash) => {
    const group = groupedByTxHash[txHash];
    let usdcChange = 0;
    let tokenChange = 0;
    let tokenSymbol = '';
    let tokenAddress = '';
    const feeUsd = 0;
    let timestamp = 0;

    // Analyze all transfers in the transaction to calculate net token and USDC movements
    group.forEach((tx) => {
      timestamp = tx.timestamp;
      const isInbound = tx.to.toLowerCase() === walletAddress.toLowerCase();
      const isOutbound = tx.from.toLowerCase() === walletAddress.toLowerCase();

      // Only process transfers where the wallet is either sender or receiver
      // Skip internal contract-to-contract transfers that don't involve the user
      if (!isInbound && !isOutbound) return;

      const { amount } = tx;
      const { symbol } = tx.asset;

      // Ignore native token transfers (ETH, BNB, MATIC, etc.)
      // These represent transaction fees, not trade amounts
      if (tx.type === 'native') return;

      // Determine if this is a USDC transfer (quote currency) or the base token
      const txContract =
        (tx.asset.contracts && tx.asset.contracts[0]) || tx.asset.contract;
      const isUSDC =
        txContract && USDC_ADDRESSES.includes(txContract.toLowerCase());

      if (isUSDC) {
        // Accumulate net USDC changes: positive when received, negative when spent
        if (isInbound) usdcChange += amount;
        if (isOutbound) usdcChange -= amount;
      } else if (tokenSymbol && tokenSymbol !== symbol) {
        // Detected a second distinct token - this is a multi-token trade
        // We only support single-token trades (e.g., LINK→USDC, not LINK→ETH→USDC)
        tokenSymbol = 'INVALID';
      } else {
        // This is the base token being traded
        tokenSymbol = symbol;
        tokenAddress = tx.asset.contracts?.[0] || '';
        // Accumulate net token changes: positive when received, negative when sent
        if (isInbound) tokenChange += amount;
        if (isOutbound) tokenChange -= amount;
      }
    });

    // Skip transactions that don't involve a single token (multi-token swaps are unsupported)
    if (tokenSymbol === 'INVALID' || !tokenSymbol) return;

    // Determine trade direction based on net token movement
    // BUY:  net positive token change (received more than sent)
    // SELL: net negative token change (sent more than received)
    let side: 'BUY' | 'SELL' | null = null;
    if (tokenChange > 0) side = 'BUY';
    else if (tokenChange < 0) side = 'SELL';

    if (!side) return; // No net token movement detected

    const absTokenChange = Math.abs(tokenChange);
    let absUsdcChange = Math.abs(usdcChange);

    if (absTokenChange === 0) return; // Dust/negligible amount

    // Fallback mechanism: if no USDC movements detected in state changes,
    // estimate the USD value using the token's market price
    // This handles edge cases like bridge operations, atomic swaps, or
    // incomplete internal transaction data where USDC transfer isn't directly visible
    if (absUsdcChange === 0 && group.length > 0) {
      const referenceTx = group[0];
      const price = referenceTx.token_price || 0;
      if (price > 0) {
        absUsdcChange = absTokenChange * price;
      }
    }

    // Cannot calculate PnL without knowing the USD value of the trade
    // Skip this transaction if no USDC value could be determined
    if (absUsdcChange === 0) return;

    trades.push({
      side,
      txHash,
      timestamp: timestamp / 1000, // Convert Mobula timestamp (milliseconds) to seconds
      amountToken: absTokenChange,
      amountQuoteUSDC: absUsdcChange,
      execPriceUSD: absUsdcChange / absTokenChange,
      feesUSD: feeUsd, // Not implemented fully yet as per complexity
      tokenAddress: tokenAddress || '',
      tokenSymbol,
    });
  });

  // Sort trades chronologically, with secondary ordering for same-timestamp trades
  return trades.sort((a, b) => {
    const timeDiff = a.timestamp - b.timestamp;
    if (timeDiff !== 0) return timeDiff;

    // For trades at identical timestamps, process BUYs before SELLs
    // This ensures we have inventory when processing sells (prevents skipping sells)
    if (a.side === 'BUY' && b.side === 'SELL') return -1;
    if (a.side === 'SELL' && b.side === 'BUY') return 1;

    return 0;
  });
};

export const calculatePnL = (
  trades: ReconstructedTrade[],
  currentPrice: number
): PnLMetrics | null => {
  let totalTokens = 0;
  let totalCostUSDC = 0;
  let realisedPnLUSDC = 0;
  let totalCostBasisSold = 0;

  trades.forEach((trade) => {
    if (trade.side === 'BUY') {
      // Accumulate tokens and their cost basis
      totalTokens += trade.amountToken;
      totalCostUSDC += trade.amountQuoteUSDC;
    } else {
      // SELL: Use weighted average cost (WAC) to calculate realized PnL
      if (totalTokens <= 0) return; // Skip sells without inventory

      // Calculate average cost per token and realized profit/loss
      const wac = totalCostUSDC / totalTokens;
      const costBasis = trade.amountToken * wac;

      totalTokens -= trade.amountToken;
      totalCostUSDC -= costBasis;

      totalCostBasisSold += costBasis;
      // Realized PnL = proceeds - cost basis
      realisedPnLUSDC += trade.amountQuoteUSDC - costBasis;
    }
  });

  // Clamp negative values to zero (handles floating-point rounding errors)
  if (totalTokens < 0) totalTokens = 0;
  if (totalCostUSDC < 0) totalCostUSDC = 0;

  const realisedPnLPct =
    totalCostBasisSold > 0 ? (realisedPnLUSDC / totalCostBasisSold) * 100 : 0;

  // Calculate unrealized PnL on remaining position
  const currentValueUSDC = totalTokens * currentPrice;
  const unrealisedPnLUSDC = currentValueUSDC - totalCostUSDC;
  const unrealisedPnLPct =
    totalCostUSDC > 0 ? (unrealisedPnLUSDC / totalCostUSDC) * 100 : 0;

  // Accumulate all historical buy/sell totals (regardless of current position)
  // This tracks the complete transaction history, not just remaining holdings
  let totalHistoricalBuyTokens = 0;
  let totalHistoricalBuyUSDC = 0;
  let totalHistoricalSellTokens = 0;
  let totalHistoricalSellUSDC = 0;

  trades.forEach((t) => {
    if (t.side === 'BUY') {
      totalHistoricalBuyTokens += t.amountToken;
      totalHistoricalBuyUSDC += t.amountQuoteUSDC;
    } else {
      totalHistoricalSellTokens += t.amountToken;
      totalHistoricalSellUSDC += t.amountQuoteUSDC;
    }
  });

  // Calculate average execution price for buys and sells across entire history
  // This shows the average price at which the user bought and sold tokens
  // Used for metrics display and historical analysis
  const avgBuyPriceHistorical =
    totalHistoricalBuyTokens > 0
      ? totalHistoricalBuyUSDC / totalHistoricalBuyTokens
      : 0;
  const avgSellPriceHistorical =
    totalHistoricalSellTokens > 0
      ? totalHistoricalSellUSDC / totalHistoricalSellTokens
      : 0;

  // Return null if no buy history - can't calculate meaningful PnL without trades
  // This prevents showing misleading $0 metrics on a wallet with no history
  if (totalHistoricalBuyTokens === 0) {
    return null;
  }

  // Return comprehensive PnL metrics for the token position
  return {
    realisedPnLUSDC, // Actual profit/loss from completed sells
    realisedPnLPct, // Realized PnL as percentage of cost basis
    unrealisedPnLUSDC, // Theoretical profit/loss on remaining position
    unrealisedPnLPct, // Unrealized PnL as percentage of current cost basis
    avgBuyPrice: avgBuyPriceHistorical, // Average execution price across all buys
    avgSellPrice: avgSellPriceHistorical, // Average execution price across all sells
    totalBoughtUSDC: totalHistoricalBuyUSDC, // Sum of all buy amounts in USD
    totalSoldUSDC: totalHistoricalSellUSDC, // Sum of all sell amounts in USD
    balanceToken: totalTokens, // Current token holdings
    balanceUSDC: currentValueUSDC, // Current position value in USD at market price
  };
};

/**
 * Validates Mobula transactions against Relay by querying each transaction hash.
 * Only creates trades for transactions that exist in Relay and involve USDC.
 * This ensures we only show PnL for assets traded through our platform.
 */
export const getRelayValidatedTrades = async (
  mobulaTransactions: MobulaTransactionRow[],
  token: {
    address: string;
    contracts?: string[];
    symbol: string;
    decimals: number;
    chainId: number;
  },
  relayRequestsMap?: Map<string, RelayRequest | null>
): Promise<ReconstructedTrade[]> => {
  // Filter Mobula transactions to only those involving the target token
  // We match on both symbol and contract address because some tokens
  // have multiple deployment addresses across different chains
  const tokenTransactions = mobulaTransactions.filter((tx) => {
    const txContract =
      (tx.asset.contracts && tx.asset.contracts[0]) || tx.asset.contract;

    // Check if transaction is for our target token by symbol and address
    const matchesAddress =
      txContract?.toLowerCase() === token.address.toLowerCase();
    const matchesContracts = token.contracts?.some(
      (c) => c.toLowerCase() === txContract?.toLowerCase()
    );

    return (
      tx.asset.symbol === token.symbol && (matchesAddress || matchesContracts)
    );
  });

  // Group all transfer events by their transaction hash
  // Different Mobula API versions may use 'tx_hash' or 'hash' for the transaction ID
  // We need to group all transfers from a single transaction together for net amount analysis
  const groupedByTxHash: { [txHash: string]: MobulaTransactionRow[] } = {};
  tokenTransactions.forEach((tx) => {
    const hash = tx.hash || tx.tx_hash;
    if (!hash) return; // Skip transfers without a transaction hash

    if (!groupedByTxHash[hash]) {
      groupedByTxHash[hash] = [];
    }
    groupedByTxHash[hash].push(tx);
  });

  const txHashes = Object.keys(groupedByTxHash);

  // Fetch Relay request data for all transaction hashes
  // Uses a cache if available to reduce API calls for already-fetched transactions
  const relayRequestPromises = txHashes.map(async (txHash) => {
    if (relayRequestsMap && relayRequestsMap.has(txHash)) {
      // Return cached relay request without making a new API call
      return { txHash, relayReq: relayRequestsMap.get(txHash) };
    }
    // Fetch relay request from API if not in cache
    const relayReq = await fetchRelayRequestByHash(txHash);
    return { txHash, relayReq };
  });

  // Wait for all Relay requests to complete
  const relayResults = await Promise.all(relayRequestPromises);

  // Filter and transform: keep only transactions that were executed via Relay,
  // then construct trade objects from their state changes
  const trades = relayResults
    .filter(({ relayReq }) => relayReq) // Only transactions actually in Relay database
    .map(({ txHash, relayReq }) => {
      if (!relayReq) return null; // Additional safety check

      // Verify USDC involvement via Relay state changes (validation step)
      let hasUSDCInRelay = false;
      let usdcAmount = 0;
      const userAddress = relayReq.user?.toLowerCase();

      // Determine trade side from net token movement detected in Mobula data
      const group = groupedByTxHash[txHash];
      let tokenChange = 0;
      let hasToken = false;

      // Analyze all transfer events for this transaction from Mobula
      group.forEach((tx) => {
        const { symbol } = tx.asset;
        const { amount } = tx;
        const isInbound = tx.to.toLowerCase() === userAddress;
        const isOutbound = tx.from.toLowerCase() === userAddress;

        // Verify this transfer is for our target token
        const txContract =
          (tx.asset.contracts && tx.asset.contracts[0]) || tx.asset.contract;

        const matchesAddress =
          txContract?.toLowerCase() === token.address.toLowerCase();
        const matchesContracts = token.contracts?.some(
          (c) => c.toLowerCase() === txContract?.toLowerCase()
        );

        // Track net token movement: positive = received, negative = sent
        if (symbol === token.symbol && (matchesAddress || matchesContracts)) {
          hasToken = true;
          if (isInbound) tokenChange += amount;
          if (isOutbound) tokenChange -= amount;
        }
      });

      // Validate that the target token was actually involved in this transaction
      if (!hasToken) return null;

      // Determine trade direction from net token movement
      let side: 'BUY' | 'SELL' | null = null;
      if (tokenChange > 0) side = 'BUY';
      else if (tokenChange < 0) side = 'SELL';

      // Reject transactions with no net token movement
      if (!side) return null;

      const absTokenChange = Math.abs(tokenChange);

      // Skip negligible amounts
      if (absTokenChange === 0) return null;

      // Extract USDC amount from Relay state changes - this represents the quote currency
      // State changes track all balance modifications, allowing us to extract the exact USDC amount
      usdcAmount = 0;
      if (relayReq.data?.inTxs) {
        relayReq.data.inTxs.forEach((inTx) => {
          if (inTx.stateChanges) {
            inTx.stateChanges.forEach((stateChange) => {
              const tokenAddr =
                stateChange.change?.data?.tokenAddress?.toLowerCase();
              const changeAddress = stateChange.address?.toLowerCase();

              // Verify this state change involves USDC and the user's wallet
              if (
                tokenAddr &&
                USDC_ADDRESSES.some((addr: string) => addr === tokenAddr) &&
                changeAddress === userAddress
              ) {
                hasUSDCInRelay = true;

                // Extract the raw balance difference from state change
                // This value includes token decimals and must be normalized
                const balanceDiffStr =
                  (stateChange.change as { balanceDiff?: string })
                    ?.balanceDiff || '0';
                const balanceDiff = parseFloat(balanceDiffStr);

                // Process balance diff based on trade side:
                // BUY trade: USDC decreases (negative diff), we subtract from wallet
                // SELL trade: USDC increases (positive diff), we receive to wallet
                // We only count balance changes that match the expected trade direction
                const usdcDecimals = getUSDCDecimalsByChainId(token.chainId);
                const usdcDivisor = 10 ** usdcDecimals;
                if (side === 'BUY' && balanceDiff < 0) {
                  usdcAmount += Math.abs(balanceDiff) / usdcDivisor;
                } else if (side === 'SELL' && balanceDiff > 0) {
                  usdcAmount += balanceDiff / usdcDivisor;
                }
              }
            });
          }
        });
      }

      // USDC must be involved in the Relay transaction to be a valid trade
      // Without USDC, we can't determine the USD value of the trade
      if (!hasUSDCInRelay) {
        return null;
      }

      const timestamp = group[0]?.timestamp || 0;

      // Fallback: if we couldn't extract USDC amount from state changes,
      // estimate using the token's market price (less accurate but better than nothing)
      // This handles edge cases like bridge swaps or incomplete state change data
      if (usdcAmount === 0) {
        usdcAmount = absTokenChange * (group[0]?.token_price || 0);
      }

      return {
        side,
        txHash,
        timestamp: timestamp / 1000, // Convert to seconds
        amountToken: absTokenChange,
        amountQuoteUSDC: usdcAmount,
        execPriceUSD: usdcAmount / absTokenChange,
        feesUSD: 0,
        tokenAddress: token.address,
        tokenSymbol: token.symbol,
      };
    })
    .filter((trade) => trade !== null) as ReconstructedTrade[];

  return trades.sort((a, b) => {
    const timeDiff = a.timestamp - b.timestamp;
    if (timeDiff !== 0) return timeDiff;

    // If timestamps are identical, prioritize BUYs before SELLs
    // to ensure we have inventory to sell (prevents skipping sells due to 0 balance)
    if (a.side === 'BUY' && b.side === 'SELL') return -1;
    if (a.side === 'SELL' && b.side === 'BUY') return 1;

    return 0;
  });
};

/**
 * Calculates PnL metrics directly from Relay requests, bypassing Mobula transactions.
 * Uses Relay as the source of truth for trade execution details.
 */
export const calculatePnLFromRelay = (
  relayRequests: RelayRequest[],
  token: {
    address: string; // Contract address
    symbol: string;
    decimals: number;
    chainId: number;
    price?: number; // Added for fallback
  }
): ReconstructedTrade[] => {
  const tokenContract = token.address.toLowerCase();

  // Deduplicate relay requests by ID to prevent double-counting trades
  // Multiple API calls or data syncs might return the same relay request
  const seenRequestIds = new Set<string>();
  const uniqueRelayRequests = relayRequests.filter((req) => {
    if (seenRequestIds.has(req.id)) return false; // Skip if we've already processed this ID
    seenRequestIds.add(req.id);
    return true; // Keep this request
  });

  const trades = uniqueRelayRequests
    .map((req) => {
      let amountToken = 0;
      let amountUSDC = 0;
      let side: 'BUY' | 'SELL' | null = null;
      let timestamp = new Date(req.createdAt).getTime() / 1000;

      // Check both req.metadata and req.data.metadata (different API versions)
      const metadata = req.metadata || req.data?.metadata;

      // ALWAYS check state changes first before relying on metadata
      // This is critical because metadata might describe a bridge operation (USDC→USDC)
      // while state changes reveal the actual token swap (e.g., LINK→USDC)
      // State changes are the ground truth for what actually moved on-chain
      const userAddress = req.user?.toLowerCase();
      const allTxs = [...(req.data?.inTxs || []), ...(req.data?.outTxs || [])];

      // Accumulate all balance changes across all transactions using a reducer
      // This consolidates token and USDC movements into net amounts
      // Also captures the latest block timestamp and the chain where USDC moved
      const { tokenChange, usdcChange, latestTimestamp, usdcChainId } =
        allTxs.reduce(
          (
            acc: {
              tokenChange: number;
              usdcChange: number;
              latestTimestamp: number;
              usdcChainId?: number;
            },
            tx
          ) => {
            if (tx.timestamp) {
              // Normalize timestamp to seconds for consistency
              // Relay timestamps may come in milliseconds (>1e12) or already in seconds
              acc.latestTimestamp =
                tx.timestamp > 1e12
                  ? Math.floor(tx.timestamp / 1000)
                  : tx.timestamp;
            }
            if (tx.stateChanges) {
              // Process state changes to extract token and USDC movements
              tx.stateChanges.forEach((sc) => {
                // Only consider state changes that affect the user's wallet
                if (sc.address?.toLowerCase() === userAddress) {
                  const tokenAddr =
                    sc.change?.data?.tokenAddress?.toLowerCase();
                  const balanceDiff = parseFloat(sc.change?.balanceDiff || '0');

                  // Track balance movement of the target token
                  if (tokenAddr === tokenContract) {
                    acc.tokenChange += balanceDiff;
                  } else if (
                    // Check USDC by address or as a fallback by symbol
                    // Address check is primary, symbol check handles edge cases
                    (tokenAddr && USDC_ADDRESSES.includes(tokenAddr)) ||
                    sc.change?.data?.symbol?.toUpperCase() === 'USDC'
                  ) {
                    // Track net USDC movement across all transactions
                    acc.usdcChange += balanceDiff;
                    // Record the chain where USDC actually moved (used for decimal normalization)
                    if (tx.chainId) acc.usdcChainId = tx.chainId;
                  }
                }
              });
            }
            return acc;
          },
          {
            tokenChange: 0,
            usdcChange: 0,
            latestTimestamp: timestamp,
            usdcChainId: undefined, // Will be set if we find USDC in state changes
          }
        );

      // Determine which chain's USDC decimals to use for normalization
      // Primary source: state changes (most accurate)
      // Fallback 1: metadata if state changes didn't reveal USDC location
      // Fallback 2: token chain if neither state changes nor metadata has USDC info
      let finalUsdcChainId = usdcChainId;
      if (!finalUsdcChainId) {
        if (metadata?.currencyIn?.currency?.symbol?.toUpperCase() === 'USDC') {
          // For BUY trades: currencyIn is what we spent (USDC), get its chain
          finalUsdcChainId = req.in?.chainId;
        } else if (
          metadata?.currencyOut?.currency?.symbol?.toUpperCase() === 'USDC'
        ) {
          // For SELL trades: currencyOut is what we received (USDC), get its chain
          finalUsdcChainId = req.out?.chainId;
        }
      }

      // Ultimate fallback: use the token's chain if no USDC chain found
      // This assumes USDC on the same chain as the token
      finalUsdcChainId = finalUsdcChainId || token.chainId;

      timestamp = latestTimestamp;

      // Primary extraction method: use state changes if available
      // State changes are most reliable as they show actual on-chain balance movements
      if (tokenChange !== 0) {
        const tokenDivisor = 10 ** token.decimals;
        // Use the chain ID from the USDC transaction, defaulting to token chain if not found
        const usdcDecimals = getUSDCDecimalsByChainId(finalUsdcChainId);
        const usdcDivisor = 10 ** usdcDecimals;

        const tokenAmountRaw = Math.abs(tokenChange) / tokenDivisor;
        const usdcAmountRaw = Math.abs(usdcChange) / usdcDivisor;

        if (tokenChange > 0) {
          // BUY: token received (positive balance change)
          side = 'BUY';
          amountToken = tokenAmountRaw;
          // First priority: USDC amount from state changes (most accurate)
          if (usdcAmountRaw > 0) {
            amountUSDC = usdcAmountRaw;
          } else if (metadata?.currencyIn?.amountUsd) {
            // Fallback: use metadata's inbound currency USD value
            // For BUY: we spend currencyIn (which should be USDC) to receive token
            amountUSDC = parseFloat(metadata.currencyIn.amountUsd);
          }
        } else {
          // SELL: token sent (negative balance change)
          side = 'SELL';
          amountToken = tokenAmountRaw;
          // First priority: USDC amount from state changes (most accurate)
          if (usdcAmountRaw > 0) {
            amountUSDC = usdcAmountRaw;
          } else if (metadata?.currencyOut?.amountUsd) {
            // Fallback: use metadata's outbound currency USD value
            // For SELL: we receive currencyOut (which should be USDC) for sending token
            amountUSDC = parseFloat(metadata.currencyOut.amountUsd);
          }
        }
      }
      // Fallback extraction method: use metadata if state changes weren't available
      // This handles cases where we don't have detailed state change data
      // Metadata contains high-level trade information (currencyIn/Out) but less precision
      else if (metadata && metadata.currencyIn && metadata.currencyOut) {
        const { currencyIn, currencyOut } = metadata;
        const inAddress = currencyIn.currency?.address?.toLowerCase();
        const outAddress = currencyOut.currency?.address?.toLowerCase();

        // Determine trade side by checking which currency is our target token
        const isBuy = outAddress === tokenContract;
        const isSell = inAddress === tokenContract;

        if (isBuy) {
          // BUY: we receive the token (currencyOut) and spend the quote (currencyIn)
          side = 'BUY';
          amountToken = parseFloat(currencyOut.amountFormatted || '0');
          // First try to use pre-calculated USD value from metadata
          amountUSDC = parseFloat(currencyIn.amountUsd || '0');
          // Fallback: if no USD value, and inCurrency is USDC, use its formatted amount
          if (
            amountUSDC === 0 &&
            inAddress &&
            (USDC_ADDRESSES.includes(inAddress) ||
              currencyIn.currency?.symbol?.toUpperCase() === 'USDC')
          ) {
            amountUSDC = parseFloat(currencyIn.amountFormatted || '0');
          }
        } else if (isSell) {
          // SELL: we send the token (currencyIn) and receive the quote (currencyOut)
          side = 'SELL';
          amountToken = parseFloat(currencyIn.amountFormatted || '0');
          // First try to use pre-calculated USD value from metadata
          amountUSDC = parseFloat(currencyOut.amountUsd || '0');
          // Fallback: if no USD value, and outCurrency is USDC, use its formatted amount
          if (
            amountUSDC === 0 &&
            outAddress &&
            (USDC_ADDRESSES.includes(outAddress) ||
              currencyOut.currency?.symbol?.toUpperCase() === 'USDC')
          ) {
            amountUSDC = parseFloat(currencyOut.amountFormatted || '0');
          }
        }
      } else {
        // No usable data available - cannot extract trade amounts
        // This shouldn't happen in normal operation but indicates incomplete relay data
        console.warn(
          `[calculatePnLFromRelay] No metadata or state changes for request ${req.id}`
        );
      }

      // Validate we have both side and token amount before continuing
      if (!side || amountToken === 0) return null;

      // Last-resort fallback: use token price if we couldn't extract USDC amount
      // This handles complex swaps where USDC amount isn't directly traceable
      if (amountUSDC === 0 && token.price) {
        amountUSDC = amountToken * token.price;
      }

      // Skip if we still have no USDC value after all fallbacks
      if (amountUSDC === 0) return null;

      // Sanity checks: validate extracted amounts against reasonable bounds
      // This prevents bad data from corrupting PnL calculations
      const execPrice = amountUSDC / amountToken;

      // Sanity check: USDC amount shouldn't exceed $1 trillion (likely data error)
      // This catches bad decimal normalization or duplicate transactions
      if (amountUSDC > 1e12) {
        console.warn(
          `[calculatePnLFromRelay] Suspiciously large USDC amount for ${token.symbol}: $${amountUSDC.toLocaleString()}. Skipping trade ${req.id}`
        );
        return null;
      }

      // Sanity check: per-token execution price shouldn't exceed $1 million
      // This catches cases where decimal normalization went wrong
      if (execPrice > 1e6) {
        console.warn(
          `[calculatePnLFromRelay] Suspiciously high execution price for ${token.symbol}: $${execPrice.toLocaleString()}/token. Skipping trade ${req.id}`
        );
        return null;
      }

      // Sanity check: execution price must be positive
      // Negative or zero prices indicate corrupted data or failed extraction
      if (execPrice <= 0) {
        console.warn(
          `[calculatePnLFromRelay] Invalid execution price for ${token.symbol}: $${execPrice}. Skipping trade ${req.id}`
        );
        return null;
      }

      return {
        side,
        txHash: req.id,
        timestamp,
        amountToken,
        amountQuoteUSDC: amountUSDC,
        execPriceUSD: execPrice,
        feesUSD: 0,
        tokenAddress: token.address,
        tokenSymbol: token.symbol,
      };
    })
    .filter((trade) => trade !== null) as ReconstructedTrade[];

  // Sort trades chronologically, with secondary ordering for same-timestamp trades
  return trades.sort((a, b) => {
    const timeDiff = a.timestamp - b.timestamp;
    if (timeDiff !== 0) return timeDiff;

    // For trades at identical timestamps, process BUYs before SELLs
    // This ensures we have inventory when processing sells (prevents skipping sells)
    if (a.side === 'BUY' && b.side === 'SELL') return -1;
    if (a.side === 'SELL' && b.side === 'BUY') return 1;

    return 0;
  });
};
