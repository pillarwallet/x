import { Nft } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft';
import { NftCollection } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft-collection';
import { TokenTypes } from '@etherspot/data-utils/dist/cjs/sdk/data/constants';
import * as TransactionKit from '@etherspot/transaction-kit';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { polygon } from 'viem/chains';
import { vi } from 'vitest';

// types
import type { Mock } from 'vitest';

// providers
import AccountNftsProvider, {
  AccountNftsContext,
} from '../AccountNftsProvider';

// hooks
import useAccountNfts from '../../hooks/useAccountNfts';

// services
import * as dappLocalStorage from '../../services/dappLocalStorage';

const accountAddress = '0x7F30B1960D5556929B03a0339814fE903c55a347';

describe.skip('AccountNftsProvider', () => {
  const nftMock: Nft = {
    tokenId: 1,
    name: 'Monke',
    amount: 1,
    image: 'ipfs://some-image',
    ipfsGateway: 'http://some-fake.ipfs.gateway.dev/some-image',
  };

  const nftCollectionMock: NftCollection = {
    contractName: 'Monke',
    contractSymbol: 'MONKE',
    contractAddress: '0x2A9bb3fB4FBF8e536b9a6cBEbA33C4CD18369EaF',
    tokenType: TokenTypes.Erc721,
    nftVersion: '1',
    nftDescription: 'Some description',
    balance: 2,
    items: [nftMock, { ...nftMock, tokenId: 2 }],
  };

  const accountNftsMock = {
    [accountAddress]: [nftCollectionMock],
  };

  let wrapper: React.FC;
  let getAccountNftsMock: Mock;
  let returnMoreNfts: boolean = false;

  beforeEach(() => {
    returnMoreNfts = false;

    wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountNftsProvider>{children}</AccountNftsProvider>
    );

    getAccountNftsMock = vi
      .fn()
      .mockImplementation((walletAddress, chainId) => {
        if (chainId === polygon.id && walletAddress === accountAddress) {
          const collection = returnMoreNfts
            ? {
                ...nftCollectionMock,
                items: [...nftCollectionMock.items, { ...nftMock, tokenId: 3 }],
              }
            : nftCollectionMock;
          return [collection];
        }
        return [];
      });

    vi.spyOn(TransactionKit, 'useEtherspotNfts').mockReturnValue({
      getAccountNfts: getAccountNftsMock,
    });

    vi.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(
      accountAddress
    );
    vi.spyOn(dappLocalStorage, 'getJsonItem').mockReturnValue({});
  });

  it('initializes with empty nfts', () => {
    const { result } = renderHook(() => React.useContext(AccountNftsContext), {
      wrapper,
    });

    result.current?.data.setUpdateData(true);

    expect(result.current?.data.nfts).toEqual({});
  });

  it('updates nfts', async () => {
    const { result } = renderHook(() => React.useContext(AccountNftsContext), {
      wrapper,
    });

    result.current?.data.setUpdateData(true);

    await waitFor(async () => {
      expect(result.current?.data.nfts).toEqual({
        [polygon.id]: accountNftsMock,
      });
    });

    expect(getAccountNftsMock).toHaveBeenCalled();
  });

  it('does not update nfts when wallet address is not set', async () => {
    vi.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(undefined);

    const { result } = renderHook(() => React.useContext(AccountNftsContext), {
      wrapper,
    });

    result.current?.data.setUpdateData(true);

    expect(getAccountNftsMock).not.toHaveBeenCalled();
    expect(result.current?.data.nfts).toEqual({});
  });

  it('calls onNftReceived when account nft received', async () => {
    vi.useFakeTimers();

    const onNftReceived = vi.fn();
    const onNftSent = vi.fn();

    const { result } = renderHook(
      () =>
        useAccountNfts({
          onReceived: onNftReceived,
          onSent: onNftSent,
        }),
      {
        wrapper: ({ children }) => (
          <AccountNftsProvider>
            <AccountNftsContext.Consumer>
              {(value) => {
                if (!value) return children;
                value.data.setUpdateData(true);
                return children;
              }}
            </AccountNftsContext.Consumer>
          </AccountNftsProvider>
        ),
      }
    );

    await waitFor(async () => {
      expect(result.current).not.toEqual({});
    });

    expect(result.current?.[polygon.id][accountAddress][0].items.length).toBe(
      2
    );

    returnMoreNfts = true;

    vi.runAllTimers();
    vi.useRealTimers();

    await waitFor(async () => {
      expect(
        result.current?.[polygon.id][accountAddress][0]?.items?.length
      ).toBe(3);
    });

    expect(onNftReceived).toHaveBeenCalledTimes(1);
    expect(onNftSent).toHaveBeenCalledTimes(0);
  }, 10000);

  it('calls onNftSent when account nft sent', async () => {
    vi.useFakeTimers();
    returnMoreNfts = true;

    const onNftReceived = vi.fn();
    const onNftSent = vi.fn();

    const { result } = renderHook(
      () =>
        useAccountNfts({
          onReceived: onNftReceived,
          onSent: onNftSent,
        }),
      {
        wrapper: ({ children }) => (
          <AccountNftsProvider>
            <AccountNftsContext.Consumer>
              {(value) => {
                if (!value) return children;
                value.data.setUpdateData(true);
                return children;
              }}
            </AccountNftsContext.Consumer>
          </AccountNftsProvider>
        ),
      }
    );

    await waitFor(async () => {
      expect(result.current).not.toEqual({});
    });

    expect(result.current[polygon.id][accountAddress][0].items.length).toBe(3);

    returnMoreNfts = false;
    vi.runAllTimers();
    vi.useRealTimers();

    await waitFor(async () => {
      expect(result.current[polygon.id][accountAddress][0]?.items?.length).toBe(
        2
      );
    });

    expect(onNftSent).toHaveBeenCalledTimes(1);
    expect(onNftReceived).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });
});
