import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { createGlobalStyle } from 'styled-components';
import { useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';
import { polygonMumbai, sepolia } from 'viem/chains';
import party from 'party-js';
import { Nft } from '@etherspot/prime-sdk/dist/sdk/data';
import { Card, Typography } from '@mui/joy';
import { ethers } from 'ethers';

// images
import mintedNftImage from './nft-image.png';

// components
import useBottomMenuModal from '../../hooks/useBottomMenuModal';
import TextInput from '../../components/Form/TextInput';
import Button from '../../components/Button';
import FormGroup from '../../components/Form/FormGroup';
import Label from '../../components/Form/Label';
import Select from '../../components/Form/Select';

// hooks
import useAccountNfts from '../../hooks/useAccountNfts';

const nftContractPerChain: { [chainID: number]: string } = {
  [sepolia.id]: '0x2A9bb3fB4FBF8e536b9a6cBEbA33C4CD18369EaF',
  [polygonMumbai.id]: '0x0c6F08807DCF8a4CeE22de114FBb220619949f0F',
};

const AppGlobalStyle = createGlobalStyle`
  body {
    background: #0091b6;
  }
`;

const App = () => {
  const [t] = useTranslation();
  const accountAddress = useWalletAddress();
  const [receiverAddress, setReceiverAddress] = React.useState<string>('');
  const { addressesEqual } = useEtherspotUtils();
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNft, setMinedNft] = useState<Nft | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  useAccountNfts({
    onReceived: (chainId, walletAddress, nft) => {
      setIsMinting(false);
      setMinedNft(nft);
      party.confetti(wrapperRef.current as HTMLElement, {
        count: 1000,
      });
    }
  });

  // maintain chain options within app
  const chainOptions = [sepolia, polygonMumbai].map((chain) => ({
    id: `${chain.id}`,
    title: chain.name,
    value: chain.id,
  }));

  const [chainId, setChainId] = React.useState<number>(+chainOptions[0]?.value);
  const { showTransactionConfirmation } = useBottomMenuModal();

  const chainTitle = chainOptions.find((chain) => chain.value === chainId)?.title;

  const send = () => {
    if (!receiverAddress || isMinting) return;

    setIsMinting(false);
    setMinedNft(null);

    const contractAddress = nftContractPerChain[chainId];
    const contractInterface = new ethers.utils.Interface(['function mint()']);
    const data = contractInterface.encodeFunctionData('mint');

    showTransactionConfirmation({
      title: 'Mint NFT',
      description: `This will mint ${accountAddress && addressesEqual(receiverAddress, accountAddress) ? 'you' : 'receiver'} single Monke NFT on on ${chainTitle}`,
      onSent: () => {
        setIsMinting(true);
      },
      transaction: {
        chainId,
        to: contractAddress,
        value: undefined,
        data: data,
      }
    });
  }

  useEffect(() => {
    if (!receiverAddress && accountAddress) {
      setReceiverAddress(accountAddress);
    }
  }, [receiverAddress, accountAddress]);

  return (
    <>
      <AppGlobalStyle />
      <Wrapper ref={wrapperRef}>
        <FormWrapper>
          {!mintedNft && !isMinting && (
            <>
              <FormGroup>
                <Label>{t`chain`}</Label>
                <Select
                  options={chainOptions}
                  onChange={(option) => setChainId(+option?.value)}
                  defaultSelectedId={chainOptions[0]?.id}
                />
              </FormGroup>
              <FormGroup>
                <Label>{t`receiverAddress`}</Label>
                <TextInput onValueChange={setReceiverAddress} value={receiverAddress ?? accountAddress ?? ''}/>
              </FormGroup>
            </>
          )}
          {!!mintedNft && (
            <Card sx={{ mb: 2, textAlign: 'center' }}>
              <img src={mintedNftImage} alt={mintedNft.name}/>
              <Typography>
                Successfully minted {mintedNft.name}
              </Typography>
            </Card>
          )}
          <Button disabled={!receiverAddress || isMinting} onClick={mintedNft ? () => setMinedNft(null) : send} $fullWidth>
            {isMinting && t`minting`}
            {!isMinting && (mintedNft ? t`mintAgain` : t`mint`)}
          </Button>
        </FormWrapper>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 0 25px;
  min-height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.div`
  width: 100%;
`;

export default App;
