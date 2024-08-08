import React, { useMemo, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import Item from '../item';
import {
    CloseButton,
    Container,
    Heading,
    HeadingRow,
    ListBlock,
    SearchBlock,
    SearchButton,
    SearchInput,
    StyledCloseIcon,
    StyledSearchIcon,
} from './styles';
import { CurrencyData } from '../../../../../lib/backend/api';



export type FloatingDropdownProps = {
    availableCurrency: CurrencyData[];
    selectedCurrency: CurrencyData;
    type: 'get' | 'send';
    onSelect?: (currency: CurrencyData) => void;
    onClose?: () => void;
};

const FloatingDropdown: React.FC<FloatingDropdownProps> = ({
    availableCurrency,
    selectedCurrency,
    type,
    onSelect,
    onClose,
}) => {
    // eslint-disable-next-line no-console
    const [searchContext, setSearchContext] = useState('');
    const filteredCurrency = useMemo(() => {
        const lowerCasedContext = searchContext.toLowerCase();

        return availableCurrency.filter(
            (item) =>
                item.name.toLowerCase().includes(lowerCasedContext) ||
                item.symbol.toLowerCase().includes(lowerCasedContext),
        );
    }, [searchContext, availableCurrency]);

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Container>
            <HeadingRow>
                <Heading>{type == 'get' ? 'To' : 'From'}</Heading>
                <CloseButton onClick={onClose}>
                    <StyledCloseIcon
                        fill="#1e1e1e"
                        stroke="#1e1e1e"
                        width={15}
                        height={15}
                    />
                </CloseButton>
            </HeadingRow>
            <SearchBlock>
                <SearchInput
                    ref={inputRef}
                    placeholder="Type a currency or ticker"
                    value={searchContext}
                    onChange={(event) => setSearchContext(event.target.value)}
                />
                <SearchButton
                    onClick={() => {
                        if (searchContext == '') {
                            inputRef.current?.focus();
                        } else {
                            setSearchContext('');
                        }
                    }}
                >
                    {searchContext == '' ? (
                        <StyledSearchIcon width={18} height={18} />
                    ) : (
                        <StyledCloseIcon width={18} height={18} />
                    )}
                </SearchButton>
            </SearchBlock>
            <ListBlock>
                <Virtuoso
                    tabIndex={-1}
                    style={{ height: '100%' }}
                    data={filteredCurrency}
                    itemContent={(_, currency) => (
                        <Item
                            dropdownType="floating"
                            currency={currency}
                            selected={currency.symbol == selectedCurrency.symbol}
                            onClick={() => onSelect && onSelect(currency)}
                        />
                    )}
                />
            </ListBlock>
        </Container>
    );
};

export default FloatingDropdown;
