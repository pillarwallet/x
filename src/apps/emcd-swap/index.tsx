import React from 'react';

import { useSelector } from 'react-redux'

import './styles/tailwindDeposit.css'
import 'tippy.js/dist/tippy.css';

import MainLayout from './layouts/MainLayout'

import ExchangeView from './views/ExchangeView'
import FAQView from './views/FaqView'
import RecipientView from './views/RecipientView'
import ConfirmView from './views/Confirm/ConfirmView'
import SuccessView from './views/SuccessView'
import ToastNotification from './components/ToastNotification/ToastNotification'

import { selectCurrentView } from './reducer/emcdSwapSlice';

import { VIEW_TYPE } from './constants/views'
import CancelledView from './views/CancelledView';
import ErrorView from './views/ErrorView';

const viewComponents: Record<VIEW_TYPE, React.ComponentType> = {
  [VIEW_TYPE.EXCHANGE]: ExchangeView,
  [VIEW_TYPE.FAQ]: FAQView,
  [VIEW_TYPE.RECIPIENT]: RecipientView,
  [VIEW_TYPE.CONFIRM]: ConfirmView,
  [VIEW_TYPE.SUCCESS]: SuccessView,
  [VIEW_TYPE.CANCELLED]: CancelledView,
  [VIEW_TYPE.ERROR]: ErrorView,
}

const App = () => {
  const currentView = useSelector(selectCurrentView)

  const CurrentViewComponent = viewComponents[currentView]

  return (
    <MainLayout>
      { CurrentViewComponent ? <CurrentViewComponent /> : null }

      <ToastNotification />
    </MainLayout>
  );
};

export default App;
