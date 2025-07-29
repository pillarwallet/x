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
    console.log('Comprehensive logout initiated - cleaning up all connections...');
    
    // First, disconnect from WAGMI if connected
    if (isConnected) {
      try {
        console.log('Disconnecting from WAGMI...');
        await wagmiDisconnect();
        console.log('WAGMI disconnected successfully');
      } catch (e) {
        console.error('Error disconnecting from WAGMI:', e);
      }
    }
    
    // Then logout from Privy
    try {
      console.log('Logging out from Privy...');
      await privyLogout();
      console.log('Privy logout successful');
    } catch (e) {
      console.error('Error during Privy logout:', e);
    }
    
    // Clear any stored data
    console.log('Clearing dApp storage...');
    try {
      localStorage.removeItem('ACCOUNT_VIA_PK');
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
    
    console.log('Logout completed successfully');
  };

  return { logout };
}; 