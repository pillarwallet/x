
import { CurrencyData } from '../../../../lib/backend/api';
import type { AvailableCurrency } from '../dropdown/normal/types';

export type SavedAvailableCurrency =
  | {
      floatingDropdown: true;
      availableCurrency: CurrencyData[];
      type: 'get' | 'send';
    }
  | ({
      floatingDropdown?: false;
    } & AvailableCurrency);

export type InputProps = {
  currency: CurrencyData;
  value?: string;
  loading?: boolean;
  loadingCurrency?: boolean;
  error?: string | JSX.Element;
  fiat?: boolean;
  disabled?: boolean;
  withLock?: boolean | null;
  widget?: boolean;
  fixed?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFixedChange?: (fixed: boolean) => void;
  onCurrencySelect?: (currency: CurrencyData) => void;
  pressable?: boolean;
} & SavedAvailableCurrency;
