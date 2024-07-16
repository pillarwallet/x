
import type React from 'react';
import { StructuredCurrency } from '../../../../../type';
import { CurrencyData } from '../../../../../lib/backend/api';

export type ClickCallback = (currency: CurrencyData) => void;

export type AvailableCurrency =
  | {
    availableCurrency?: Omit<StructuredCurrency, 'fiat'> & {
      all?: CurrencyData[];
    };
    type: 'get';
  }
  | {
    availableCurrency?: StructuredCurrency & {
      all?: CurrencyData[];
    };
    type: 'send';
  };

export type NormalDropdownProps = AvailableCurrency & {
  loading?: boolean;
  selectedCurrency: CurrencyData | null;
  searchContext: string;
  fiat?: boolean;
  onClick?: ClickCallback;
  components?: {
    NotFound?: React.FC<React.PropsWithChildren>;
    Group?: React.FC<React.PropsWithChildren>;
    Item?: React.FC<
      React.PropsWithChildren<
        | { loading: true }
        | {
          loading?: false;
          currency: CurrencyData;
          selected?: boolean;
          onClick?: () => void;
        }
      >
    >;
  };
  groupHeight?: number;
  itemHeight?: number;
  maxHeight?: number;
  embed?: boolean;
};
