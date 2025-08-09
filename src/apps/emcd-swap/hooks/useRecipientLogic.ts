import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  useCreateSwapMutation,
  useCreateUserMutation,
  useLazyGetSwapQuery,
} from '../api/coinsApi';

import {
  selectCoins,
  selectFormData,
  setCurrentView, setDepositAddress, setDetailSwapFormData,
  setFormData,
  setSwapID,
} from '../reducer/emcdSwapSlice';
import { showToast } from '../reducer/emcdSwapToastSlice'

import { isValidEmail } from '../helpers/email-validator.helper';

import { VIEW_TYPE } from '../constants/views'
import { isValidCryptoAddress } from '../helpers/crypto-address-validator';

type ToastType = 'success' | 'error' | 'warning' | 'info' | null

export const useRecipientLogic = () => {
  const dispatch = useDispatch()

  const formData = useSelector(selectFormData)
  const coins = useSelector(selectCoins)

  const [addressTo, setAddressTo] = useState<string | null>('')
  const [email, setEmail] = useState<string | null>('')
  const [tagTo, setTagTo] = useState<string | null>('')

  const [createSwap, { isLoading }] = useCreateSwapMutation()
  const [createUser, { isLoading: isLoadingUser }] = useCreateUserMutation()

  const [triggerGetSwap, { data: dataSwap, isFetching: isFetchSwap }] = useLazyGetSwapQuery()

  useEffect(() => {
    dispatch(setDetailSwapFormData(dataSwap))

    if (dataSwap) {
      dispatch(setCurrentView(VIEW_TYPE.CONFIRM))
    }
  }, [dataSwap]);

  const setToast = ({ message, type }: { message: string; type: ToastType }) => {
    dispatch(showToast({ message, type }))
  }

  const pasteFromClipboard = async (
    setter: (value: string | null) => void,
    setToast: (toast: { message: string; type: 'error' | 'success' | 'info' | 'warning' }) => void
  ) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
    } catch {
      setToast({
        message: 'Разреши вставлять текст в настройках браузера или смартфона',
        type: 'error',
      });
    }
  };

  const pasteAddressTo = () => pasteFromClipboard(setAddressTo, setToast);
  const pasteEmail = () => pasteFromClipboard(setEmail, setToast);
  const pasteTagTo = () => pasteFromClipboard(setTagTo, setToast);

  const handleButtonClick = () => {
    dispatch(setCurrentView(VIEW_TYPE.EXCHANGE))
  }

  const onChangeAddress = (address: string | null) => {
    setAddressTo(address)
  }

  const onChangeTag = (tag: string | null) => {
    setTagTo(tag)
  }

  const onChangeEmail = (email: string | null) => {
    setEmail(email)
  }

  const submitForm = async () => {
    if (
      !addressTo ||
      !isValidCryptoAddress(addressTo) ||
      !isValidEmail(email) ||
      isFetchSwap ||
      isLoading ||
      isLoadingUser
    ) {
      return
    }

    dispatch(setFormData({
      address_to: addressTo,
      tag_to: tagTo,
      email: email,
    }))

    try {
      const result = await createSwap({ ...formData, address_to: addressTo, tag_to: tagTo, email: email, }).unwrap()
      await createUser({ email, language: 'ru', swap_id: result.id })
      setToast({ message: 'Заявка на обмен отправлена успешно!', type: 'success' })

      dispatch(setSwapID(result.id))
      dispatch(setDepositAddress(result.deposit_address))

      await triggerGetSwap({ swapID: result.id })

    } catch (err: any) {
      console.error('Swap creation error:', err);
      setToast({ message: 'Не удалось отправить заявку на обмен', type: 'error' })
    }
  }

  return {
    addressTo,
    email,
    tagTo,
    setAddressTo,
    setEmail,
    setTagTo,
    pasteAddressTo,
    pasteEmail,
    pasteTagTo,
    formData,
    coins,
    handleButtonClick,
    onChangeAddress,
    onChangeTag,
    onChangeEmail,
    submitForm,
    isLoading,
  }
}
