import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setCurrentView } from '../reducer/emcdSwapSlice';

import Button from '../components/Button/Button';
import SupportIcon from '../components/icons/SupportIcon';
import SupportModal from '../components/Modals/SupportModal';
import Header from '../components/Header/Header';
import CancelledImg from '../assets/cancelled.png';

import { VIEW_TYPE } from '../constants/views';


const CancelledView = () => {
  const dispatch = useDispatch();

  const [supportModal, setSupportModal] = useState(false);

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
        <img src={CancelledImg} alt="" />

        <div className="flex flex-col gap-y-5">
          <div className="text-color-1 font-semibold text-7">Время вышло</div>

          <div className='text-color-6 font-medium leading-[1.5]'>
            Депозит больше внести не получится. <br/> Пора начать новый обмен
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

export default CancelledView;