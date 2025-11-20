import React from 'react';
import { useDispatch } from 'react-redux';

import { setBackView } from '../reducer/emcdSwapSlice';

import FAQ from '../components/FAQ/FAQ';
import Header from '../components/Header/Header';

const FaqView = () => {
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    dispatch(setBackView());
  };

  return (
    <div>
      <Header title={'Как работает обмен'} close onClose={handleButtonClick} />

      <FAQ />
    </div>
  );
};

export default FaqView;