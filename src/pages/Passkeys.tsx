import { useState, useEffect } from 'react';
import { toSimpleSmartAccount } from 'permissionless/accounts'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAccount, useConnectors } from 'wagmi';
import { EtherspotBundler, ModularSdk, MODULE_TYPE, sleep } from "modularPasskeys";
import { BundlerClient, createBundlerClient, SmartAccountImplementation, toSmartAccount, toWebAuthnAccount, WebAuthnAccount } from 'viem/account-abstraction'
import { encodeFunctionData, Hex, hexToBytes, keccak256, pad, parseAbi, parseEther } from 'viem';
import ModularEtherspotWalletFactory from '../assets/data/ModularEtherspotWalletFactory.json';


// components
import Button from '../components/Button';

// services
import { registerPasskey, authenticateWithPasskey, signWithPasskey, isPasskeySupported, isPasskeyAvailable, getPasskeyPublicKey, getPasskeyDetails } from '../services/passkeys';

// images
import PillarXLogo from '../assets/images/pillarX_full_white.png';
import { concat, createPublicClient, createWalletClient, custom, encodeAbiParameters, http, parseAbiParameters, stringToBytes, stringToHex, toBytes, toHex } from 'viem';
import { getNetworkViem } from '../apps/deposit/utils/blockchain';
import { BigNumber, ethers } from 'ethers';
import { base, mainnet } from 'viem/chains';
import { privateKeyToAccount, toAccount } from 'viem/accounts';
import { bootstrapAbi, BootstrapConfig, getPasskeyOwnerAddress, makeBootstrapConfig, modulesAbi, toEtherspotSmartAccount } from '../utils/viem';

export const factoryAbi = [
  'function createAccount(bytes32 salt,bytes calldata initCode) returns (address)',
  'function getAddress(bytes32 salt,bytes calldata initcode) view returns (address)'
]

const validatorAddress = '0xbA45a2BFb8De3D24cA9D7F1B551E14dFF5d690Fd'; // ZeroDev
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
const bootstrapAddress = '0xCF2808eA7d131d96E5C73Eb0eCD8Dc84D33905C7';

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
  const [eoaAddress, setEoaAddress] = useState("");
  const [webAuthnAccount, setWebAuthnAccount] = useState<WebAuthnAccount | null>(null);
  const [bundlerClient, setBundlerClient] = useState<BundlerClient | null>(null);
  const [etherspotSmartAccount, setEtherspotSmartAccount] = useState<Awaited<ReturnType<typeof toEtherspotSmartAccount>> | null>(null);

  function parseDERSignature(signature: Uint8Array): { r: bigint, s: bigint } {
    // DER parsing logic to extract r and s from ECDSA signature
    // This is complex - you might want to use a library like @noble/secp256k1

    // Simplified version (you'll need proper DER parsing):
    const r = BigInt('0x' + Buffer.from(signature.slice(6, 38)).toString('hex'));
    const s = BigInt('0x' + Buffer.from(signature.slice(40, 72)).toString('hex'));

    return { r, s };
  }

  function base64UrlEncode(buffer: Uint8Array): Uint8Array {
    const base64 = Buffer.from(buffer).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return new TextEncoder().encode(base64);
  }

  function base64UrlDecode(str: string): Uint8Array {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    const padded = base64 + '='.repeat(padding ? 4 - padding : 0);
    return new Uint8Array(Buffer.from(padded, 'base64'));
  }

  const signUserOpWithPasskey = async (userOpHash: string, credentialId: string) => {
    // 1. Create challenge from UserOp hash
    const challenge = base64UrlEncode(hexToBytes(userOpHash as `0x${string}`));

    // 2. Get WebAuthn credential with challenge
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: challenge as BufferSource,
        allowCredentials: [{
          type: "public-key",
          id: base64UrlDecode(credentialId) as BufferSource, // Your stored credential ID
        }],
        userVerification: "required",
        timeout: 60000,
      }
    }) as PublicKeyCredential;

    // 3. Parse the WebAuthn response
    const response = credential.response as AuthenticatorAssertionResponse;
    const clientDataJSON = new TextDecoder().decode(response.clientDataJSON);
    const authenticatorData = new Uint8Array(response.authenticatorData);

    // 4. Extract r and s from the DER signature
    const signature = new Uint8Array(response.signature);
    const { r, s } = parseDERSignature(signature);

    // 5. Find the challenge location in clientDataJSON
    const responseTypeLocation = clientDataJSON.indexOf('"type":"webauthn.get"');

    // 6. Encode the signature in the required format
    return encodeAbiParameters(
      [
        { name: "authenticatorData", type: "bytes" },
        { name: "clientDataJSON", type: "string" },
        { name: "responseTypeLocation", type: "uint256" },
        { name: "r", type: "uint256" },
        { name: "s", type: "uint256" },
        { name: "usePrecompiled", type: "bool" }
      ],
      [
        `0x${Buffer.from(authenticatorData).toString('hex')}`, // ← Real authenticator data
        clientDataJSON, // ← Real client data with your challenge
        BigInt(responseTypeLocation), // ← Actual location in JSON
        r, // ← Real r value from signature
        s, // ← Real s value from signature
        false // ← Usually false (can be true for gas optimization)
      ]
    );
  };

  function _makeBootstrapConfig(module: string, data: string): BootstrapConfig {
    const config: BootstrapConfig = {
        module: "",
        data: ""
    };
    config.module = module;
    const encodedFunctionData = encodeFunctionData({
        functionName: 'onInstall',
        abi: parseAbi(modulesAbi),
        args: [data],
      });
  
    config.data = encodedFunctionData;
  
    return config;
  }

  // const derivePrivateKeyFromPasskey = async(credential: string) => {
  //   // This is a simplified approach - in production, you'd want to:
  //   // 1. Use proper HKDF or similar key derivation
  //   // 2. Store the derived key securely
  //   // 3. Use the passkey for signing operations
    
  //   const hash = crypto.subtle.digest('SHA-256', toBytes(credential))
  //   return hash.then(hashBuffer => {
  //     const hashArray = new Uint8Array(hashBuffer)
  //     return `0x${Array.from(hashArray)
  //       .map(b => b.toString(16).padStart(2, '0'))
  //       .join('')}` as Hex
  //   }) as any // Simplified for example - handle Promise properly in real implementation
  // }

  const publicClient = createPublicClient({ 
    chain: mainnet,
    transport: http('https://node1.web3api.com')
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
    
    // WebAuthn public keys are CBOR encoded
    // X coordinate starts at byte 10 (after CBOR headers)
    // Y coordinate starts at byte 45 (after X coordinate and CBOR headers)
    const x = Array.from(publicKeyBuffer.slice(10, 42)); // 32 bytes for x
    const y = Array.from(publicKeyBuffer.slice(45, 77)); // 32 bytes for y

    return { x, y };
  }

  useEffect(() => {
    if (publicKey && credentialId) {
      initialiseBundlerClient();
    }
  }, [publicKey, credentialId]);

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

  const handleLoginWithPasskey = async () => {
    if (!username) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authenticateWithPasskey(username);
      console.log('Passkey login successful', success);
      if (success) {
        // await getSenderAddress();
        await handleGetPublicKey();
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
  // const getSenderAddress = async () => {
  //   if (!username) {
  //     alert('Please set a username first');
  //     return;
  //   }
    
  //   const { x, y } = getXYCoordinates(publicKey);
  //   console.log('x', x);
  //   console.log('y', y);
  //   console.log('username', username);


  //   // Use viem to call a simulation on the getSenderAddress function
  //   // of the entry point 0.7 contract on ethereum mainnet
  //   const senderAddress = await publicClient.readContract({
  //     account: '0x0000000000000000000000000000000000000000',
  //     address: "0x38CC0EDdD3a944CA17981e0A19470d2298B8d43a",
  //     abi: [
  //       {
  //         "inputs": [
  //           {
  //             "internalType": "bytes32",
  //             "name": "salt",
  //             "type": "bytes32"
  //           },
  //           {
  //             "internalType": "bytes",
  //             "name": "initcode",
  //             "type": "bytes"
  //           }
  //         ],
  //         "name": "getAddress",
  //         "outputs": [
  //           {
  //             "internalType": "address",
  //             "name": "",
  //             "type": "address"
  //           }
  //         ],
  //         "stateMutability": "view",
  //         "type": "function"
  //       }
  //     ],
  //     functionName: "getAddress",
  //     args: [keccak256(toHex(`${x}${y}${username}`)), '0x'],
  //   }).catch((error) => {
  //     console.error('Error calling contract:', error);
  //     return null;
  //   });

  //   console.log('senderAddress calculated!', senderAddress);

  //   /**
  //    * Next attempt to instantiate the Modular SDK
  //    */
  //   const privateKey = await derivePrivateKeyFromPasskey(`${x}${y}${username}`);
  //   console.log('privateKey', privateKey);

  //   const pkAccount = privateKeyToAccount(privateKey);
  //   const client = createWalletClient({
  //     account: pkAccount,
  //     chain: mainnet,
  //     transport: http('https://node1.web3api.com')
  //   });

  //   const bundlerClient = createBundlerClient({ 
  //     client, 
  //     transport: http('https://rpc.etherspot.io/v2/8453') 
  //   });

  //   const addresses = bundlerClient.client.account.address;
  //   setEoaAddress(addresses);
  //   console.log('bundlerClient.client.account.address', addresses);

  //   const modularSdk = new ModularSdk(client, {
  //     chainId: base.id,
  //     bundlerProvider: new EtherspotBundler(base.id, import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY || ''),
  //   });

  //   const counterFactualAddress = await modularSdk.getCounterFactualAddress();
  //   console.log('counterFactualAddress', counterFactualAddress);
  //   setEAddress(counterFactualAddress);

  //   setModularSdk(modularSdk);
  //   console.log('finished');
  // }

  const handlePasskeySigning = async () => {
    setIsLoading(true);
    try {
      // Create a custom challenge for testing (this would be your transaction data)
      const customChallenge = `Sign this transaction: ${Date.now()}`;
      
      const result = await signWithPasskey(username, customChallenge);
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

    const typedData = {
      domain: {
        name: 'PillarX',
        version: '1',
        chainId: base.id,
      },
      types: {
        Message: [
          { name: 'content', type: 'string' }
        ]
      },
      primaryType: 'Message',
      message: {
        content: 'hello'
      }
    };
    
    const signedMessage = await modularSdk?.signTypedData(typedData);
    console.log('signed message', signedMessage);
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

          // Hash the credential ID to ensure it fits in bytes32
          const credentialIdHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(credentialId));
          
          const initData = ethers.utils.defaultAbiCoder.encode(
            [
              "tuple(uint256 pubKeyX, uint256 pubKeyY)",
              "bytes32"
            ],
            [
              [pubKeyX, pubKeyY],
              credentialIdHash
            ]);

       console.log('pubkeyX', pubKeyX);
       console.log('pubkeyY', pubKeyY);
       console.log('credentialIdHash', credentialIdHash);
       console.log('initData', initData);
 
       console.log('installing validator for:', await modularSdk?.getCounterFactualAddress());
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
     } 
   };

   const handleGetPublicKey = async () => {
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

         return passkeyDetails?.publicKey || null;
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

  const handleSendNativeToken = async () => {
    if (!modularSdk) {
      alert('Please complete the setup first by clicking "Login with Passkey"');
      return;
    }

    setIsLoading(true);
    try {
      const recipient = '0x11041744893Fa72629aB93ea8adaf35A1dc24AA5';
      
      
      console.log('Sending native token...');
      console.log('From:', await modularSdk.getCounterFactualAddress());
      console.log('To:', recipient);

      // add transactions to the batch
      const transactionBatch = await modularSdk.addUserOpsToBatch({ to: recipient, value: ethers.utils.parseEther("0") });
      console.log('transactions: ', transactionBatch);

      // get balance of the account address
      const balance = await modularSdk.getNativeBalance();

      console.log('balances: ', balance);

      // estimate transactions added to the batch and get the fee data for the UserOp
      const op = await modularSdk.estimate();
      console.log(`Estimate UserOp: `, op);

      // sign the UserOp and sending to the bundler...
      const uoHash = await modularSdk.send(op);
      console.log(`UserOpHash: ${uoHash}`);
      console.log(`UserOpHash: ${uoHash}`);

      // Wait for transaction confirmation
      console.log('Waiting for transaction...');
      let userOpsReceipt = null;
      const timeout = Date.now() + 60000; // 60 seconds timeout
      while ((userOpsReceipt == null) && (Date.now() < timeout)) {
        await sleep(2);
        userOpsReceipt = await modularSdk.getUserOpReceipt(uoHash || '');
      }
      
      if (userOpsReceipt) {
        console.log('Transaction successful:', userOpsReceipt);
        alert(`Transaction successful!\nSent 0.001 ETH to ${recipient}\nTx Hash: ${userOpsReceipt}`);
      } else {
        alert('Transaction timeout - please check manually');
      }
    } catch (error) {
      console.error('Send native token error:', error);
      alert(`Transaction failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const initialiseBundlerClient = async () => {
    const owner = toWebAuthnAccount({
      credential: {
        id: credentialId,
        publicKey: keccak256(toHex(publicKey)),
      },
    });

    const etherspotAccount = await toEtherspotSmartAccount({
      client: publicClient,
      webAuthnAccount: owner,
      passkeyPublicKey: publicKey,
      passkeyCredentialId: credentialId,
      entryPoint: {
        address: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
        version: '0.7',
      }
     });

     setEtherspotSmartAccount(etherspotAccount);

    const bundlerClient = createBundlerClient({ 
      account: etherspotAccount,
      transport: http(`https://rpc.etherspot.io/v2/1?api-key=${import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY}`) 
    });

    setBundlerClient(bundlerClient);
  }

  const handleGetSenderAddress = async () => {
    /**
     * Prepare the user operation
     */

    if (!bundlerClient || !etherspotSmartAccount) {
      alert('Please initialize the bundler client and smart account first');
      return;
    }
    
    const userOperation = await bundlerClient.prepareUserOperation({ 
      account: etherspotSmartAccount,
      calls: [{
        to: '0x11041744893Fa72629aB93ea8adaf35A1dc24AA5',
        value: parseEther('0.00001')
      }]
    });

    console.log('Estimated User operation:', userOperation);

    /**
     * Send the user operation to the bundler
     */
    const userOpHash = await bundlerClient.sendUserOperation({
      account: etherspotSmartAccount,
      calls: [{
        to: '0x11041744893Fa72629aB93ea8adaf35A1dc24AA5',
        value: parseEther('0.00001')
      }]
    });

    console.log('User operation hash:', userOpHash);
  }

  const handleDeployAccount = async () => {
    /**
     * Prepare the user operation
     */

    if (!bundlerClient || !etherspotSmartAccount) {
      alert('Please initialize the bundler client and smart account first');
      return;
    }

    /**
     * Start init code
     */

    const { x, y } = getXYCoordinates(publicKey);
  
    // Convert coordinate arrays to hex strings properly
    const pubKeyXHex = Buffer.from(x).toString('hex')
    const pubKeyYHex = Buffer.from(y).toString('hex')
    
    // Ensure we have valid hex values before converting to BigInt
    if (!pubKeyXHex || !pubKeyYHex) {
      throw new Error('Invalid public key coordinates: empty hex values')
    }
    
    const pubKeyX = BigInt('0x' + pubKeyXHex)
    const pubKeyY = BigInt('0x' + pubKeyYHex)
    const credentialIdHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(credentialId));
  
    const initData = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(uint256 pubKeyX, uint256 pubKeyY)",
        "bytes32"
      ],
      [
        [pubKeyX, pubKeyY],
        credentialIdHash
      ]);
  
    const validators: BootstrapConfig[] = makeBootstrapConfig(validatorAddress, initData);
    const executors: BootstrapConfig[] = makeBootstrapConfig(ADDRESS_ZERO, '0x');
    const hook: BootstrapConfig = _makeBootstrapConfig(ADDRESS_ZERO, '0x');
    const fallbacks: BootstrapConfig[] = makeBootstrapConfig(ADDRESS_ZERO, '0x');
  
    const initMSAData = encodeFunctionData({
      functionName: 'initMSA',
      abi: parseAbi(bootstrapAbi),
      args: [validators, executors, hook, fallbacks],
    });

    const passkeyOwnerAddress = await getPasskeyOwnerAddress(publicKey, credentialId);
  
    const initCode = encodeAbiParameters(
      parseAbiParameters('address, address, bytes'),
      [passkeyOwnerAddress, bootstrapAddress as Hex, initMSAData] // ← Use ownerAddress
    )

    /**
     * END init code data
     */

    const salt = pad(toHex(1), { size: 32 });
    
    const functionData = encodeFunctionData({
      functionName: 'createAccount',
      abi: parseAbi(factoryAbi),
      args: [
        salt,
        initCode,
      ],
    });

    console.log('functionData', functionData);

    let estimatedUserOperation = await bundlerClient.prepareUserOperation({ 
      account: etherspotSmartAccount,
      nonce: BigNumber.from(validatorAddress).toBigInt(),
      calls: [{
        to: '0x38CC0EDdD3a944CA17981e0A19470d2298B8d43a',
        value: parseEther('0'),
        data: functionData
      }]
    });

    console.log('estimated userOperation', estimatedUserOperation);

    // console.log('sending userOperation...');

    // const userOpHash = await bundlerClient.sendUserOperation({
    //   account: etherspotSmartAccount,
    //   calls: [{
    //     to: '0x38CC0EDdD3a944CA17981e0A19470d2298B8d43a',
    //     value: parseEther('0'),
    //     data: functionData
    //   }]
    // });

    console.log('userOpHash!!!', userOpHash);
  }

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
        <p>EOA address: {eoaAddress}</p>
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
                  onClick={handleLoginWithPasskey} 
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
                  $fullWidth 
                  disabled={isLoading}
                >
                  {isLoading ? 'Getting Public Key...' : 'Get Public Key'}
                </Button>
                <Button
                  onClick={handleSendNativeToken}
                  $fullWidth 
                  disabled={isLoading || !bundlerClient}
                >
                  {isLoading ? 'Sending...' : 'Send 0.001 ETH'}
                </Button>
                <Button
                  onClick={handleGetSenderAddress}
                  $last 
                  $fullWidth 
                  disabled={isLoading || !bundlerClient}
                >
                  Etherspot Smart Account actions
                </Button>
                <Button
                  onClick={handleDeployAccount}
                  $last 
                  $fullWidth 
                  disabled={isLoading || !bundlerClient}
                >
                  Etherspot Deploy Account
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