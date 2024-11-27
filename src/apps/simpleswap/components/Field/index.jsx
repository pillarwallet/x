/* eslint-disable react/jsx-no-bind */
import { useState, useRef, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useComponentVisible from '../../hooks/useComponentVisible';
import CoinsDropdown from '../NewCoinsDropdown/CoinsDropdownFiltered';
import FormToField from './components/FormToField';
import { MaxBoundary, MinBoundary } from './components/MinBoundary';
import Dropdown from './components/Dropdown';
import Spinner from '../Spinner';

// hooks
import {
  appendManyOptions,
  optionNotPriorityMiddleware,
  optionPriorityMiddleware,
  useCurrenciesList,
} from '../../hooks/useCurrenciesList';
import * as exchangeSelectors from '../../redux/exchange/selectors';

// styles
import { Row, InputGroup, InputLabel, Input } from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';
import {getCurrencyInternalName} from '../../helpers/formatCurrency';
import PropTypes from 'prop-types';

export default function Fields({ type }){
  const { t } = useTranslation();

  const {
    state: {
      isFixed,
      currencyFrom,
      currencyTo,
      currencyFromValue,
      currencyToValue,
      minAmount,
      maxAmount,
      isAmountLoading,
    },
    actions: { setCurrencyFrom, setCurrencyTo, setAmount },
  } = useContext(ExchangeContext);

  const inputRef = useRef(null);


  const allCurrencies = useSelector(exchangeSelectors.getAllCurrenciesList);
  const fixedPairs = useSelector(exchangeSelectors.getFixedPairs);
  const allPairs = useSelector(exchangeSelectors.getAllPairsList);
  const [search, setSearch] = useState('');
  const currency = type === 'from' ? currencyFrom : currencyTo;
  const currenciesList = useMemo(() => {
    const pairsList = isFixed ? fixedPairs : allPairs;
    let currenciesList;

    currenciesList = allCurrencies.data;
    if (!currenciesList || !pairsList) return null;
    if (isFixed && (!currenciesList?.length || !pairsList)) {
      return 'is_loading';
    }

    if (search) {
      currenciesList = currenciesList.filter((coinItem) => {
        const findByName = coinItem.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        const findByTicket =
          coinItem.ticker.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1;

        return findByName || findByTicket;
      });
    }
    if (type === 'to') {
      const currencyFromSymbol = getCurrencyInternalName(currencyFrom);

      if (pairsList?.[currencyFromSymbol]) {
        let getCurrenciesByPair = pairsList[currencyFromSymbol];
        getCurrenciesByPair = getCurrenciesByPair.filter((symbol) => symbol !== currencyFromSymbol);

        if (getCurrenciesByPair) {
          return currenciesList.filter((currency) => getCurrenciesByPair.includes(getCurrencyInternalName(currency)));
        }

        return null;
      }

      return null;
    }
    const resultData = currenciesList.filter(
      (currency) =>
        Object.keys(pairsList).includes(getCurrencyInternalName(currency)) &&
        getCurrencyInternalName(currencyTo) !== getCurrencyInternalName(currency),
    );

    return resultData.sort((a, b) => {
      if (a.ticker < b.ticker) {
        return -1;
      }
      if (a.ticker > b.ticker) {
        return 1;
      }

      return 0;
    });
  }, [
    isFixed,
    allCurrencies,
    allPairs,
    fixedPairs,
    search,
    currencyFrom,
  ]);

  const [list] = useCurrenciesList({
    options: [
      appendManyOptions({
        type: 'currency',
        values: currenciesList,
        condition: currenciesList?.length > 0,
        middlewares: [optionPriorityMiddleware],
      }),
      appendManyOptions({
        type: 'currency',
        values: currenciesList,
        condition: currenciesList?.length > 0,
        middlewares: [optionNotPriorityMiddleware],
      }),
    ],
  });

  const label = {
    from: 'FIELDS.TEXT_1',
    to: 'FIELDS.TEXT_2',
  };

  const isMinWarning = type === 'from' && minAmount && +currencyFromValue < +minAmount;
  const isMaxWarning = type === 'from' && maxAmount && +currencyFromValue > +maxAmount;

  const [isActive, setIsActive] = useState(false);
  const amountLoading = isAmountLoading[type];
  const coinsLoading = currenciesList?.isLoading;

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  function setCursor() {
    const lastPosition = inputRef.current.value.length;
    inputRef.current.setSelectionRange(lastPosition, lastPosition);
    inputRef.current.focus();
  }

  function onChange(event) {
    const pattern = `^\\d*\\.?\\d{0,${18}}`;
    const regex = new RegExp(pattern);

    const match = event.target.value.match(regex);
    setAmount(match ? match[0] : '');
  }

  function onCloseDropdown() {
    setIsComponentVisible(false);
    setSearch('');
  }

  function setCurrency(symbol) {
    onCloseDropdown();
    if (type === 'from') {
      if (symbol === currencyTo) setCurrencyTo(currencyFrom);
      setCurrencyFrom(allCurrencies.data.find((cur) => getCurrencyInternalName(cur) === symbol));
    }
    if (type === 'to') {
      if (symbol === currencyFrom) setCurrencyFrom(currencyTo);
      setCurrencyTo(allCurrencies.data.find((cur) => getCurrencyInternalName(cur) === symbol));
    }
  }

  const handleAmountBlur = () => {
    setIsActive(false);
  };

  const onFocus = () => {
    setIsActive(true);
    setCursor();
  };

  const isFromFiled = type === 'from';
  const formId = `exchange_form_${type}_field`;

  return (
    <Row ref={ref} className={`main-page__exchange-group main-page__exchange-${type}`}>
      <InputGroup
        onClick={() => inputRef.current ?? inputRef?.current?.focus?.()}
        $isActive={isActive}
        $isDisabled={type === 'to'}
        $withError={isMinWarning || isMaxWarning}
      >
        {amountLoading && type === 'to' && <Spinner size={30} color="#252c44" />}

        <InputLabel htmlFor={formId} $hide={!!amountLoading}>
          {t(label[type])}
        </InputLabel>

        {isFromFiled && (
          <Input
            ref={inputRef}
            id={formId}
            value={currencyFromValue}
            onClick={(e) => e.stopPropagation()}
            onChange={onChange}
            onBlur={handleAmountBlur}
            onFocus={onFocus}
          />
        )}

        {!isFromFiled && (
          <FormToField
            fixed={isFixed}
            isToError={false}
            type={type}
            amount={currencyToValue}
            isLoading={amountLoading}
          />
        )}

        {isMinWarning && <MinBoundary value={minAmount} onClick={() => setAmount(minAmount)} />}

        {isMaxWarning && <MaxBoundary value={maxAmount} onClick={() => setAmount(maxAmount)} />}
      </InputGroup>

      <Dropdown hide={false} onClick={() => setIsComponentVisible(true)} currency={currency} />

      {isComponentVisible && (
        <CoinsDropdown
          currency={currency}
          setCurrency={setCurrency}
          onClose={onCloseDropdown}
          list={list}
          type={type}
          onChange={setSearch}
          search={search}
          isLoading={coinsLoading}
        />
      )}
    </Row>
  );
}

Fields.propTypes = {
  type: PropTypes.string,
}