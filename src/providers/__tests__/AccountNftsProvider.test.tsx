import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import * as TransactionKit from '@etherspot/transaction-kit';
import { avalanche, bsc, gnosis, mainnet, polygon } from 'viem/chains';
import { Nft, NftCollection, TokenTypes } from '@etherspot/prime-sdk';

// providers
import AccountNftsProvider, { AccountNftsContext } from '../../providers/AccountNftsProvider';

const accountAddress = '0x7F30B1960D5556929B03a0339814fE903c55a347';

describe('AccountNftsProvider', () => {
  const nftMock: Nft = {
    tokenId: 1,
    name: 'Monke',
    amount: 1,
    image: 'ipfs://some-image',
    ipfsGateway: 'http://some-fake.ipfs.gateway.dev/some-image'
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

  const accountNftsMock =  {
    [accountAddress]: [nftCollectionMock]
  };

  let wrapper: React.FC;
  let getAccountNftsMock: jest.Mock;
  let returnMoreNfts: boolean = false;

  beforeEach(() => {
    returnMoreNfts = false;

    wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountNftsProvider>
        {children}
      </AccountNftsProvider>
    );

    getAccountNftsMock = jest.fn().mockImplementation((walletAddress, chainId) => {
      if (chainId === mainnet.id && walletAddress === accountAddress) {
        const collection = returnMoreNfts
          ? { ...nftCollectionMock, items: [...nftCollectionMock.items, { ...nftMock, tokenId: 3 }] }
          : nftCollectionMock;
        return [collection];
      }
      return [];
    });

    jest.spyOn(TransactionKit, 'useEtherspotNfts').mockReturnValue(({
      getAccountNfts: getAccountNftsMock,
    }));

    jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(accountAddress);
  });

  it('initializes with empty nfts', () => {
    const { result } = renderHook(() => React.useContext(AccountNftsContext), { wrapper });
    expect(result.current?.data.nfts).toEqual({});
  });

  it('updates nfts', async () => {
    const { result } = renderHook(() => React.useContext(AccountNftsContext), { wrapper });

    await waitFor(async () => {
      expect(result.current?.data.nfts).toEqual({
        [mainnet.id]: accountNftsMock,
        [polygon.id]: { [accountAddress]: [] },
        [gnosis.id]: { [accountAddress]: [] },
        [avalanche.id]: { [accountAddress]: [] },
        [bsc.id]: { [accountAddress]: [] },
      });
    });

    expect(getAccountNftsMock).toHaveBeenCalled();
  });

  it('does not update nfts when wallet address is not set', async () => {
    jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(undefined);

    const { result } = renderHook(() => React.useContext(AccountNftsContext), { wrapper });

    expect(getAccountNftsMock).not.toHaveBeenCalled();
    expect(result.current?.data.nfts).toEqual({});
  });

  it('calls onNftReceived when account nft received', async () => {
    jest.useFakeTimers();

    const onNftReceived = jest.fn();
    const onNftSent = jest.fn();

    const { result } = renderHook(() => React.useContext(AccountNftsContext), {
      wrapper: ({ children }) => (
        <AccountNftsProvider>
          <AccountNftsContext.Consumer>
            {(value) => {
              if (!value) return children;
              value.listenerRef.current.onNftReceived = onNftReceived;
              value.listenerRef.current.onNftSent = onNftSent;
              return children
            }}
          </AccountNftsContext.Consumer>
        </AccountNftsProvider>
      ),
    });

    await waitFor(async () => {
      expect(result.current?.data.nfts).not.toEqual({});
    });

    expect(result.current?.data.nfts[mainnet.id][accountAddress][0].items.length).toBe(2);

    returnMoreNfts = true;

    jest.runAllTimers();

    await waitFor(async () => {
      expect(result.current?.data.nfts[mainnet.id][accountAddress][0]?.items?.length).toBe(3);
    });

    expect(onNftReceived).toHaveBeenCalledTimes(1);
    expect(onNftSent).toHaveBeenCalledTimes(0);
  });

  it('calls onNftSent when account nft sent', async () => {
    returnMoreNfts = true;

    jest.useFakeTimers();

    const onNftReceived = jest.fn();
    const onNftSent = jest.fn();

    const { result } = renderHook(() => React.useContext(AccountNftsContext), {
      wrapper: ({ children }) => (
        <AccountNftsProvider>
          <AccountNftsContext.Consumer>
            {(value) => {
              if (!value) return children;
              value.listenerRef.current.onNftReceived = onNftReceived;
              value.listenerRef.current.onNftSent = onNftSent;
              return children
            }}
          </AccountNftsContext.Consumer>
        </AccountNftsProvider>
      ),
    });

    await waitFor(async () => {
      expect(result.current?.data.nfts).not.toEqual({});
    });

    expect(result.current?.data.nfts[mainnet.id][accountAddress][0].items.length).toBe(3);

    returnMoreNfts = false;

    jest.runAllTimers();

    await waitFor(async () => {
      expect(result.current?.data.nfts[mainnet.id][accountAddress][0]?.items?.length).toBe(2);
    });

    expect(onNftSent).toHaveBeenCalledTimes(1);
    expect(onNftReceived).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
