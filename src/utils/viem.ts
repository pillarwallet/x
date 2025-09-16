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

const version = '1.0.0';
const validatorAddress = '0xbA45a2BFb8De3D24cA9D7F1B551E14dFF5d690Fd';

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
        args: [keccak256(toHex(`${x}${y}${passkeyCredentialId}`)), '0x'],
      }),
    };
  };

  const getAddress = async () => {
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

    return senderAddress as `0x${string}`;
  };

  const getNonce = async (args?: { key?: bigint }) => {
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
    return '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c' as `0x${string}`;
  };

  const decodeCalls = async (callData: `0x${string}`) => {
    return decode7579Calls(callData).callData;
  };

  const encodeCalls = async (
    calls: readonly {
      to: `0x${string}`;
      value?: bigint | undefined;
      data?: `0x${string}` | undefined;
    }[]
  ) => {
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
    const result = await webAuthnAccount.sign(parameters);
    return result.signature;
  };

  let chainId: number;
  const getMemoizedChainId = async () => {
    if (chainId) return chainId;
    chainId = client.chain
      ? client.chain.id
      : await getAction(client, getChainId, 'getChainId')({});
    return chainId;
  };

  const signMessage = async ({ message }: { message: SignableMessage }) => {
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
