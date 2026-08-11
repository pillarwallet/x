import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Upload,
  Trash2,
  Settings,
  Lock,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { createWalletClient, custom } from 'viem';
import { arbitrum } from 'viem/chains';
import useTransactionKit from '../../../hooks/useTransactionKit';
import { useHyperliquid } from '../hooks/useHyperliquid';
import { privateKeyToAccount } from 'viem/accounts';
import type { Hex } from 'viem';
import { generateAgentWallet } from '../lib/hyperliquid/signing';
import {
  buildApproveAgentAction,
  getApproveAgentTypedData,
} from '../lib/hyperliquid/signing';
import { postExchange } from '../lib/hyperliquid/client';
import { ValidationStatus } from './ValidationStatus';
import { DepositModal } from './DepositModal';
import type { UserState } from '../lib/hyperliquid/types';
import { PinSetupModal } from './PinSetupModal';
import { UnlockWalletModal } from './UnlockWalletModal';
import { PrivateKeyModal } from './PrivateKeyModal';
import { useIsMobile } from '../hooks/use-mobile';

import {
  storeAgentWallet,
  updateAgentApproval,
  updateBuilderApproval,
  clearAgentWallet,
  storeAgentWalletEncrypted,
  unlockAgentWallet,
  getAgentWallet,
  getAgentAddress,
  isAgentWalletEncrypted,
  isImportedAccountEncrypted,
  getImportedAccountAddress,
  getImportedAccount,
  clearImportedAccount,
  unlockImportedAccount,
  storeImportedAccountEncrypted,
} from '../lib/hyperliquid/keystore';
import { cn } from '../lib/utils';

type AgentStatus = 'none' | 'created' | 'approved' | 'locked' | 'builder_approval_pending';

interface AgentControlsProps {
  onStatusChange?: () => void;
  onAgentAddressChange?: (address: string | null) => void;
  userState?: UserState;
  ethPrice?: number;
}

// Add 'unlock' to revealMode type
type RevealMode = 'copy' | 'download' | 'unlock';

export function AgentControls({
  onStatusChange,
  onAgentAddressChange,
  userState,
  ethPrice,
}: AgentControlsProps) {
  const { walletProvider } = useTransactionKit();
  const { address } = useHyperliquid();
  // Removed useWalletClient from wagmi

  // Calculate master balance for conditional logic
  const masterBalance = userState?.marginSummary?.accountValue
    ? parseFloat(userState.marginSummary.accountValue)
    : 0;
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('none');
  const [agentAddress, setAgentAddress] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [agentPrivateKey, setAgentPrivateKey] = useState<string>('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importPrivateKey, setImportPrivateKey] = useState('');
  const [importAccountAddress, setImportAccountAddress] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      if (agentStatus === 'approved') {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  }, [isMobile, agentStatus]);

  const [validationStatus, setValidationStatus] = useState<
    'idle' | 'validating' | 'success' | 'error'
  >('idle');
  const [validationData, setValidationData] = useState<{
    agentAddress?: string;
    balance?: string;
    openPositions?: number;
    errorMessage?: string;
  }>({});

  // PIN & Encryption State
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showUnlockReveal, setShowUnlockReveal] = useState(false);
  const [revealMode, setRevealMode] = useState<'unlock' | 'reveal'>('unlock'); // 'unlock' = just unlock, 'reveal' = show key
  const [pendingImportData, setPendingImportData] = useState<{
    address: string;
    privateKey: Hex;
    accountState?: any;
  } | null>(null);

  const [privateKeyModalState, setPrivateKeyModalState] = useState<{
    isOpen: boolean;
    address: string;
    privateKey: string;
    mode: 'created' | 'revealed';
  }>({
    isOpen: false,
    address: '',
    privateKey: '',
    mode: 'created',
  });

  // Check status on mount / address change
  useEffect(() => {
    const checkStatus = async () => {
      // Priority 1: Check for unlocked imported account (memory/cache)
      // We check this FIRST so that if we just created/unlocked it, we don't force a re-unlock.
      const imported = getImportedAccount();

      if (imported) {
        setAgentAddress(imported.accountAddress);
        setAgentPrivateKey(imported.privateKey);
        setAgentStatus('approved');
        return;
      }

      // Priority 2: Check for GLOBAL imported account (locked)
      const isEncrypted = isImportedAccountEncrypted();

      if (isEncrypted) {
        const addr = getImportedAccountAddress();
        if (addr) {
          setAgentAddress(addr);
          setAgentStatus('locked');
          // Auto-prompt check
          setRevealMode('unlock');
          setShowUnlockReveal(true);
          return;
        }
      }

      // Priority 3: Check for agent wallet (if connected wallet exists)
      if (!address) {
        setAgentStatus('none');
        return;
      }

      // 3a. Try to get unlocked agent wallet
      const wallet = await getAgentWallet(address);
      if (wallet) {
        setAgentAddress(wallet.address);
        setAgentPrivateKey(wallet.privateKey);
        if (wallet.approved) {
          if (wallet.builderApproved) {
            setAgentStatus('approved');
          } else {
            setAgentStatus('builder_approval_pending');
          }
        } else {
          setAgentStatus('created');
        }
        return;
      }

      // 3b. Check if agent wallet is locked
      if (isAgentWalletEncrypted(address)) {
        const addr = getAgentAddress(address);
        if (addr) {
          setAgentAddress(addr);
          setAgentStatus('locked');
          setRevealMode('unlock');
          setShowUnlockReveal(true);
        }
        return;
      }

      setAgentStatus('none');
    };

    checkStatus();
  }, [address, validationStatus]); // Re-run if validation finishes (import) or address changes

  // Notify parent of agent address changes
  useEffect(() => {
    if (onAgentAddressChange) {
      onAgentAddressChange(agentAddress || null);
    }
  }, [agentAddress, onAgentAddressChange]);

  // Auto-show unlock modal when wallet becomes locked
  useEffect(() => {
    if (agentStatus === 'locked' && !showUnlockReveal) {
      setRevealMode('unlock');
      setShowUnlockReveal(true);
    }
  }, [agentStatus, showUnlockReveal]);

  const handleUnlockClick = () => {
    setShowUnlockReveal(true);
    setRevealMode('copy'); // Default mode, but actually we just want to unlock session
    // We need to distinguish between "Unlock Session" and "Reveal Key".
    // For now, let's just use the same modal.
    // If we rename revealMode to 'unlock' | 'copy' | 'download'?
  };

  // Modify handleUnlockForReveal to handle simple unlock
  const handleUnlockForReveal = async (pin: string): Promise<boolean> => {
    try {
      // Priority 1: Try unlocking imported account
      // Priority 1: Try unlocking imported account
      if (isImportedAccountEncrypted()) {
        const unlocked = await unlockImportedAccount(pin);
        if (unlocked) {
          setAgentAddress(unlocked.accountAddress);
          setAgentPrivateKey(unlocked.privateKey);
          setAgentStatus('approved');
          setShowUnlockReveal(false);

          // Show Key in Modal ONLY if revealed
          if (revealMode === 'reveal') {
            setPrivateKeyModalState({
              isOpen: true,
              address: unlocked.accountAddress,
              privateKey: unlocked.privateKey,
              mode: 'revealed',
            });
          } else {
            toast.success('Wallet unlocked');
          }

          // Trigger data refresh on parent
          if (onStatusChange) {
            onStatusChange();
          }

          return true;
        }
      }

      // Priority 2: Try unlocking agent wallet (if connected)
      if (!address) return false;
      const unlocked = await unlockAgentWallet(address, pin);
      if (unlocked) {
        setAgentPrivateKey(unlocked.privateKey);
        if (unlocked.approved) {
          if (unlocked.builderApproved) {
            setAgentStatus('approved');
          } else {
            setAgentStatus('builder_approval_pending');
          }
        } else {
          setAgentStatus('created');
        }
        setShowUnlockReveal(false);

        // Show Key in Modal ONLY if revealed
        if (revealMode === 'reveal') {
          setPrivateKeyModalState({
            isOpen: true,
            address: unlocked.address,
            privateKey: unlocked.privateKey,
            mode: 'revealed',
          });
        } else {
          toast.success('Wallet unlocked'); // Silent unlock
        }

        // Trigger data refresh on parent
        if (onStatusChange) {
          onStatusChange();
        }

        return true;
      }
      return false;
    } catch (e) {
      throw e;
    }
  };

  const handleCreateAgentClick = () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Proceed directly to setup - if UI shows "Create New", we assume we can create new.
    // Any existing data will be overwritten.
    setPendingImportData(null);
    setShowPinSetup(true);
  };

  const handleAgentCreationWithPin = async (pin: string) => {
    setShowPinSetup(false);
    setIsCreating(true);
    try {
      if (pendingImportData) {
        // Encrypt IMPORTED wallet as GLOBAL account
        await storeImportedAccountEncrypted(
          importAccountAddress.trim() || pendingImportData.address,
          pendingImportData.privateKey,
          pin
        );

        // Update local state immediately
        setAgentAddress(
          importAccountAddress.trim() || pendingImportData.address
        );
        setAgentPrivateKey(pendingImportData.privateKey);
        setAgentStatus('approved');

        // Restore Validation Success Logic (Deferred from Import)
        // Restore Validation Success Logic (Deferred from Import)
        // Data is already set in handleImportAgent

        toast.success('✅ Account imported!', {
          description: 'Agent wallet secured successfully.',
          duration: 5000,
        });

        // Clear validation status now that flow is complete
        setValidationStatus('idle');
      } else {
        // Generate NEW wallet

        // Safety check: Verify address still exists before proceeding
        if (!address) {
          toast.error(
            'Wallet connection lost. Please reconnect and try again.'
          );
          setIsCreating(false);
          return;
        }

        const wallet = generateAgentWallet();

        await storeAgentWalletEncrypted(
          address,
          wallet.address,
          wallet.privateKey,
          pin,
          false
        );

        setAgentAddress(wallet.address);
        setAgentPrivateKey(wallet.privateKey); // Keep in memory for this session
        setAgentStatus('created');

        // Show Success Modal
        setPrivateKeyModalState({
          isOpen: true,
          address: wallet.address,
          privateKey: wallet.privateKey,
          mode: 'created',
        });
      }

      // Trigger data refresh on parent
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error: any) {
      console.error('Agent creation/import error:', error);
      toast.error('Failed to secure agent wallet');
    } finally {
      setIsCreating(false);
    }
  };


  const [isApprovingBuilder, setIsApprovingBuilder] = useState(false);

  const handleApproveBuilder = async () => {
    if (!address || !walletProvider) {
      toast.error('Please connect your wallet');
      return;
    }
    setIsApprovingBuilder(true);
    try {
      console.log('Approving Builder...');
      const { BUILDER_ADDRESS, BUILDER_FEE_APPROVAL } = await import(
        '../lib/hyperliquid/builder'
      );

      const { buildApproveBuilderFeeAction, signApproveBuilderFeeAction } =
        await import('../lib/hyperliquid/signing');
      const { postExchange } = await import('../lib/hyperliquid/client');

      // 1. Get account
      let accountToUse = address as Hex;
      if (walletProvider && 'request' in walletProvider) {
        // Logic to ensure account (omitted for brevity, relying on address/provider match)
      }

      const action = buildApproveBuilderFeeAction({
        maxFeeRate: BUILDER_FEE_APPROVAL,
        builderAddress: BUILDER_ADDRESS,
        nonce: Date.now(),
      });

      // 2. Sign
      const signature = await signApproveBuilderFeeAction(
        walletProvider as any,
        action
      );

      const apiAction = {
        ...action,
        builder: action.builder.toLowerCase(),
      };

      const payload = {
        action: apiAction,
        nonce: action.nonce,
        signature,
        vaultAddress: null,
      };

      // 3. Post
      const response = await postExchange(payload);
      if (response.status === 'ok') {
        toast.success('PillarX Approved!');

        // Update local state to fully approved
        updateBuilderApproval(address, true);
        setAgentStatus('approved');

        if (onStatusChange) {
          onStatusChange();
        }

      } else {
        throw new Error(response.response?.data?.toString() || 'Failed');
      }

    } catch (error: any) {
      console.error('Failed to approve PillarX:', error);
      toast.error(error.message || 'Failed to approve PillarX');
    } finally {
      setIsApprovingBuilder(false);
    }
  };

  const handleApproveAgent = async () => {
    if (!address || !walletProvider) {
      toast.error('Please connect your wallet');
      return;
    }

    const agent = await getAgentWallet(address);
    if (!agent) {
      toast.error('No agent wallet found');
      return;
    }

    if (agent.approved) {
      // Check builder status
      if (agent.builderApproved) {
        toast.success('Agent is already approved');
        setAgentStatus('approved');
        return;
      } else {
        // Transition to builder pending
        setAgentStatus('builder_approval_pending');
        return;
      }
    }

    setIsApproving(true);
    try {
      let accountToUse = address as Hex;

      // Probe walletProvider structure
      if (walletProvider) {
        // Check if we need to request accounts
        if ('request' in walletProvider) {
          try {
            // @ts-ignore
            const accounts = await walletProvider.request({
              method: 'eth_accounts',
            });
            if (accounts && Array.isArray(accounts) && accounts.length > 0) {
              // Use the account from the provider to ensure case match
              accountToUse = accounts[0];
            } else {
              console.warn(
                'No accounts found from provider. Requesting access...'
              );
              // @ts-ignore
              const requested = await walletProvider.request({
                method: 'eth_requestAccounts',
              });
              if (
                requested &&
                Array.isArray(requested) &&
                requested.length > 0
              ) {
                accountToUse = requested[0];
              }
            }
          } catch (e) {
            console.error('Error checking accounts:', e);
          }

          // Check chain ID and switch if necessary
          try {
            // @ts-ignore
            const chainId = await walletProvider.request({
              method: 'eth_chainId',
            });

            const targetChainId = '0xa4b1'; // Arbitrum One

            if (chainId !== targetChainId) {
              try {
                // @ts-ignore
                await walletProvider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: targetChainId }],
                });
              } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                  // @ts-ignore
                  await walletProvider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: targetChainId,
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
                } else {
                  throw switchError;
                }
              }
            }
          } catch (e) {
            console.error('Error switching chain:', e);
            toast.error(
              'Failed to switch network. Please switch to Arbitrum manually.'
            );
            setIsApproving(false);
            return;
          }
        }
      }

      const actionConfig = buildApproveAgentAction({
        agentAddress: agent.address,
        nonce: Date.now(),
      });

      // Get EIP-712 typed data structures
      const { domain, types, primaryType, message } = getApproveAgentTypedData(
        actionConfig.hyperliquidChain,
        actionConfig.signatureChainId,
        actionConfig.agentAddress,
        actionConfig.agentName,
        actionConfig.nonce
      );

      // Note: walletProvider is already a viem WalletClient in this context
      // We cast it to any/WalletClient to access signTypedData
      const signature = await (walletProvider as any).signTypedData({
        account: accountToUse,
        domain,
        types,
        primaryType,
        message,
      });

      // Ensure agent address is lowercase for API
      // And include signatureChainId as it is required by the API
      const apiAction = {
        ...actionConfig,
        agentAddress: actionConfig.agentAddress.toLowerCase(),
      };

      const payload = {
        action: apiAction,
        nonce: actionConfig.nonce,
        signature: {
          r: signature.slice(0, 66),
          s: '0x' + signature.slice(66, 130),
          v: parseInt(signature.slice(130, 132), 16),
        },
        vaultAddress: null,
      };

      const response = await postExchange(payload);

      if (response.status === 'ok') {
        // Store approval status locally WITHOUT overwriting/touching the keys
        updateAgentApproval(address, true);
        // Transition to Builder Approval pending instead of full success
        setAgentStatus('builder_approval_pending');
        toast.success('Agent approved! Now verify PillarX.');

        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        throw new Error(
          response.response?.data?.toString() || 'Approval failed'
        );
      }
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error('Failed to approve agent', {
        description: error.message,
      });
    } finally {
      setIsApproving(false);
    }
  };

  const copyAddress = () => {
    if (agentAddress) {
      navigator.clipboard.writeText(agentAddress);
      toast.success('Agent address copied!');
    }
  };

  const copyPrivateKey = () => {
    if (agentPrivateKey) {
      navigator.clipboard.writeText(agentPrivateKey);
      toast.success('Private key copied!');
    } else {
      setRevealMode('copy');
      setShowUnlockReveal(true);
    }
  };

  const downloadPrivateKey = () => {
    if (agentPrivateKey) {
      downloadKeyFile(agentAddress, agentPrivateKey);
    } else {
      setRevealMode('download');
      setShowUnlockReveal(true);
    }
  };

  const downloadKeyFile = (addr: string, key: string) => {
    const data = JSON.stringify(
      {
        address: addr,
        privateKey: key,
        createdAt: new Date().toISOString(),
        note: 'KEEP THIS SAFE. DO NOT SHARE.',
      },
      null,
      2
    );

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-wallet-${addr.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Private key downloaded!');
  };

  const handleRemoveAccount = async () => {
    try {
      // Clear data
      clearImportedAccount();

      // Reset all local state
      setAgentAddress('');
      setAgentPrivateKey('');
      setAgentStatus('none');

      // Close any open modals
      setShowPinSetup(false);
      setShowUnlockReveal(false);
      setRevealMode('unlock'); // Reset default

      // Reset validation state
      setValidationData({});
      // Note: Setting validationStatus to 'idle' will trigger the useEffect to run checkStatus()
      // This is desired behavior - it will re-check and find 'none' (or fallback to native agent)
      setValidationStatus('idle');

      toast.success('Imported account removed');

      // Trigger data refresh to clear displayed data
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error: any) {
      console.error('[AgentControls] Error removing account:', error);
      toast.error('Failed to remove account');
    }
  };

  const handleImportAgent = async () => {
    if (!importAccountAddress.trim()) {
      toast.error('Please enter an account address');
      return;
    }

    if (!importPrivateKey.trim()) {
      toast.error('Please enter a private key');
      return;
    }

    // Show loading toast and set validating status
    const loadingToast = toast.loading('Validating agent credentials...');
    setValidationStatus('validating');
    setValidationData({});

    try {
      // Validate account address format
      if (!importAccountAddress.trim().match(/^0x[a-fA-F0-9]{40}$/)) {
        toast.dismiss(loadingToast);
        toast.error('Invalid account address format');
        return;
      }

      // Validate and derive address from private key
      const formattedKey = importPrivateKey.trim().startsWith('0x')
        ? (importPrivateKey.trim() as Hex)
        : (`0x${importPrivateKey.trim()}` as Hex);

      const account = privateKeyToAccount(formattedKey);

      toast.loading('Checking Hyperliquid connection...', { id: loadingToast });

      // Validate that the ACCOUNT ADDRESS exists on Hyperliquid (not the agent)
      try {
        const { getUserState } = await import('../lib/hyperliquid/client');
        const accountState = await getUserState(importAccountAddress.trim());

        if (!accountState) {
          toast.dismiss(loadingToast);
          toast.error('Account address not found on Hyperliquid', {
            description:
              'This address has no Hyperliquid account. Please use a valid account address.',
          });
          return;
        }

        toast.loading('Saving credentials...', { id: loadingToast });

        // INSTEAD of storing immediately, we now PROMPT FOR PIN
        toast.dismiss(loadingToast);
        setShowImportDialog(false);

        //Set pending data
        //Set pending data
        setPendingImportData({
          address: account.address,
          privateKey: formattedKey,
          accountState: accountState,
        });

        // Show Success status immediately - BEFORE Pin Setup
        const openPositions =
          accountState.assetPositions?.filter(
            (p: any) => parseFloat(p.position.szi) !== 0
          ).length || 0;

        setValidationStatus('success');
        setValidationData({
          agentAddress: importAccountAddress.trim() || account.address,
          balance: parseFloat(
            accountState.marginSummary?.totalRawUsd || '0'
          ).toFixed(2),
          openPositions,
        });

        // Open PIN setup
        setShowPinSetup(true);

        // Notify parent validation passed (optional, keeps UI fresh)
        if (onStatusChange) {
          onStatusChange();
        }
      } catch (validationError: any) {
        toast.dismiss(loadingToast);
        console.error('[Import Agent] Validation error:', validationError);

        // Set error status
        setValidationStatus('error');
        setValidationData({
          errorMessage:
            validationError.message ||
            'Could not fetch agent data. Please check your internet connection and try again.',
        });

        toast.error('❌ Failed to connect to Hyperliquid', {
          description:
            validationError.message ||
            'Could not fetch agent data. Please check your internet connection and try again.',
          duration: 5000,
        });
        return;
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error('Import error:', error);
      toast.error('Invalid private key', {
        description: error.message || 'Please check the format and try again',
      });
    }
  };

  const handleRemoveAgent = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsRemoving(true);
    try {
      // Clear from remote first, then local
      await clearAgentWallet(address);

      // Verify deletion
      const stillExists = await getAgentWallet(address);
      if (stillExists) {
        throw new Error(
          'Agent wallet still exists after deletion. Please try again.'
        );
      }

      // Update UI
      setAgentAddress('');
      setAgentPrivateKey('');
      setAgentStatus('none');
      toast.success('Agent wallet removed from all storage');
      onStatusChange?.();
    } catch (error: any) {
      console.error('Remove agent error:', error);
      toast.error(error.message || 'Failed to remove agent wallet');
    } finally {
      setIsRemoving(false);
    }
  };

  const statusConfig = {
    locked: {
      icon: Lock,
      label: 'Active (Locked)',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
    },
    none: {
      icon: AlertCircle,
      label: 'No Agent',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    created: {
      icon: AlertCircle,
      label: 'Not Approved',
      color: 'text-warning',
      bgColor: 'bg-warning/10 border-warning/30',
    },
    'builder_approval_pending': {
      icon: AlertCircle,
      label: 'Setup Incomplete',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
    },
    approved: {
      icon: CheckCircle2,
      label: 'Active',
      color: 'text-success',
      bgColor: 'bg-success/10 border-success/30',
    },
  };

  const config = statusConfig[agentStatus];
  const Icon = config.icon;

  // Add Lock icon import if not present (Wait, imports are at top)
  // I need to add Lock to imports at top manually in first block?
  // Or assume lucide-react has it (it does).
  // Let's add the button for Locked state.

  return (
    <Card className="p-3 pt-4 h-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <config.icon className={cn('h-4 w-4', config.color)} />
            <h3 className={cn('text-base font-semibold', config.color)}>
              Perps Account:
            </h3>
            <Badge
              variant="outline"
              className={cn('ml-2', config.bgColor, config.color)}
            >
              {config.label}
            </Badge>
          </div>
          {isMobile && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isOpen ? 'rotate-180' : ''
                  )}
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          )}
        </div>

        <CollapsibleContent>
          {/* Validation Status Display */}
          {validationStatus !== 'idle' && (
            <div className="mb-3">
              <ValidationStatus
                status={validationStatus}
                agentAddress={validationData.agentAddress}
                balance={validationData.balance}
                openPositions={validationData.openPositions}
                errorMessage={validationData.errorMessage}
              />
            </div>
          )}

          {agentStatus === 'none' && (
            <>
              {!address ? null : isLoadingAgent ? (
                <div className="text-sm text-muted-foreground text-center py-3">
                  Loading agent wallet...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-2 mt-4">
                    <Button
                      onClick={handleCreateAgentClick}
                      disabled={isCreating}
                      className="w-full"
                      size="sm"
                    >
                      {isCreating ? 'Creating...' : 'Create New'}
                    </Button>
                    <Button
                      onClick={() => setShowImportDialog(true)}
                      disabled={isCreating}
                      className="w-full"
                      variant="outline"
                      size="sm"
                    >
                      <Upload className="h-3 w-3 mr-2" />
                      Import Account
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted border border-border rounded p-2">
                    💡 Create a new Hyperliquid agent wallet or import your
                    existing one
                  </div>
                </>
              )}
            </>
          )}

          <Dialog
            open={showImportDialog}
            onOpenChange={(open) => {
              setShowImportDialog(open);
              if (open) {
                // Pre-fill with connected wallet address when dialog opens
                setImportAccountAddress(address || '');
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Existing Agent</DialogTitle>
                <DialogDescription>
                  Enter the private key of your Hyperliquid agent wallet and
                  specify which account address to associate it with.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountAddress">Account Address</Label>
                  <Input
                    id="accountAddress"
                    type="text"
                    placeholder="0x..."
                    value={importAccountAddress}
                    onChange={(e) => setImportAccountAddress(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the PillarX account that will control the agent. You
                    can change this to any address.
                  </p>
                </div>
                <div>
                  <Label htmlFor="privateKey">Agent Private Key</Label>
                  <Input
                    id="privateKey"
                    type="password"
                    placeholder="0x..."
                    value={importPrivateKey}
                    onChange={(e) => setImportPrivateKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The private key of your Hyperliquid agent wallet
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleImportAgent} className="flex-1">
                    Import
                  </Button>
                  <Button
                    onClick={() => setShowImportDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {agentStatus === 'locked' && (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 mt-4"
              onClick={() => {
                setRevealMode('unlock');
                setShowUnlockReveal(true);
              }}
            >
              Unlock Wallet
            </Button>
          )}

          {agentStatus === 'created' && (
            <div className="space-y-1.5 mt-4">
              {masterBalance < 10 && userState ? (
                <DepositModal
                  userState={userState}
                  ethPrice={ethPrice}
                  trigger={
                    <Button className="w-full" size="sm">
                      Deposit $10 USDC to Trade
                    </Button>
                  }
                />
              ) : (
                <Button
                  onClick={handleApproveAgent}
                  disabled={isApproving || !address}
                  className="w-full"
                  size="sm"
                >
                  {isApproving ? 'Approving...' : 'Activate Account'}
                </Button>
              )}

              <Button
                onClick={handleRemoveAgent}
                disabled={isRemoving || isApproving}
                variant="outline"
                className="w-full text-xs"
                size="sm"
              >
                {isRemoving ? 'Removing...' : 'Remove Account'}
              </Button>
            </div>

          )}

          {agentStatus === 'builder_approval_pending' && (
            <div className="space-y-3 mt-4">


              <Button onClick={handleApproveBuilder} disabled={isApprovingBuilder} className="w-full" size="sm">
                {isApprovingBuilder ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve PillarX'}
              </Button>

              <Button
                onClick={handleRemoveAgent}
                disabled={isRemoving || isApprovingBuilder}
                variant="outline"
                className="w-full text-xs"
                size="sm"
              >
                {isRemoving ? 'Removing...' : 'Remove Account'}
              </Button>
            </div>
          )}

          {agentStatus === 'approved' && (
            <div className="space-y-3 mt-4">
              <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      Activated Account
                    </span>
                  </div>
                  <div className="flex items-center gap-1">

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setRevealMode('reveal');
                            setShowUnlockReveal(true);
                          }}
                        >
                          Reveal Private Key
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleRemoveAccount}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Address:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="font-mono bg-background/50 rounded px-2 py-1 text-[10px] flex-1">
                      {agentAddress}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        navigator.clipboard.writeText(agentAddress);
                        toast.success('Address copied');
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <PinSetupModal
            isOpen={showPinSetup}
            onConfirm={handleAgentCreationWithPin}
            onCancel={() => setShowPinSetup(false)}
          />

          <UnlockWalletModal
            isOpen={showUnlockReveal}
            onUnlock={handleUnlockForReveal}
            onClose={() => setShowUnlockReveal(false)}
          />

          <PrivateKeyModal
            isOpen={privateKeyModalState.isOpen}
            address={privateKeyModalState.address}
            privateKey={privateKeyModalState.privateKey}
            mode={privateKeyModalState.mode}
            mainAddress={address || undefined}
            onClose={() =>
              setPrivateKeyModalState({
                ...privateKeyModalState,
                isOpen: false,
              })
            }
          />
        </CollapsibleContent>
      </Collapsible>
    </Card >
  );
}
