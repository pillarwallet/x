import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAccount, useConnectors } from 'wagmi';
import { EtherspotBundler, ModularSdk, MODULE_TYPE, sleep, WalletProviderLike } from "modularPasskeys";
import { toWebAuthnAccount, WebAuthnAccount } from 'viem/account-abstraction'


// components
import Button from '../components/Button';

// services
import { registerPasskey, authenticateWithPasskey, signWithPasskey, isPasskeySupported, isPasskeyAvailable, getPasskeyPublicKey, getPasskeyDetails } from '../services/passkeys';

// images
import PillarXLogo from '../assets/images/pillarX_full_white.png';
import { createPublicClient, createWalletClient, custom, encodeAbiParameters, http, parseAbiParameters, toBytes, toHex } from 'viem';
import { getNetworkViem } from '../apps/deposit/utils/blockchain';
import { ethers } from 'ethers';
import { mainnet } from 'viem/chains';

const Passkeys = () => {
  const { address } = useAccount();
  const connectors = useConnectors();
  const [t] = useTranslation();
  const [isPasskeySupportedState, setIsPasskeySupportedState] = useState(false);
  const [isPasskeyAvailableState, setIsPasskeyAvailableState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eAddress, setEAddress] = useState("");
  const [modularSdk, setModularSdk] = useState<ModularSdk | null>(null);
  const [publicKey, setPublicKey] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [username, setUsername] = useState("");
  const [webAuthnAccount, setWebAuthnAccount] = useState<WebAuthnAccount | null>(null);

  const publicClient = createPublicClient({ 
    chain: mainnet,
    transport: http()
  })

  // Generate random alphanumeric username
  const generateRandomUsername = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 12; // Generate 12 character username
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // https://stackoverflow.com/questions/75765351/how-can-the-public-key-created-by-webauthn-be-decoded
  function getXYCoordinates(publicKeyBase64: string) {
    const publicKeyBuffer = Buffer.from(publicKeyBase64, 'base64');
    let b = Array.from(publicKeyBuffer);
    b = b.slice(-128)
    const x = b.slice(0,32)
    const y = b.slice(-32)

    return { x, y };
  }

  // Generate and store random username if not exists
  useEffect(() => {
    const existingUsername = localStorage.getItem('username');
    if (!existingUsername) {
      const randomUsername = generateRandomUsername();
      setUsername(randomUsername);
      localStorage.setItem('username', randomUsername);
      console.log('Generated and stored random username:', randomUsername);
    } else {
      console.log('Existing username found:', existingUsername);
      setUsername(existingUsername);
    }
  }, []);

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
    if (!username) {
      alert('Please set a username first');
      return;
    }

    setIsLoading(true);
    try {
      const success = await registerPasskey(username, `PillarX User: ${username}`);
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
    if (!username) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authenticateWithPasskey(username);
      if (success) {
        alert('Passkey authentication successful!');

        getSenderAddress();
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

  /**
   * Determine what the sender address will be
   */
  const getSenderAddress = async () => {
    if (!username) {
      alert('Please set a username first');
      return;
    }
    
    const { x, y } = getXYCoordinates(publicKey);
    console.log('x', x);
    console.log('y', y);
    console.log('username', username);

    // Use viem to call a simulation on the getSenderAddress function
    // of the entry point 0.7 contract on ethereum mainnet
    const senderAddress = await publicClient.simulateContract({
      account: null,
      address: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
      abi: [
        {
          inputs: [
            { internalType: "bytes", name: "passkeyId", type: "bytes" },
          ],
          name: "getSenderAddress",
          outputs: [],
          stateMutability: "vinonpayableew",
          type: "function",
        },
      ],
      functionName: "getSenderAddress",
      args: [`${Buffer.from(x).toString('hex')}${Buffer.from(y).toString('hex')}${Buffer.from(username).toString('hex')}`],
    }).catch((error) => {
      console.error('Error simulating contract:', error);
      return null;
    });

    console.log('senderAddress', senderAddress);
  }

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
       if (!publicKey || !credentialId) {
         alert('Please get your passkey details first by clicking "Get Public Key"');
         return;
       }
   
       try {
          // set your module address
          // https://www.npmjs.com/package/@zerodev/passkey-validator?activeTab=code
          const moduleAddress = "0xbA45a2BFb8De3D24cA9D7F1B551E14dFF5d690Fd";

         console.log('Installing passkey validator with module address:', moduleAddress);
         console.log('Using credential ID:', credentialId);
 
         const { x, y } = getXYCoordinates(publicKey);

         // Example values to encode
         const pubKeyX = BigInt('0x' + Buffer.from(x).toString('hex'))           // replace with your uint256 value
         const pubKeyY = BigInt('0x' + Buffer.from(y).toString('hex'))           // replace with your uint256 value
         const authenticatorIdHash = '0x' + Buffer.from(credentialId).toString('hex') // 32-byte hex string
         const authenticatorIdBigInt = BigInt('0x' + Buffer.from(credentialId).toString('hex'))  
         
          console.log('pubKeyX', pubKeyX);
          console.log('pubKeyY', pubKeyY);
          console.log('authenticatorIdHash', authenticatorIdHash);
          console.log('authenticatorIdBigInt', authenticatorIdBigInt);
   

      
          // The ABI parameter description for your use case.
          // Structs in Solidity map to 'tuple' types.
          const abiParameters = [
            {
              type: "tuple",
              components: [
                { type: "uint256" },
                { type: "uint256" },
              ]
            },
            { type: "bytes32" }
          ]

          console.log('pubKeyX', pubKeyX);
          console.log('pubKeyY', pubKeyY);
          console.log('credentialId', credentialId);

          // const encodedAbiParameters = encodeAbiParameters(abiParameters, [
          //   {pubKeyX: pubKeyX, pubKeyY: pubKeyY},
          //   credentialId
          // ])

          const initData = ethers.utils.defaultAbiCoder.encode(
            [
              "tuple(uint256 pubKeyX, uint256 pubKeyY)",
              "bytes32"
            ],
            [
              [pubKeyX, pubKeyY],
              ethers.utils.formatBytes32String(credentialId)
            ]);

      console.log('initData', initData);
 
       const uoHash = await modularSdk?.installModule(MODULE_TYPE.VALIDATOR, moduleAddress, initData);
 
       console.log(`UserOpHash: ${uoHash}`);
 
       // get transaction hash...
       console.log('Waiting for transaction...');
       let userOpsReceipt = null;
       const timeout = Date.now() + 60000; // 60 seconds timeout
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

   const handleGetPublicKey = async () => {
     if (!username) {
       alert('Please connect your wallet first');
       return;
     }

     setIsLoading(true);
     try {
       const passkeyDetails = await getPasskeyDetails(username);
       if (passkeyDetails) {
         setPublicKey(passkeyDetails.publicKey);
         setCredentialId(passkeyDetails.credentialId);

         const publicKeyAsHex = `0x${Buffer.from(passkeyDetails.publicKey, 'base64').toString('hex')}`;

         const webAuthnAccount = toWebAuthnAccount({
          credential: {
            id: passkeyDetails.credentialId,
            publicKey: publicKeyAsHex as `0x${string}`,
          },
          rpId: 'localhost',
         });

         console.log('passkeyDetails publicKey', publicKeyAsHex);
         console.log('webAuthnAccount', webAuthnAccount);

         alert(`Passkey details retrieved successfully!\nPublic Key: ${passkeyDetails.publicKey}\nCredential ID: ${passkeyDetails.credentialId}`);
       } else {
         alert('No passkey found for this address');
       }
     } catch (error) {
       console.error('Failed to get passkey details:', error);
       alert('Failed to retrieve passkey details. Please try again.');
     } finally {
       setIsLoading(false);
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
        <p>Username: {username}</p>
        <p>Etherspot address: {eAddress}</p>
        {publicKey && <p>Public Key: {publicKey}</p>}
        {credentialId && <p>Credential ID: {credentialId}</p>}
        <Description>
          Set up and manage your passkeys for secure authentication.
        </Description>
        
        {!username ? (
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
                  $fullWidth 
                >
                  Install Passkey Validator
                </Button>
                <Button
                  onClick={handleGetPublicKey} 
                  $last 
                  $fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? 'Getting Public Key...' : 'Get Public Key'}
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