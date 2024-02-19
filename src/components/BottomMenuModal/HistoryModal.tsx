import { useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary, Card,
  CssVarsProvider, Link,
  ListItemContent,
  Typography
} from '@mui/joy';
import moment from 'moment';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { FaExternalLinkAlt } from 'react-icons/fa';

// hooks
import useAccountTransactionHistory from '../../hooks/useAccountTransactionHistory';

// utils
import { getNativeAssetForChainId, supportedChains } from '../../utils/blockchain';
import { formatAmountDisplay } from '../../utils/number';

interface HistoryModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const HistoryModal = ({ isContentVisible }: HistoryModalProps) => {
  const accountAddress = useWalletAddress();
  const history = useAccountTransactionHistory();
  const { addressesEqual } = useEtherspotUtils();

  if (!isContentVisible) {
    return <div />
  }

  // eslint-disable-next-line no-console
  console.log('accountAddress', accountAddress);
  // eslint-disable-next-line no-console
  console.log('history', history);

  const visibleChains = process.env.REACT_APP_USE_TESTNETS === 'true'
    ? supportedChains.filter((chain) => chain.testnet)
    : supportedChains;

  return (
    <Wrapper>
      <CssVarsProvider defaultMode="dark">
        <AccordionGroup>
          {visibleChains.map((chain) => (
            <Accordion key={chain.id}>
              <AccordionSummary>
                <ListItemContent>
                  <Typography level="title-lg">{chain.name}</Typography>
                </ListItemContent>
              </AccordionSummary>
              <AccordionDetails>
                {!accountAddress || !history[chain.id]?.[accountAddress]?.length && (
                  <Typography level="title-sm">No transactions found</Typography>
                )}
                {!!accountAddress
                  && !!history[chain.id]?.[accountAddress]?.length
                  && history[chain.id]?.[accountAddress as string]?.map((transaction) => (
                  <Card key={transaction.hash} sx={{ width: '100%', mb: 0.5 }}>
                    <Typography level="title-sm">
                      {addressesEqual(accountAddress, transaction.to) ? 'Received' : 'Sent'}
                      {` ${formatAmountDisplay(
                        transaction.asset
                          ? ethers.utils.formatUnits(transaction.asset.value, transaction.asset.decimals)
                          : ethers.utils.formatEther(transaction.value)
                      )}`}
                      {` ${transaction.asset
                        ? transaction.asset.symbol
                        : getNativeAssetForChainId(chain.id).symbol
                      }`}
                    </Typography>
                    <Typography level="body-xs">
                      {moment(transaction.blockTimestamp).fromNow()}
                      <Link
                        href={`${chain.blockExplorers.default.url}/tx/${transaction.hash}`}
                        ml={1}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaExternalLinkAlt/>
                      </Link>
                    </Typography>
                  </Card>
                  ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionGroup>
      </CssVarsProvider>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: block;
  min-height: 100%;
  width: 100%;
`;

export default HistoryModal;
