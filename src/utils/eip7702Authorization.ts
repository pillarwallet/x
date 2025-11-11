import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { SignAuthorizationReturnType } from 'viem/accounts';

// From KernelVersionToAddressesMap[KERNEL_V3_3].accountImplementationAddress
export const OUR_EIP7702_IMPLEMENTATION_ADDRESS =
  '0xd6CEDDe84be40893d153Be9d467CD6aD37875b28';

/**
 * Checks if EOA has our Kernel v3.3 EIP-7702 implementation on the given chain.
 * If not, gets authorization for our implementation.
 *
 * @param kit - The EtherspotTransactionKit instance
 * @param chainId - The chain ID to check
 * @returns Authorization object if needed, null if already has our implementation, undefined if not in delegatedEoa mode
 */
export async function getEIP7702AuthorizationIfNeeded(
  kit: EtherspotTransactionKit,
  chainId: number
): Promise<SignAuthorizationReturnType | null | undefined> {
  const walletMode = kit.getEtherspotProvider().getWalletMode();
  if (walletMode !== 'delegatedEoa') {
    return undefined;
  }

  try {
    // Check if EOA is designated on this chain
    const isDesignated = await kit.isDelegateSmartAccountToEoa(chainId);

    if (isDesignated === true) {
      // EOA is designated, check if it's our implementation
      const etherspotProvider = kit.getEtherspotProvider();
      const publicClient = await etherspotProvider.getPublicClient(chainId);
      const walletAddress = await kit.getWalletAddress(chainId);

      if (!walletAddress) {
        console.warn(
          `Cannot get wallet address for chain ${chainId}, skipping authorization check`
        );
        return null;
      }

      // Get code at EOA address
      const senderCode = await publicClient.getCode({
        address: walletAddress as `0x${string}`,
      });

      if (senderCode && senderCode.startsWith('0xef0100')) {
        // EIP-7702 format: 0xef0100 + 20-byte delegate address
        // Extract delegate address using regex
        const match = senderCode.match(/^0xef0100(.{40})$/);
        const delegateAddress = match ? `0x${match[1]}` : null;

        // Check if it's our implementation (Kernel V3.3)
        const isOurImplementation =
          delegateAddress?.toLowerCase() ===
          OUR_EIP7702_IMPLEMENTATION_ADDRESS.toLowerCase();

        if (isOurImplementation) {
          // Already has our implementation, no authorization needed
          return null;
        }
      }
    }

    // Not designated or not our implementation - need authorization
    const authResult = await kit.delegateSmartAccountToEoa({
      chainId,
      delegateImmediately: false, // Just get authorization, don't execute
    });

    return authResult.authorization || null;
  } catch (error: unknown) {
    // Log and try to get authorization anyway as a fallback
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `Failed to check/get EIP-7702 authorization for chain ${chainId}: ${message}`
    );
    try {
      const authResult = await kit.delegateSmartAccountToEoa({
        chainId,
        delegateImmediately: false,
      });
      return authResult.authorization || null;
    } catch (fallbackError: unknown) {
      const fallbackMessage =
        fallbackError instanceof Error
          ? fallbackError.message
          : String(fallbackError);
      console.error(
        `Fallback authorization also failed for chain ${chainId}: ${fallbackMessage}`
      );
      return null;
    }
  }
}
