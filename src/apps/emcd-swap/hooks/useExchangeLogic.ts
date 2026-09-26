import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { flushSync } from 'react-dom';

import {
  useGetSwapCoinsQuery,
  useLazyGetEstimateQuery,
} from '../api/coinsApi'

import {
  selectCoins,
  setCoins,
  setCurrentView, setFormData,
} from '../reducer/emcdSwapSlice';

import { useValidatedInput } from './useValidatedInput';

import { amountFromValidator, amountToValidator } from '../helpers/input-validator.helper';

import { VIEW_TYPE } from '../constants/views'
import { showToast, ToastType } from '../reducer/emcdSwapToastSlice';

export const useExchangeLogic = () => {

  const dispatch = useDispatch()
  const coins = useSelector(selectCoins)

  const [minFrom, setMinFrom] = useState<number | null>(null)
  const [maxFrom, setMaxFrom] = useState<number | null>(null)
  const [minTo, setMinTo] = useState<number | null>(null)
  const [maxTo, setMaxTo] = useState<number | null>(null)

  const amountTo = useValidatedInput('')
  const amountFrom = useValidatedInput('')

  const [currentCoinFrom, setCurrentCoinFrom] = useState<Record<string, any> | null>(null)
  const [currentCoinTo, setCurrentCoinTo] = useState<Record<string, any> | null>(null)

  const [networksFrom, setNetworksFrom] = useState<Array<Record<string, any>>>([])
  const [networksTo, setNetworksTo] = useState<Array<Record<string, any>>>([])

  const [currentNetworkFrom, setCurrentNetworkFrom] = useState<Record<string, any> | null>(null)
  const [currentNetworkTo, setCurrentNetworkTo] = useState<Record<string, any> | null>(null)

  const [rate, setRate] = useState<number | null>(null)

  const { data, isFetching, isError: isCoinsError, error: coinsError } = useGetSwapCoinsQuery()
  const [triggerEstimate, { data: dataEstimate, isFetching: isFetchingEstimate, isError: isEstimateError, error: estimateError, }] = useLazyGetEstimateQuery()

  // Инициализация монет и начальных значений
  useEffect(() => {
    amountFrom.setValue('100')
    if (data) {
      dispatch(setCoins(data))
      setCurrentCoinFrom(data[0])
      setCurrentCoinTo(data[1])
    }
  }, [data, dispatch])

  const setToast = ({ message, type }: { message: string; type: ToastType }) => {
    dispatch(showToast({ message, type }))
  }

  useEffect(() => {
    if (isCoinsError) {
      const msg =
        (coinsError as any)?.data?.message ||
        (coinsError as any)?.error ||
        'Не удалось загрузить список монет';
      setToast({ message: msg, type: 'error' });
    }
  }, [isCoinsError, coinsError]);

  useEffect(() => {
    if (isEstimateError) {
      const msg =
        (estimateError as any)?.data?.message ||
        (estimateError as any)?.error ||
        'Ошибка получения курса обмена';
      setToast({ message: msg, type: 'error' });
    }
  }, [isEstimateError, estimateError]);

  // Установка сетей, когда выбрана монета
  useEffect(() => {
    if (currentCoinFrom) {
      const filtered = currentCoinFrom.networks.filter((n: any) => n.withdraw_supported)
      setNetworksFrom(filtered)
      setCurrentNetworkFrom(filtered[0])
    }
  }, [currentCoinFrom])

  useEffect(() => {
    if (currentCoinTo) {
      const filtered = currentCoinTo.networks.filter((n: any) => n.withdraw_supported)
      setNetworksTo(filtered)
      setCurrentNetworkTo(filtered[0])
    }
  }, [currentCoinTo])

  // Обновление после получения оценки
  useEffect(() => {
    if (dataEstimate) {
      amountFrom.setValue(dataEstimate.amount_from)
      amountTo.setValue(dataEstimate.amount_to)
      setRate(dataEstimate.rate)

      setMinFrom(dataEstimate.min_from ? +dataEstimate.min_from : minFrom)
      setMaxFrom(dataEstimate.max_from ? +dataEstimate.max_from : maxFrom)
      setMinTo(dataEstimate.min_to ? +dataEstimate.min_to : minTo)
      setMaxTo(dataEstimate.max_to ? +dataEstimate.max_to : maxTo)
    }
  }, [dataEstimate])

  const handleSwap = () => {
    const tempCoin = currentCoinFrom;
    setCurrentCoinFrom(currentCoinTo);
    setCurrentCoinTo(tempCoin);

    const tempNetwork = currentNetworkFrom;
    setCurrentNetworkFrom(currentNetworkTo);
    setCurrentNetworkTo(tempNetwork);

    const tempAmount = amountFrom.value;
    amountFrom.setValue(amountTo.value);
    amountTo.setValue(tempAmount);

    setTimeout(() => {
      if (currentCoinTo && currentCoinFrom && currentNetworkFrom && currentNetworkTo) {
        triggerEstimate({
          coin_from: currentCoinFrom.title,
          coin_to: currentCoinTo.title,
          network_from: currentNetworkFrom.title,
          network_to: currentNetworkFrom.title,
          amount_to: amountTo.value,
        });
      }
    }, 0);
  };

  const changeNetworkFrom = (value: Record<string, any> | null) => {
    flushSync(() => {
      setCurrentNetworkFrom(value)
    })

    getEstimateForChangeCoinOrNetwork()
  }

  const changeNetworkTo = (value: Record<string, any> | null) => {
    flushSync(() => {
      setCurrentNetworkTo(value)
    })

    getEstimateForChangeCoinOrNetwork()
  }


  // Debounce estimate (from)
  const debouncedTriggerEstimateFrom = useCallback(
    debounce((value: string | null) => {
      triggerEstimate({
        coin_from: currentCoinFrom?.title,
        coin_to: currentCoinTo?.title,
        network_from: currentNetworkFrom?.title,
        network_to: currentNetworkTo?.title,
        amount_from: value,
      })
    }, 500),
    [currentCoinFrom, currentCoinTo, currentNetworkFrom, currentNetworkTo]
  )

  // Debounce estimate (to)
  const debouncedTriggerEstimateTo = useCallback(
    debounce((value: string | null) => {
      triggerEstimate({
        coin_from: currentCoinFrom?.title,
        coin_to: currentCoinTo?.title,
        network_from: currentNetworkFrom?.title,
        network_to: currentNetworkTo?.title,
        amount_to: value,
      })
    }, 500),
    [currentCoinFrom, currentCoinTo, currentNetworkFrom, currentNetworkTo]
  )

  const handleChangeAmountFrom = (value: string | null) => {
    const validationFrom = amountFromValidator(value, maxFrom, minFrom)
    const validationTo = amountToValidator(amountTo.value, maxTo, minTo)

    amountFrom.changeValid({ valid: validationFrom.valid, error: validationFrom.error })
    amountTo.changeValid({ valid: validationTo.valid, error: validationTo.error })

    amountFrom.setValue(value)

    debouncedTriggerEstimateFrom(value)
  }

  const getEstimateForChangeCoinOrNetwork = () => {
    if (currentCoinFrom && currentCoinTo && currentNetworkTo && currentNetworkFrom) {
      triggerEstimate({
        coin_from: currentCoinFrom.title,
        coin_to: currentCoinTo.title,
        network_from: currentNetworkFrom.title,
        network_to: currentNetworkTo.title,
        amount_from: amountFrom.value,
      })
    }
  }

  const handleChangeAmountTo = (value: string | null) => {
    const validationTo = amountToValidator(value, maxTo, minTo)
    const validationFrom = amountFromValidator(amountFrom.value, maxFrom, minFrom)

    amountFrom.changeValid({ valid: validationFrom.valid, error: validationFrom.error })
    amountTo.changeValid({ valid: validationTo.valid, error: validationTo.error })

    amountTo.setValue(value)
    debouncedTriggerEstimateTo(value)
  }

  const changeCoinFrom = (value: Record<string, any>) => {
    const filtered = value.networks.filter((n: any) => n.withdraw_supported);
    const selectedNetwork = filtered[0];

    setCurrentCoinFrom(value);
    setNetworksFrom(filtered);
    setCurrentNetworkFrom(selectedNetwork);

    triggerEstimate({
      coin_from: value.title,
      coin_to: currentCoinTo?.title,
      network_from: selectedNetwork?.title,
      network_to: currentNetworkTo?.title,
      amount_from: amountFrom.value,
    });
  };


  const changeCoinTo = (value: Record<string, any>) => {
    const filtered = value.networks.filter((n: any) => n.withdraw_supported);
    const selectedNetwork = filtered[0];

    setCurrentCoinTo(value);
    setNetworksTo(filtered);
    setCurrentNetworkTo(selectedNetwork);

    triggerEstimate({
      coin_from: currentCoinFrom?.title,
      coin_to: value.title,
      network_from: currentNetworkFrom?.title,
      network_to: selectedNetwork?.title,
      amount_from: amountFrom.value,
    });
  };

  const handleButtonClick = () => {
    dispatch(setCurrentView(VIEW_TYPE.FAQ))
  }

  const submitForm = () => {
    if (!amountTo.value || !amountFrom.value || amountTo.error || amountFrom.error || isFetchingEstimate) {
      return
    }

    dispatch(setFormData({
      coin_from: currentCoinFrom?.title,
      coin_to: currentCoinTo?.title,
      network_from: currentNetworkFrom?.title,
      network_to: currentNetworkTo?.title,
      amount_from: amountFrom.value,
      amount_to: amountTo.value,
    }))

    dispatch(setCurrentView(VIEW_TYPE.RECIPIENT))
  }

  return {
    coins,
    currentCoinFrom,
    currentCoinTo,
    currentNetworkFrom,
    currentNetworkTo,
    networksFrom,
    networksTo,
    amountFrom,
    amountTo,
    rate,
    isFetching,
    isFetchingEstimate,
    handleChangeAmountFrom,
    handleChangeAmountTo,
    changeCoinFrom,
    changeCoinTo,
    setCurrentNetworkFrom: changeNetworkFrom,
    setCurrentNetworkTo: changeNetworkTo,
    handleButtonClick,
    submitForm,
    handleSwap,
  }
}