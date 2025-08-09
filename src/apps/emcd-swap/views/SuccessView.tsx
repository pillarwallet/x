import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectDetailFormDataSwap,
  selectSwapID,
  setCurrentView,
} from '../reducer/emcdSwapSlice';
import { showToast, ToastType } from '../reducer/emcdSwapToastSlice';

import Button from '../components/Button/Button';
import SuccessImg from '../assets/success.png';
import CopyIcon from '../components/icons/CopyIcon';
import Header from '../components/Header/Header';

import { copyToClipboard } from '../helpers/copy.helper';

import { VIEW_TYPE } from '../constants/views';

const SuccessView = () => {
  const dispatch = useDispatch();

  const swapID = useSelector(selectSwapID);
  const detailFormDataSwap = useSelector(selectDetailFormDataSwap);
  const setToast = ({
    message,
    type,
  }: {
    message: string;
    type: ToastType;
  }) => {
    dispatch(showToast({ message, type }));
  };

  const formatUUID = () => {
    if (!swapID) {
      return '';
    }

    const clean = swapID.replace(/-/g, '');
    const firstPart = clean.slice(0, 8);
    const lastPart = clean.slice(-10);
    return `${firstPart} •••• ${lastPart}`;
  };

  const handleClick = () => {
    dispatch(setCurrentView(VIEW_TYPE.EXCHANGE));
  };

  return (
    <div className="flex flex-col items-center justify-between h-[80vh]">
      <Header />

      <div className="flex flex-col justify-center items-center text-center">
        <img src={SuccessImg} alt="" />

        <div className="flex flex-col gap-y-5">
          <div className="text-color-1 font-semibold text-7">Готово</div>

          <div className="py-4 px-6 bg-bg-2 rounded-sm text-lg text-success border border-[#D0D0D012]/10">
            + {detailFormDataSwap.amount_to} {detailFormDataSwap.coin_to}
          </div>

          <div className="flex justify-center gap-x-2">
            <div className="text-xs text-color-6 font-medium">
              ID транзакции <span className="text-color-3">{formatUUID()}</span>
            </div>

            <div
              onClick={() => copyToClipboard(swapID || '', setToast)}
              className="w-4 h-4 cursor-pointer"
            >
              <CopyIcon />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Button onClick={handleClick} size={'md'} type={'main'}>
          Начать новый обмен
        </Button>
      </div>
    </div>
  );
};

export default SuccessView;