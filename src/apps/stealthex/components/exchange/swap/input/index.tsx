import React, { useEffect, useRef, useState } from 'react';

import { LoaderSvg } from '../../../common/icons';
import useClickOutside from '../../../../lib/hooks/use-click-outside';
import useToggle from '../../../../lib/hooks/use-toggle';

import FloatingDropdown from '../dropdown/floating';
import NormalDropdown from '../dropdown/normal';
import TooltipLock from '../tooltip-lock';
import {
    AmountInput,
    Container,
    ContainerInput,
    CurrencyIcon,
    Details,
    DropdownContainer,
    DropdownInput,
    Error,
    IndicatorContainer,
    Label,
    Loader,
    Selected,
    Symbol,
} from './styles';

import type { InputProps } from './types';
import { useTranslation } from 'react-i18next';
import { CurrencyData } from '../../../../lib/backend/api';

const Input: React.FC<InputProps> = ({
    currency,
    value,
    loading,
    loadingCurrency,
    fiat = false,
    error,
    onChange,
    onCurrencySelect,
    availableCurrency,
    type,
    disabled,
    withLock,
    floatingDropdown,
    widget,
    fixed,
    onFixedChange,
  }) => {
    const { t } = useTranslation();
  
    const [dropdownActive, toggleDropdown] = useToggle(false);
    const [searchContext, setSearchContext] = useState('');
  
    const dropdownInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, toggleDropdown);
  
    const inputId = `exchange-${type == 'get' ? 'to' : 'from'}-input`;
  
    const handleDropdownClick = (currency: CurrencyData) => {
      toggleDropdown();
      onCurrencySelect && onCurrencySelect(currency);
    };
  
    useEffect(() => {
      if (!dropdownActive) {
        return;
      }
  
      dropdownInputRef.current?.focus();
    }, [dropdownActive]);
  
    return (
      <Container>
        <ContainerInput
          error={error ? 'true' : undefined}
          dropdownActive={dropdownActive ? 'true' : undefined}
          widget={widget ? 'true' : undefined}
        >
          {error && (
            <Error
              widget={widget ? 'true' : undefined}
              type={type}
              data-testid={`exchange-${
                type == 'get' ? 'to' : 'from'
              }-input-error`}
            >
              {error}
            </Error>
          )}
          {dropdownActive && !floatingDropdown && (
            <DropdownContainer ref={dropdownRef}>
              <DropdownInput
                placeholder={t('dropdownPlaceholder')}
                ref={dropdownInputRef}
                value={searchContext}
                onChange={(event) => setSearchContext(event.target.value)}
                id="exchange-dropdown-input"
                data-testid="exchange-dropdown-input"
              />
              <NormalDropdown
                fiat={fiat}
                selectedCurrency={currency}
                onClick={handleDropdownClick}
                searchContext={searchContext.toLowerCase()}
                loading={loadingCurrency}
                {...(type == 'get'
                  ? { type, availableCurrency }
                  : { type, availableCurrency })}
              />
            </DropdownContainer>
          )}
          {dropdownActive && floatingDropdown && (
            <FloatingDropdown
              type={type}
              selectedCurrency={currency}
              availableCurrency={availableCurrency}
              onSelect={handleDropdownClick}
              onClose={toggleDropdown}
            />
          )}
          {(!dropdownActive || floatingDropdown) && (
            <>
              <Details addlockspace={type == 'get' ? 'true' : undefined}>
                <Label htmlFor={inputId}>
                  {type == 'get' ? t('get') : t('send')} {currency?.name}
                </Label>
                <AmountInput
                  value={value}
                  disabled={disabled || !onChange}
                  onChange={onChange}
                  inputMode="decimal"
                  autoComplete="off"
                  id={inputId}
                  data-testid={inputId}
                />
              </Details>
              {loading && (
                <IndicatorContainer>
                  <Loader>
                    <LoaderSvg />
                  </Loader>
                </IndicatorContainer>
              )}
              {!fiat && !loading && withLock && (
                <IndicatorContainer visuallyhideonmobile='true' widget={widget ? 'true' : undefined}>
                  <TooltipLock
                    widget={widget}
                    fixed={fixed}
                    onChange={onFixedChange}
                  />
                </IndicatorContainer>
              )}
              {currency && (
                <Selected
                  onClick={toggleDropdown}
                  data-testid={`exchange-${
                    type == 'get' ? 'to' : 'from'
                  }-input-dropdown`}
                  aria-label="Open dropdown"
                >
                  <CurrencyIcon
                    src={currency.image}
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Symbol>{currency.symbol.toUpperCase()}</Symbol>
                </Selected>
              )}
            </>
          )}
        </ContainerInput>
      </Container>
    );
  };
  
  export default Input;
  