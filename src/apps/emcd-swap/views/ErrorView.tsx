import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectSwapID, setCurrentView } from '../reducer/emcdSwapSlice';
import { showToast, ToastType } from '../reducer/emcdSwapToastSlice';

import ErrorImg from '../assets/error.png';
import CopyIcon from '../components/icons/CopyIcon';
import Button from '../components/Button/Button';
import SupportIcon from '../components/icons/SupportIcon';
import SupportModal from '../components/Modals/SupportModal';
import Header from '../components/Header/Header';

import { copyToClipboard } from '../helpers/copy.helper';
import { VIEW_TYPE } from '../constants/views';

const ErrorView = () => {
  const dispatch = useDispatch();

  const [supportModal, setSupportModal] = useState(false);

  const swapID = useSelector(selectSwapID);

  const setToast = ({ message, type, }: { message: string; type: ToastType; }) => {
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

  const handleOpenSupportModal = () => {
    setSupportModal(true);
  }

  const handleCloseSupportModal = () => {
    setSupportModal(false);
  }

  return (
    <div className="flex flex-col items-center justify-between h-[80vh]">
      <Header />

      <div className="flex flex-col justify-center items-center text-center">
        <img src={ErrorImg} alt="" />

        <div className="flex flex-col gap-y-5">
          <div className="text-color-1 font-semibold text-7">Что-то пошло не так</div>

          <div className='text-color-6 font-medium'>
            Попробуйте еще раз <br/> или напишите в поддержку
          </div>

          <div className="flex justify-center gap-x-2">
            <div className="text-xs text-color-6 font-medium">
              ID транзакции <span className="text-color-3">{formatUUID()}</span>
            </div>

            <div
              onClick={() => copyToClipboard(swapID, setToast)}
              className="w-4 h-4 cursor-pointer"
            >
              <CopyIcon />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-y-4">
        <Button onClick={handleOpenSupportModal} size={'md'} type={'shade'}>
          <div className='flex justify-center items-center gap-x-3'>
            <SupportIcon />

            <div className='font-medium'>
              Написать в поддержку
            </div>
          </div>
        </Button>

        <Button onClick={handleClick} size={'md'} type={'main'}>
          <div className='font-medium'>
            Начать новый обмен
          </div>
        </Button>
      </div>

      { supportModal && <SupportModal onClose={handleCloseSupportModal} /> }
    </div>
  );
};

export default ErrorView;