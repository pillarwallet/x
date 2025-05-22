import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setCurrentView, setDetailSwapStatus } from '../../reducer/emcdSwapSlice';

import { useConfirmLogic } from '../../hooks/useConfirmLogic';

import CopyIcon from '../../components/icons/CopyIcon';
import WaitingDepositForm from './components/forms/WaitingDepositForm';
import ExchangeDepositForm from './components/forms/ExchangeDepositForm';
import SendToWalletForm from './components/forms/SendToWalletForm';
import SwapTimer from '../../components/SwapTimer/SwapTimer';
import ConfirmDepositForm from './components/forms/ConfirmDepositForm';
import Header from '../../components/Header/Header';

import { STATUS_ENUM } from '../../enums/status.enum';
import { VIEW_TYPE } from '../../constants/views';

const ConfirmView = () => {
  const dispatch = useDispatch()
  const {
    detailFormDataSwap,
    swapID,
    status
  } = useConfirmLogic()


  function formatUUID() {
    if (!swapID) {
      return ''
    }

    const clean = swapID.replace(/-/g, '');
    const firstPart = clean.slice(0, 8);
    const lastPart = clean.slice(-10);
    return `${firstPart} •••• ${lastPart}`;
  }

  useEffect(() => {
    const eventSource = new EventSource(`https://b2b-endpoint.dev-b2b.mytstnv.site/swap/status/${swapID}`);

    eventSource.onmessage = (event) => {
      dispatch(setDetailSwapStatus(+event.data));

      if (+event.data === VIEW_TYPE.SUCCESS) {
        dispatch(setCurrentView(VIEW_TYPE.SUCCESS));
      }

      if (+event.data === VIEW_TYPE.CANCELLED) {
        dispatch(setCurrentView(VIEW_TYPE.CANCELLED));
      }

      if (+event.data === VIEW_TYPE.ERROR) {
        dispatch(setCurrentView(VIEW_TYPE.ERROR));
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <Header title={'Обменивай легко и выгодно!'} smallFAQ />

      <div className="flex items-center justify-between bg-bg-35 px-4 py-5 rounded-sm mt-8">
        <div className="text-color-2 text-sm">Время на внесение депозиита</div>

        <SwapTimer duration={detailFormDataSwap.swap_duration || 0} />
      </div>

      <div className="flex justify-between items-center mt-8">
        <div>
          <div className="text-sm text-color-3">ID транзакции</div>

          <div>{ formatUUID() }</div>
        </div>

        <div className='cursor-pointer'>
          <CopyIcon />
        </div>
      </div>

      <div className="mt-8">
        <WaitingDepositForm formData={detailFormDataSwap} confirm={!!(status && STATUS_ENUM.WAIT_DEPOSIT < status)} active={!!(status && STATUS_ENUM.WAIT_DEPOSIT === status)} needLine />

        <ConfirmDepositForm formData={detailFormDataSwap} confirm={!!(status && STATUS_ENUM.CONFIRM_DEPOSIT < status)} active={!!(status && STATUS_ENUM.CONFIRM_DEPOSIT === status)} needLine />

        <ExchangeDepositForm formData={detailFormDataSwap} confirm={!!(status && STATUS_ENUM.EXCHANGE < status)} active={!!(status && STATUS_ENUM.EXCHANGE === status)} needLine />

        <SendToWalletForm formData={detailFormDataSwap} confirm={!!(status && STATUS_ENUM.WITHDRAW < status)} active={!!(status && STATUS_ENUM.WITHDRAW === status)} needLine={!!(status && STATUS_ENUM.WITHDRAW === status)} />
      </div>
    </div>
  );
};

export default ConfirmView;