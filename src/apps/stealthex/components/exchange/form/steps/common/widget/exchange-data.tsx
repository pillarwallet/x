import React from 'react';
import styled from 'styled-components';



import DataBlock from './data-block';


import { ArrowForward } from '../../../../../common/icons';
import { useEstimateQuery } from '../../../../../../lib/backend/api';
import { useAppSelector } from '../../../../../../redux/hooks';
import { device } from '../../../../../../lib/styles/breakpoints';
import { fixedRevalidationMs, floatRevalidationMs } from '../../../../../../lib/consts';
import { ExchangeInfo } from '../../../../../../type';

type ContaiterProps = {
    iscolumnonmobiles?: 'true';
};

const Container = styled.div<ContaiterProps>`
  display: flex;
  flex: 0 0 auto;
  gap: ${(props) => (props.iscolumnonmobiles ? '0' : '8px')};
  flex-direction: ${(props) => (props.iscolumnonmobiles ? 'column' : 'row')};
  justify-content: space-between;

  @media ${device.mobileXL} {
    flex-direction: column;
    justify-content: flex-start;
    flex-basis: 190px;
    gap: 10px;
  }

  @media ${device.tablet} {
    flex-basis: 250px;
    flex-direction: row;
  }
`;

type StyledArrowIconProps = {
    alignToEmphasized?: boolean;
    rotateOnMobiles: boolean;
};

const StyledArrowIcon = styled(ArrowForward).attrs({
    fill: '#b0b0b0',
    width: 10,
    height: 10,
}) <StyledArrowIconProps>`
  flex-shrink: 0;
  align-self: flex-end;
  margin-bottom: ${(props) => (props.alignToEmphasized ? '6px' : '10px')};
  transform: ${(props) =>
        props.rotateOnMobiles ? 'rotate(90deg)' : 'rotate(0deg)'};

  @media ${device.mobileXL} {
    transform: rotate(90deg);
    align-self: flex-start;
    margin-left: 5px;
    margin-bottom: 0;
  }

  @media ${device.tablet} {
    transform: none;
    align-self: flex-end;
    margin-left: 0;
    margin-bottom: 10px;
  }
`;

const ExchangeData: React.FC<{
    emphasize?: 'send' | 'get';
    className?: string;
    exchnageInfo?: ExchangeInfo;
}> = ({ emphasize, className, exchnageInfo }) => {
    const { sendCurrency: selectedSendCurrency, receiveCurrency: selectedReceiveCurrency, amount, fixed, reverse } = useAppSelector(state => state.exchange)

    const estimate = useEstimateQuery(
        {
            amount: reverse ? undefined : Number(amount),
            amount_to: reverse ? Number(amount) : undefined,
            from: selectedSendCurrency.symbol,
            to: selectedReceiveCurrency.symbol,
            fixed,
        },
        {
            skip: !(exchnageInfo == undefined),
            pollingInterval: fixed ? fixedRevalidationMs : floatRevalidationMs,
        },
    );

    const matchedAmount = exchnageInfo
        ? exchnageInfo.amount_from
        : reverse
            ? estimate.data?.estimate
            : amount;
    const symbolFrom = exchnageInfo
        ? exchnageInfo.currency_from.toUpperCase()
        : selectedSendCurrency.symbol.toUpperCase();

    const matchedEstimate = exchnageInfo
        ? exchnageInfo.amount_to
        : reverse
            ? amount
            : estimate.data?.estimate ?? '...';
    const symbolTo = exchnageInfo
        ? exchnageInfo.currency_to.toUpperCase()
        : selectedReceiveCurrency.symbol.toUpperCase();

    const amountExceeds = matchedAmount ? matchedAmount.length >= 13 : false;
    const visibleAmountFrom = amountExceeds
        ? `${matchedAmount?.slice(0, 13)}...`
        : matchedAmount;

    const estimateExceeds = matchedEstimate
        ? matchedEstimate.length >= 17
        : false;
    const visibleAmountTo = estimateExceeds
        ? `${matchedEstimate.slice(0, 16)}...`
        : matchedEstimate;

    return (
        <Container
            className={className}
            iscolumnonmobiles={(symbolFrom.length >= 4 || symbolTo.length >= 4) ? 'true' : undefined}
        >
            <DataBlock
                label="You Send:"
                data={`${visibleAmountFrom} ${symbolFrom}`}
                emphasize={emphasize == 'send'}
                withTitle={amountExceeds}
                alignEmphasized={emphasize != undefined}
            />
            <StyledArrowIcon
                alignToEmphasized={emphasize != undefined}
                rotateOnMobiles={symbolFrom.length >= 4 || symbolTo.length >= 4}
            />
            <DataBlock
                label="You Get:"
                data={`${fixed ? '' : '≈'}${visibleAmountTo} ${symbolTo}`}
                emphasize={emphasize == 'get'}
                withTitle={estimateExceeds}
                alignEmphasized={emphasize != undefined}
            />
        </Container>
    );
};

export default ExchangeData;
