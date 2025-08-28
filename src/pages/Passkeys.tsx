import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAccount, useConnectors } from 'wagmi';
import { EtherspotBundler, ModularSdk, MODULE_TYPE, sleep, WalletProviderLike } from "modularPasskeys";

// components
import Button from '../components/Button';

// services
import { registerPasskey, authenticateWithPasskey, signWithPasskey, isPasskeySupported, isPasskeyAvailable } from '../services/passkeys';

// images
import PillarXLogo from '../assets/images/pillarX_full_white.png';
import { createWalletClient, custom, http } from 'viem';
import { getNetworkViem } from '../apps/deposit/utils/blockchain';
import { privateKeyToAccount } from 'viem/accounts';

const Passkeys = () => {
  const { address } = useAccount();
  const connectors = useConnectors();
  const [t] = useTranslation();
  const [isPasskeySupportedState, setIsPasskeySupportedState] = useState(false);
  const [isPasskeyAvailableState, setIsPasskeyAvailableState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eAddress, setEAddress] = useState("");
  const [modularSdk, setModularSdk] = useState<ModularSdk | null>(null);

  /**
   * As soon as an address is connected we need to 
   * instantiate the ModularSdk with the connector
   */

  useEffect(() => {

    const initModularSdk = async () => {
      if (connectors && address) {

        // Find the WalletConnect connector
        const walletConnectConnector = connectors.find(
          (connector) => connector.id === 'walletConnect'
        );

        if (walletConnectConnector) {
          const provider: any = await walletConnectConnector.getProvider();

          console.log('Provider', provider);
        
          const modularSdk = new ModularSdk(createWalletClient({
            account: privateKeyToAccount(''),
            chain: getNetworkViem(1),
            transport: http(),
          }), {
            chainId: 1,
            bundlerProvider: new EtherspotBundler(
              1,
              "",
            ),
          });

          console.log('ModularSdk initialized', modularSdk);
          const etherspotAddress = await modularSdk.getCounterFactualAddress();
          setEAddress(etherspotAddress);
          setModularSdk(modularSdk);
        }
      }
    }

    initModularSdk();
  }, [connectors, address]);

  // Check passkey support on component mount
  useEffect(() => {
    const checkPasskeySupport = async () => {
      const supported = isPasskeySupported();
      console.log('Passkey supported:', supported);
      setIsPasskeySupportedState(supported);
      
      if (supported) {
        const available = await isPasskeyAvailable();
        console.log('Passkey available:', available);
        setIsPasskeyAvailableState(available);
      }
    };

    checkPasskeySupport();
  }, []);

  const handlePasskeyRegistration = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const success = await registerPasskey(address, `user_${address.slice(0, 8)}`);
      if (success) {
        alert('Passkey registration successful!');
      } else {
        alert('Passkey registration failed');
      }
    } catch (error) {
      console.error('Passkey registration error:', error);
      alert('Passkey registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyAuthentication = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authenticateWithPasskey(address);
      if (success) {
        alert('Passkey authentication successful!');
      } else {
        alert('Passkey authentication failed');
      }
    } catch (error) {
      console.error('Passkey authentication error:', error);
      alert('Passkey authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeySigning = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Create a custom challenge for testing (this would be your transaction data)
      const customChallenge = `Sign this transaction: ${Date.now()}`;
      
      const result = await signWithPasskey(address, customChallenge);
      if (result.verified) {
        alert(`Passkey signing successful!\nSigned Challenge: ${result.signedChallenge}\nSignature: ${result.signature}`);
      } else {
        alert('Passkey signing failed');
      }
    } catch (error) {
      console.error('Passkey signing error:', error);
      alert('Passkey signing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstallPasskeyValidator = async () => {
    // set your module address
    const moduleAddress = "0x1e02Ff20b604C2B2809193917Ea22D8602126837";

    try {
      console.log('Installing passkey validator with module address:', moduleAddress);
      const uoHash = await modularSdk?.installModule(MODULE_TYPE.VALIDATOR, moduleAddress)

      console.log(`UserOpHash: ${uoHash}`);

      // get transaction hash...
      console.log('Waiting for transaction...');
      let userOpsReceipt = null;
      const timeout = Date.now() + 10000; // 10 seconds timeout
      while ((userOpsReceipt == null) && (Date.now() < timeout)) {
        await sleep(2);
        userOpsReceipt = await modularSdk?.getUserOpReceipt(uoHash || '');
      }
      console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
    } catch (error) {
      console.error('Passkey validator installation error:', error);
      alert('Passkey validator installation failed. Please try again.');
    } 
  };

  return (
    <Wrapper>
      <LogoContainer>
        <img
          src={PillarXLogo}
          alt="pillar-x-logo"
          className="max-w-[300px] h-auto"
        />
      </LogoContainer>
      <ContentWrapper>
        <Title>Passkey Management</Title>
        <p>Connected address: {address}</p>
        <p>Etherspot address: {eAddress}</p>
        <Description>
          Set up and manage your passkeys for secure authentication.
        </Description>
        
        {!address ? (
          <WalletRequired>
            <p>Please connect your wallet to manage passkeys.</p>
          </WalletRequired>
        ) : (
          <>
            {isPasskeySupportedState && isPasskeyAvailableState ? (
              <ButtonContainer>
                <Button 
                  onClick={handlePasskeyRegistration} 
                  $fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering Passkey...' : 'Register Passkey'}
                </Button>
                <Button 
                  onClick={handlePasskeyAuthentication} 
                  $fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Login with Passkey'}
                </Button>
                <Button 
                  onClick={handlePasskeySigning} 
                  $fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing...' : 'Sign with Passkey'}
                </Button>
                <Button
                  onClick={handleInstallPasskeyValidator} 
                  $last 
                  $fullWidth 
                >
                  Install Passkey Validator
                </Button>
              </ButtonContainer>
            ) : (
              <UnsupportedMessage>
                <p>Passkeys are not supported in your current browser or device.</p>
                <p>Please use a modern browser with biometric authentication support.</p>
              </UnsupportedMessage>
            )}
          </>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  margin-bottom: 40px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #a0a0a0;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WalletRequired = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
  
  p {
    color: #a0a0a0;
    margin: 0;
  }
`;

const UnsupportedMessage = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
  
  p {
    color: #a0a0a0;
    margin: 0 0 0.5rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default Passkeys; 