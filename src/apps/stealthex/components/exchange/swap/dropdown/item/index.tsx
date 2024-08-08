import React from 'react';

import getNetworkColor from '../../../../../lib/functions/get-network-color';

import {
    Container,
    Info,
    InfoTitle,
    Logo,
    Name,
    Network,
    Symbol,
} from './styles';

import SkeletonStyles from '../../../../../lib/styles/skeleton';
import SkeletonLoader from '../../../../../../../components/SkeletonLoader';
import { CurrencyData } from '../../../../../lib/backend/api';


export type ItemProps = {
    dropdownType?: 'floating' | 'normal';
} & (
        | {
            loading?: false;
            currency: CurrencyData;
            selected?: boolean;
            onClick?: () => void;
        }
        | { loading: true; even: boolean }
    );

const Item: React.FC<ItemProps> = ({ dropdownType = 'normal', ...props }) => {
    if (props.loading) {
        return (
            <>
                <SkeletonStyles />
                <Container
                    dropdownType={dropdownType}
                    data-testid="dropdown-item"
                    data-loading="true"
                >
                    <SkeletonLoader  $height='33px' $width='33px' $radius='50%' />
                    <Info>
                        <Symbol>
                            <SkeletonLoader  $height='50px' $width={props.even ? '25%' : '30%'} $marginBottom='20px' $radius='10px' />
                        </Symbol>
                        <Name>
                            <SkeletonLoader  $height='50px' $width={props.even ? '35%' : '60%'} $marginBottom='20px' $radius='10px' />
                        </Name>
                    </Info>
                </Container>
            </>
        );
    }

    const { selected, onClick, currency } = props;

    return (
        <Container
            hoverable={!selected}
            onClick={!selected ? onClick : undefined}
            role="option"
            tabIndex={!selected ? 0 : -1}
            onKeyDown={(event) => {
                if (selected || event.key != 'Enter') {
                    return;
                }

                onClick && onClick();
            }}
            aria-selected={selected}
            dropdownType={dropdownType}
            data-testid="dropdown-item"
        >
            <Logo
                src={currency.image}
                alt={`${currency.symbol} logo`}
                width={33}
                height={33}
            />
            <Info>
                <InfoTitle>
                    <Symbol>{currency.symbol.toUpperCase()}</Symbol>
                    {currency.network && currency.network != '0' && (
                        <Network style={{ background: getNetworkColor(currency.network) }}>
                            {currency.network}
                        </Network>
                    )}
                </InfoTitle>
                <Name>{currency.name}</Name>
            </Info>
        </Container>
    );
};

export default Item;
