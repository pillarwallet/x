import React, { useCallback, useMemo } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';

import DefaultItem from '../item';
import { Container, DefaultGroup, DefaultNotFound } from './styles';

import type { NormalDropdownProps } from './types';

import { useTranslation } from 'react-i18next';
import { CurrencyData } from '../../../../../lib/backend/api';

const NormalDropdown: React.FC<NormalDropdownProps> = ({
    type,
    availableCurrency,
    fiat = false,
    selectedCurrency,
    onClick,
    searchContext,
    loading,
    components,
    groupHeight = 44,
    itemHeight = 72,
    maxHeight = 354,
    embed,
}) => {
    const { t } = useTranslation();
    const { NotFound, Item, Group } = components || {};

    const renderList = useCallback(
        ({
            items,
            groups,
            loading,
        }:
            | { items: CurrencyData[][]; groups: string[]; loading?: false }
            | { items: number[]; groups: string[]; loading: true }) => {
            const nCurrency = loading
                ? items.reduce((prev, cur) => prev + cur, 0)
                : items.reduce((prev, cur) => prev + cur.length, 0);
            const nGroups = groups.length;

            let computedHeight = nGroups * groupHeight + nCurrency * itemHeight;
            if (computedHeight > maxHeight) computedHeight = maxHeight;

            return (
                <GroupedVirtuoso
                    tabIndex={-1}
                    style={{ height: computedHeight }}
                    groupCounts={loading ? items : items.map((item) => item.length)}
                    groupContent={(index) =>
                        Group ? (
                            <Group>{groups[index]}</Group>
                        ) : (
                            <DefaultGroup data-testid="dropdown-group">
                                {groups[index]}
                            </DefaultGroup>
                        )
                    }
                    itemContent={(index, groupIndex) => {
                        if (loading) {
                            return Item ? (
                                <Item loading />
                            ) : (
                                <DefaultItem
                                    dropdownType="normal"
                                    even={index % 2 == 0}
                                    loading
                                />
                            );
                        }

                        const currentIndex =
                            index -
                            items.reduce((previous, current, itemIndex) => {
                                if (itemIndex >= groupIndex) {
                                    return previous;
                                }

                                return previous + current.length;
                            }, 0);
                        const currency = items[groupIndex][currentIndex];
                        const selected =
                            selectedCurrency == null
                                ? false
                                : currency.symbol == selectedCurrency.symbol;

                        return Item ? (
                            <Item
                                currency={currency}
                                selected={selected}
                                onClick={() => onClick && onClick(currency)}
                            />
                        ) : (
                            <DefaultItem
                                dropdownType="normal"
                                currency={currency}
                                selected={selected}
                                onClick={() => onClick && onClick(currency)}
                            />
                        );
                    }}
                />
            );
        },

        [
            selectedCurrency,
            onClick,
            Group,
            Item,
            groupHeight,
            itemHeight,
            maxHeight,
        ],
    );

    const filterGroup = useCallback(
        (group: CurrencyData[]) =>
            group.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchContext) ||
                    item.symbol.toLowerCase().includes(searchContext),
            ),
        [searchContext],
    );

    const filtered = useMemo(() => {
        if (!availableCurrency) {
            return null;
        }

        if (fiat && type == 'send') {
            return {
                fiat: true as const,
                items:
                    searchContext == ''
                        ? availableCurrency
                        : {
                            fiat: filterGroup(availableCurrency.fiat),
                        },
            };
        } else {
            return {
                fiat: false as const,
                items:
                    searchContext == ''
                        ? availableCurrency
                        : {
                            popular: filterGroup(availableCurrency.popular),
                            other: filterGroup(availableCurrency.other),
                            all: availableCurrency.all
                                ? filterGroup(availableCurrency.all)
                                : undefined,
                        },
            };
        }
    }, [availableCurrency, searchContext, fiat, type, filterGroup]);

    const mapFilteredToList = useCallback(() => {
        if (!filtered) {
            return null;
        }

        if (filtered.fiat) {
            if (filtered.items.fiat.length == 0) {
                return null;
            }

            return renderList({
                items: [filtered.items.fiat],
                groups: [t('fiatCurrencies')],
            });
        }

        if (filtered.items.all && filtered.items.all.length > 0) {
            return renderList({
                items: [filtered.items.all],
                groups: [t('allCurrencies')],
            });
        }

        const nPopular = filtered.items.popular.length;
        const nOther = filtered.items.other.length;

        if (nPopular > 0 && nOther > 0) {
            return renderList({
                items: [filtered.items.popular, filtered.items.other],
                groups: [t('popularCurrencies'), t('otherCurrencies')],
            });
        }

        if (nPopular > 0 && nOther == 0) {
            return renderList({
                items: [filtered.items.popular],
                groups: [t('popularCurrencies')],
            });
        }

        if (nPopular == 0 && nOther > 0) {
            return renderList({
                items: [filtered.items.other],
                groups: [t('otherCurrencies')],
            });
        }

        return null;
    }, [filtered, renderList, t]);

    const list = mapFilteredToList();

    return (
        <Container role="listbox" embed={embed} maxHeight={maxHeight}>
            {loading
                ? fiat && type == 'send'
                    ? renderList({
                        items: [5],
                        groups: [t('fiatCurrencies')],
                        loading: true,
                    })
                    : renderList({
                        items: [5, 5],
                        groups: [t('popularCurrencies'), t('otherCurrencies')],
                        loading: true,
                    })
                : list ??
                (NotFound ? (
                    <NotFound></NotFound>
                ) : (
                    <DefaultNotFound>No matching asset found</DefaultNotFound>
                ))}
        </Container>
    );
};

export default NormalDropdown;
