import {
  concat,
  concatHex,
  domainSeparator,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  getTypesForEIP712Domain,
  hashMessage,
  hashTypedData,
  keccak256,
  parseAbi,
  parseAbiParameters,
  PublicClient,
  stringToHex,
  toHex,
  validateTypedData,
} from 'viem';
import {
  entryPoint07Abi,
  entryPoint07Address,
  EntryPointVersion,
  getUserOperationHash,
  toSmartAccount,
  WebAuthnAccount,
} from 'viem/account-abstraction';

import type {
  Address,
  Client,
  Hex,
  SignableMessage,
  TypedDataDefinition,
  TypedDataDomain,
} from 'viem';
import { getChainId, readContract } from 'viem/actions';
import { getAction } from 'viem/utils';
import { decode7579Calls, encode7579Calls } from 'permissionless/utils';

export type GetAccountNonceParams = {
  address: Address;
  entryPointAddress: Address;
  key?: bigint;
};

export interface BootstrapConfig {
  module: string;
  data: string;
}

const version = '1.0.0';
const validatorAddress = '0xbA45a2BFb8De3D24cA9D7F1B551E14dFF5d690Fd'; // ZeroDev
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
const bootstrapAddress = '0xCF2808eA7d131d96E5C73Eb0eCD8Dc84D33905C7';
let passkeyAddress: `0x${string}` | null = null;

export const modulesAbi = [
  'function onInstall(bytes data)'
];

export const factoryAbi = [
  'function createAccount(bytes32 salt,bytes calldata initCode) returns (address)',
  'function getAddress(bytes32 salt,bytes calldata initcode) view returns (address)'
]

export const bootstrapAbi = [
  'function singleInitMSA(address validator, bytes calldata data)',
  'function initMSA(BootstrapConfig[] calldata $valdiators,BootstrapConfig[] calldata $executors,BootstrapConfig calldata _hook,BootstrapConfig[] calldata _fallbacks)',
  'struct BootstrapConfig {address module;bytes data;}',
]

function getInitCodeData({
  keccakHash,
}: {
  keccakHash: `0x${string}`;
}): string {
  if (!validatorAddress) {
    throw new Error('Validator address not found');
  }
  const validators: BootstrapConfig[] = makeBootstrapConfig(validatorAddress, '0x');
  const executors: BootstrapConfig[] = makeBootstrapConfig(ADDRESS_ZERO, '0x');
  const hook: BootstrapConfig = _makeBootstrapConfig(ADDRESS_ZERO, '0x');
  const fallbacks: BootstrapConfig[] = makeBootstrapConfig(ADDRESS_ZERO, '0x');

  const initMSAData = encodeFunctionData({
    functionName: 'initMSA',
    abi: parseAbi(bootstrapAbi),
    args: [validators, executors, hook, fallbacks],
  });

  const initCode = encodeAbiParameters(
    parseAbiParameters('address, address, bytes'),
    [keccakHash, bootstrapAddress as Hex, initMSAData]
  )

  return initCode;
}

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

export function makeBootstrapConfig(module: string, data: string): BootstrapConfig[] {
  const config: BootstrapConfig[] = [];
  const encodedFunctionData = encodeFunctionData({
      functionName: 'onInstall',
      abi: parseAbi(modulesAbi),
      args: [data],
    });
  const newConfig: BootstrapConfig = {
      module: module,
      data: encodedFunctionData
  };
  config.push(newConfig);
  return config;
}

const wrapMessageHash = (
  messageHash: Hex,
  {
    accountAddress,
    version: mVersion,
    chainId,
  }: {
    accountAddress: Address;
    version: '1.0.0';
    chainId: number;
  }
) => {
  const domainSeparatorResult = domainSeparator({
    domain: {
      name: 'Nexus',
      version: mVersion,
      chainId,
      verifyingContract: accountAddress,
    },
  });
  const parentStructHash = keccak256(
    encodeAbiParameters(
      [{ type: 'bytes32' }, { type: 'bytes32' }],
      [keccak256(stringToHex('PersonalSign(bytes prefixed)')), messageHash]
    )
  );
  return keccak256(
    concatHex(['0x1901', domainSeparatorResult, parentStructHash])
  );
};

/**
 * Returns the nonce of the account with the entry point.
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/public-actions/getAccountNonce
 *
 * @param client {@link client} that you created using viem's createPublicClient.
 * @param args {@link GetAccountNonceParams} address, entryPoint & key
 * @returns bigint nonce
 *
 * @example
 * import { createPublicClient } from "viem"
 * import { getAccountNonce } from "permissionless/actions"
 *
 * const client = createPublicClient({
 *      chain: goerli,
 *      transport: http("https://goerli.infura.io/v3/your-infura-key")
 * })
 *
 * const nonce = await getAccountNonce(client, {
 *      address,
 *      entryPoint,
 *      key
 * })
 *
 * // Return 0n
 */
export const getAccountNonce = async (
  client: Client,
  args: GetAccountNonceParams
): Promise<bigint> => {
  console.log('getAccountNonce', args);
  const { address, entryPointAddress, key = BigInt(0) } = args;

  return getAction(
    client,
    readContract,
    'readContract'
  )({
    address: entryPointAddress,
    abi: [
      {
        inputs: [
          {
            name: 'sender',
            type: 'address',
          },
          {
            name: 'key',
            type: 'uint192',
          },
        ],
        name: 'getNonce',
        outputs: [
          {
            name: 'nonce',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'getNonce',
    args: [address, key],
  });
};

export const toEtherspotSmartAccount = async (props: {
  client: PublicClient;
  webAuthnAccount: WebAuthnAccount;
  passkeyPublicKey: string;
  passkeyCredentialId: string;
  entryPoint: {
    address: `0x${string}`;
    version: EntryPointVersion;
  };
}) => {
  const FACTORY_ADDRESS = '0x38CC0EDdD3a944CA17981e0A19470d2298B8d43a' as const;
  const {
    client,
    webAuthnAccount,
    passkeyPublicKey,
    passkeyCredentialId,
    entryPoint,
  } = props;

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

  const { x, y } = getXYCoordinates(passkeyPublicKey);

  const entryPointObject = {
    address: entryPoint?.address ?? entryPoint07Address,
    abi: entryPoint07Abi,
    version: entryPoint?.version ?? ('0.7' as EntryPointVersion),
  };

  /**
   * @description This function returns the arguments
   * for the getAddress function of the
   * ModularEtherspotWalletFactory contract
   *
   * @returns The arguments for the getAddress function
   */
  const getFactoryArgs = async () => {
    console.log('getFactoryArgs', keccak256(toHex(`${x}${y}${passkeyCredentialId}`)));
    const keccakHash = keccak256(toHex(`${x}${y}${passkeyCredentialId}`));

    const initCodeData = getInitCodeData({
      keccakHash,
    });

    return {
      factory: FACTORY_ADDRESS,
      factoryData: encodeFunctionData({
        abi: [
          {
            inputs: [
              {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
              },
              {
                internalType: 'bytes',
                name: 'initcode',
                type: 'bytes',
              },
            ],
            name: 'getAddress',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'getAddress',
        args: [keccak256(toHex(`${x}${y}${passkeyCredentialId}`)), initCodeData as Hex],
      }),
    };
  };

  const getAddress = async () => {
    console.log('getAddress', keccak256(toHex(`${x}${y}${passkeyCredentialId}`)));
    const keccakHash = keccak256(toHex(`${x}${y}${passkeyCredentialId}`));

    /**
     * Get address
     */
    const senderAddress = await client
      .readContract({
        address: '0x38CC0EDdD3a944CA17981e0A19470d2298B8d43a', // ModularEtherspotWalletFactory
        abi: [
          {
            inputs: [
              {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
              },
              {
                internalType: 'bytes',
                name: 'initcode',
                type: 'bytes',
              },
            ],
            name: 'getAddress',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'getAddress',
        args: [keccak256(toHex(`${x}${y}${passkeyCredentialId}`)), '0x'],
      })
      .catch((error) => {
        console.error('Error calling contract:', error);
        return null;
      });

    passkeyAddress = senderAddress as `0x${string}`;
    const initcode = getInitCodeData({
      keccakHash
    });

    return senderAddress as `0x${string}`;
  };

  const getNonce = async (args?: { key?: bigint }) => {
    console.log('getNonce', args);
    const TIMESTAMP_ADJUSTMENT = BigInt(16777215); // max value for size 3
    const defaultedKey = (args?.key ?? BigInt(0)) % TIMESTAMP_ADJUSTMENT;
    const defaultedValidationMode = '0x00';
    const key = concat([
      toHex(defaultedKey, { size: 3 }),
      defaultedValidationMode,
    ]);

    const address = await getAddress();

    return getAccountNonce(client, {
      address,
      entryPointAddress: entryPoint.address,
      key: BigInt(key),
    });
  };

  const getStubSignature = async (): Promise<`0x${string}`> => {
    console.log('getStubSignature');

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
              "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d00000000",
              '{"type":"webauthn.get","challenge":"tbxXNFS9X_4Byr1cMwqKrIGB-_30a0QhZ6y7ucM0BOE","origin":"http://localhost:3000","crossOrigin":false, "other_keys_can_be_added_here":"do not compare clientDataJSON against a template. See https://goo.gl/yabPex"}',
              BigInt(1),
              BigInt("44941127272049826721201904734628716258498742255959991581049806490182030242267"),
              BigInt("9910254599581058084911561569808925251374718953855182016200087235935345969636"),
              false
          ]
      )
  

    // return '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c' as `0x${string}`;
  };

  const decodeCalls = async (callData: `0x${string}`) => {
    console.log('decodeCalls', callData);
    return decode7579Calls(callData).callData;
  };

  const encodeCalls = async (
    calls: readonly {
      to: `0x${string}`;
      value?: bigint | undefined;
      data?: `0x${string}` | undefined;
    }[]
  ) => {
    console.log('encodeCalls', calls);
    return encode7579Calls({
      mode: {
        type: calls.length > 1 ? 'batchcall' : 'call',
        revertOnError: false,
        selector: '0x',
        context: '0x',
      },
      callData: calls,
    });
  };

  const sign = async (parameters: {
    hash: `0x${string}`;
  }): Promise<`0x${string}`> => {
    console.log('sign', parameters);
    const result = await webAuthnAccount.sign(parameters);
    return result.signature;
  };

  let chainId: number;
  const getMemoizedChainId = async () => {
    console.log('getMemoizedChainId');
    if (chainId) return chainId;
    chainId = client.chain
      ? client.chain.id
      : await getAction(client, getChainId, 'getChainId')({});
    return chainId;
  };

  const signMessage = async ({ message }: { message: SignableMessage }) => {
    console.log('signMessage', message);
    let messageHash: Hex;
    if (typeof message === 'string') {
      messageHash = hashMessage(message);
    } else if (typeof message.raw === 'string') {
      messageHash = message.raw as Hex;
    } else {
      messageHash = toHex(message.raw);
    }
    const wrappedMessageHash = wrapMessageHash(messageHash, {
      version,
      accountAddress: await getAddress(),
      chainId: await getMemoizedChainId(),
    });

    const signature = await webAuthnAccount.signMessage({
      message: {
        raw: wrappedMessageHash,
      },
    });

    return encodePacked(
      ['address', 'bytes'],
      [validatorAddress, signature.signature]
    );
  };

  const signTypedData = async <
    const TypedData extends Record<string, unknown>,
    PrimaryType extends keyof TypedData | 'EIP712Domain' = keyof TypedData,
  >(
    parameters: TypedDataDefinition<TypedData, PrimaryType>
  ) => {
    console.log('signTypedData', parameters);
    const { types: inputTypes, domain } = parameters;

    const types = {
      EIP712Domain: getTypesForEIP712Domain({
        domain: domain as TypedDataDomain,
      }),
      ...inputTypes,
    };

    const parametersWithTypes = {
      ...parameters,
      // Merge computed EIP712Domain with incoming types
      types,
    } as TypedDataDefinition<TypedData, PrimaryType>;

    validateTypedData(parametersWithTypes);

    const typedHash = hashTypedData(parametersWithTypes);

    const wrappedMessageHash = wrapMessageHash(typedHash, {
      version,
      accountAddress: await getAddress(),
      chainId: await getMemoizedChainId(),
    });

    const signature = await webAuthnAccount.signMessage({
      message: {
        raw: wrappedMessageHash,
      },
    });

    return encodePacked(
      ['address', 'bytes'],
      [validatorAddress, signature.signature]
    );
  };

  // @ts-expect-error - TODO: fix this
  const signUserOperation = async (parameters) => {
    console.log('signUserOperation', parameters);
    const { mChainId = await getMemoizedChainId(), ...userOperation } =
      parameters;

    if (!mChainId) throw new Error('Chain id not found');

    const hash = getUserOperationHash({
      userOperation: {
        ...userOperation,
        sender: userOperation.sender ?? (await getAddress()),
        signature: '0x',
      },
      entryPointAddress: entryPoint.address,
      entryPointVersion: entryPoint.version,
      chainId: mChainId,
    });
    const signature = await webAuthnAccount.signMessage({
      message: { raw: hash as Hex },
    });

    return signature.signature;
  };

  return toSmartAccount({
    client,
    entryPoint: entryPointObject,
    getFactoryArgs,
    getAddress,
    getNonce,
    getStubSignature,
    decodeCalls,
    encodeCalls,
    sign,
    signMessage,
    signTypedData,
    signUserOperation,
  });
};
