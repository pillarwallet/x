import { useLogout } from '@privy-io/react-auth';
import { useAccount, useDisconnect } from 'wagmi';

/**
 * Custom hook that provides comprehensive logout functionality
 * Handles both Privy and WAGMI disconnection
 */
export const useComprehensiveLogout = () => {
  const { logout: privyLogout } = useLogout();
  const { isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const logout = async () => {
    // First, disconnect from WAGMI if connected
    if (isConnected) {
      try {
        await wagmiDisconnect();
      } catch (e) {
        console.error('Error disconnecting from WAGMI:', e);
      }
    }
    
    // Then logout from Privy
    try {
      await privyLogout();
    } catch (e) {
      console.error('Error during Privy logout:', e);
    }
    
    // Clear any stored data
    try {
      localStorage.removeItem('ACCOUNT_VIA_PK');
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  };

  return { logout };
}; 