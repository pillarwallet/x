import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import LogoIcon from '../icons/LogoIcon';
import CloseIcon from '../icons/CloseIcon';

import { setCurrentView } from '../../reducer/emcdSwapSlice';

import { VIEW_TYPE } from '../../constants/views';

interface HeaderProps {
  title?: string;
  close?: boolean | null;
  smallFAQ?: boolean | null;
  onClose?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, close, onClose, smallFAQ }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogoClick = () => {
    const url = window.location.origin + location.pathname;
    window.open(url, '_blank');
  };

  const handleFAQ = () => {
    dispatch(setCurrentView(VIEW_TYPE.FAQ));
  };

  return (
    <div className="flex items-center justify-between mb-2 w-full">
      {!close ? (
        <div onClick={handleLogoClick} className="cursor-pointer">
          {' '}
          <LogoIcon />{' '}
        </div>
      ) : (
        <div onClick={onClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      )}

      <div className="text-lg text-color-1 font-medium">{title}</div>

      <div className="flex items-center gap-x-3">
        {smallFAQ && (
          <div
            onClick={handleFAQ}
            className="bg-[#232323] py-2 px-3 rounded-sm text-color-1 cursor-pointer"
          >
            ?
          </div>
        )}
        <div className="bg-[#232323] py-2 px-3 rounded-sm text-color-1">RU</div>
      </div>
    </div>
  );
};

export default Header;