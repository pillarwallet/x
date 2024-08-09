import { CurrencyData } from './lib/backend/api';

export type Config = {
    amount: string;
    fixed: boolean;
    fiat: boolean;
    sendCurrency: CurrencyData;
    receiveCurrency: CurrencyData;
    getPairs?: CurrencyData[];
    sendPairs?: CurrencyData[];
    recepientAddress?: string;
    lockReceiveCurrency?: boolean;
}

export type ExchangeInfoCurrencyPair = {
    [key: string]: CurrencyData | undefined;
  };

export type ExchangeInfo = {
    id: string;
    type: string;
    timestamp: string;
    updated_at: string;
    currency_from: string;
    currency_to: string;
    amount_from: string;
    expected_amount: string;
    amount_to: string;
    amount_to_btc: string | null;
    address_from: string;
    address_to: string;
    extra_id_from: string | null;
    extra_id_to: string | null;
    tx_from: string | null;
    tx_to: string | null;
    status:
      | 'waiting'
      | 'confirming'
      | 'exchanging'
      | 'sending'
      | 'finished'
      | 'failed'
      | 'refunded'
      | 'expired'
      | 'verifying';
    refund_address: string | null;
    refund_extra_id: string | null;
    currencies: ExchangeInfoCurrencyPair;
    review?: boolean;
    payment_id?: string;
    mercuryo_signature: string;
};

export type StructuredCurrency = {
  fiat: CurrencyData[];
  popular: CurrencyData[];
  other: CurrencyData[];
};