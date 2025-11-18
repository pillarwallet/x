export type TransactionStatusState =
  | 'Starting Transaction'
  | 'Transaction Pending'
  | 'Transaction Complete'
  | 'Transaction Failed';

export type TransactionStep =
  | 'Submitted'
  | 'Pending'
  | 'ResourceLock'
  | 'Completed';

export type StepStatus = 'completed' | 'pending' | 'failed' | 'inactive';

export interface TokenInfo {
  symbol: string;
  name: string;
  logo: string;
  address?: string;
}

export interface SellOffer {
  tokenAmountToReceive: number;
  minimumReceive: number;
}

export interface PayingToken {
  totalUsd: number;
  name: string;
  symbol: string;
  logo: string;
  actualBal: string;
  totalRaw: string;
  chainId: number;
  address: string;
}

export interface TokenDetails {
  symbol: string;
  name: string;
  address: string;
  chainId: number;
  amount: string;
  logo: string;
  type: 'BUY_TOKEN' | 'SELL_TOKEN';
}

export interface BuyModeDetails {
  usdAmount: string;
  payingTokens: PayingToken[];
  totalPayingUsd: number;
}

export interface TransactionStatusConfig {
  icon: string;
  containerClasses: string;
  iconClasses: string;
  color: string;
}

export interface ButtonConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  label: string;
}

export interface ProgressStepConfig {
  label: string;
  order: number;
}

export interface TransactionStatusProps {
  closeTransactionStatus: () => void;
  userOpHash: string;
  chainId: number;
  gasFee?: string;
  // Transaction data from PreviewSell/PreviewBuy
  isBuy?: boolean;
  sellToken?: TokenInfo | null;
  buyToken?: TokenInfo | null;
  tokenAmount?: string;
  sellOffer?: SellOffer | null;
  payingTokens?: PayingToken[];
  usdAmount?: string;
  // Feature flags
  useRelayBuy?: boolean;
  // Externalized polling state
  currentStatus: TransactionStatusState;
  errorDetails: string;
  submittedAt?: Date;
  pendingCompletedAt?: Date;
  blockchainTxHash?: string;
  resourceLockTxHash?: string;
  completedTxHash?: string;
  completedChainId?: number;
  resourceLockChainId?: number;
  resourceLockCompletedAt?: Date;
  isResourceLockFailed?: boolean;
  fromChainId?: number; // For Relay Buy: chainId where USDC is taken from
}

export interface TransactionDetailsProps {
  onDone: () => void;
  userOpHash: string;
  chainId: number;
  status: TransactionStatusState;
  // Transaction data from PreviewSell/PreviewBuy
  isBuy?: boolean;
  sellToken?: TokenInfo | null;
  buyToken?: TokenInfo | null;
  tokenAmount?: string;
  sellOffer?: SellOffer | null;
  payingTokens?: PayingToken[];
  usdAmount?: string;
  // Feature flags
  useRelayBuy?: boolean;
  submittedAt?: Date;
  pendingCompletedAt?: Date;
  resourceLockCompletedAt?: Date;
  txHash?: string;
  gasFee?: string;
  errorDetails?: string;
  resourceLockTxHash?: string;
  completedTxHash?: string;
  resourceLockChainId?: number;
  completedChainId?: number;
  isResourceLockFailed?: boolean;
  fromChainId?: number; // For Relay Buy: chainId where USDC is taken from
}

export interface TransactionInfoProps {
  status: TransactionStatusState;
  userOpHash: string;
  txHash?: string;
  chainId: number;
  gasFee?: string;
  completedAt?: Date;
  // Buy-specific fields
  isBuy?: boolean;
  resourceLockTxHash?: string;
  resourceLockChainId?: number;
  completedTxHash?: string;
  completedChainId?: number;
  useRelayBuy?: boolean;
  fromChainId?: number; // For Relay Buy: chainId where USDC is taken from
}

export interface ProgressStepProps {
  step: TransactionStep;
  status: StepStatus;
  label: string;
  isLast?: boolean;
  showLine?: boolean;
  lineStatus?: StepStatus;
  timestamp?: string | React.ReactNode;
}

export interface TransactionErrorBoxProps {
  technicalDetails?: string;
}

export interface UseClickOutsideOptions {
  ref: React.RefObject<HTMLElement>;
  callback: () => void;
  condition: boolean;
}

export interface UseKeyboardNavigationOptions {
  onEscape: () => void;
  onEnter?: () => void;
  enabled?: boolean;
}

export interface TechnicalDetails {
  transactionType: 'BUY' | 'SELL';
  transactionHash: string;
  hashType: 'bidHash' | 'userOpHash';
  chainId: number;
  status: TransactionStatusState;
  timestamp: string;
  accountAddress: string;
  token: TokenDetails | null;
  sellOffer: SellOffer | null;
  buyMode: BuyModeDetails | null;
  transactionHashes: {
    [key: string]: string;
  };
  chains: {
    mainChainId: number;
    resourceLockChainId: string | number;
    completedChainId: string | number;
  };
  timestamps: {
    [key: string]: string;
  };
  error: {
    details: string;
    isResourceLockFailed: boolean;
    failureStep: string;
  };
  gas: {
    fee: string;
  };
  stepStatus: {
    [key: string]: StepStatus;
  };
}
