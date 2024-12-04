/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Virtuoso } from 'react-virtuoso'

import CoinListItem from '../CoinListItemNew';

import {
  Body,
  BodySectionRow,
  BodySectionTitle,
  CloseIcon,
  Container,
  Heading,
  HeadingRow,
  Error,
  SearchIcon,
  SearchIconRow,
  TextInput,
  SkeletonRow,
  SkeletonName,
  SkeletonRowSpacer,
  SkeletonContent,
  SkeletonIcon,
  SkeletonNetwork,
  Skeleton,
} from './styles';
import { getCurrencyInternalName } from '../../helpers/formatCurrency';

interface Props {
  setCurrency: (value: string) => void;
  currency: Record<string, string>;
  list: { type: string; value?: Record<string, string> }[];
  onClose: () => void;
  isShowFavorite: boolean;
  search: string;
  onChange: (query: string) => void;

  isLoading?: boolean;
  type: string;
}

export default function CoinsDropdown({
  onClose,
  list,
  currency,
  setCurrency,
  search,
  onChange,
  isLoading,
  type,
}: Props) {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);


  const height = (): number => {
    if (isLoading) {
      return 285;
    }
    return (
      list.length * (matchMedia('screen and (min-width: 350px)').matches ? 40 : 32)
    );
  };

  const getRows = () => {
    if (isLoading) {
      return [
        ...Array.from(Array(5), () => ({
          name: 'SKELETON',
        })),
      ];
    }

    return [
      ...list.map((currency) => ({ name: 'CURRENCY', data: currency })),
    ];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = getRows() as any;

  return (
    <Container className="main-page__dropdown-list">
      <Heading>
        <SearchIconRow>
          <SearchIcon />
        </SearchIconRow>

        <HeadingRow>
          <TextInput
            className="currency-list__search-field"
            ref={inputRef}
            placeholder={t('OTHER.TEXT_1')}
            value={search}
            onChange={({ target: { value } }) => onChange(value)}
          />

          <CloseIcon onClick={onClose} role="button" />
        </HeadingRow>
      </Heading>

      <Body type={type}>
        <Virtuoso totalCount={rows.length}
                  style={{ height: height() }}
                  itemContent={(index) => {
                const row = rows[index];
                if (row.name === 'TITLE') {
                  return (
                    <BodySectionRow>
                      <BodySectionTitle>{row.data}</BodySectionTitle>
                    </BodySectionRow>
                  );
                }
                if (row.name === 'SKELETON') {
                  return (
                    <SkeletonRow>
                      <Skeleton $rounded $width="24px">
                        <SkeletonIcon />
                      </Skeleton>

                      <SkeletonRowSpacer width="16" />

                      <SkeletonName>
                        <Skeleton>
                          <SkeletonContent />
                        </Skeleton>
                      </SkeletonName>

                      <SkeletonRowSpacer width="118" />

                      <Skeleton $width="100px">
                        <SkeletonNetwork />
                      </Skeleton>
                    </SkeletonRow>
                  );
                }

                const { ticker, name, network, cmcTicker, symbolFront, fullInfo } = row.data.value;

                return (
                  <div>
                    <CoinListItem
                      className="currency-list__item"
                      onSelect={() => setCurrency(getCurrencyInternalName(row.data.value))}
                      network={network}
                      ticker={ticker}
                      name={name}
                      key={ticker}
                      selected={currency === ticker}
                    />
                  </div>
                );
              }}
            />

        {search.length > 0 && list.length === 0 && (
          <Error>{t(search.length > 0 ? 'ERRORS.TEXT_6' : 'ERRORS.TEXT_8')}</Error>
        )}
      </Body>
    </Container>
  );
}
