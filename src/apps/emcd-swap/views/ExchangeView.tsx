import React from 'react';

import { useExchangeLogic } from '../hooks/useExchangeLogic';

import Button from '../components/Button/Button';
import Card from '../components/Card/Card';
import CustomSelect from '../components/Select/Select';
import InfoIcon from '../components/icons/InfoIcon';
import FormInput from '../components/FormInput/FormInput';
import Tippy from '@tippyjs/react';
import SwapIcon from '../components/icons/SwapIcon';
import Header from '../components/Header/Header';

const ExchangeView = () => {
  const {
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
    setCurrentNetworkFrom,
    setCurrentNetworkTo,
    handleButtonClick,
    submitForm,
    handleSwap,
  } = useExchangeLogic()

  return (
    <div className={'flex flex-col justify-between h-full'}>
      <div className="flex flex-col items-center justify-center">
        <Header title={'Обменивай легко и выгодно!'} />

        <Button type={'shade'} onClick={handleButtonClick}>
          Как это работает?
        </Button>

        <Card className="flex gap-x-4 mt-10" valid={amountFrom.valid}>
          <div className="flex flex-col gap-y-4 w-full">
            <div className={'text-color-2'}>Вы отдаете</div>

            <FormInput
              value={amountFrom.value}
              error={amountFrom.error}
              valid={amountFrom.valid}
              loading={isFetching || isFetchingEstimate}
              onChange={handleChangeAmountFrom}
            />
          </div>

          <div className="flex flex-col gap-y-4">
            <CustomSelect
              currentValue={currentCoinFrom}
              itemValue={'title'}
              withIcon
              itemIcon={'icon_url'}
              itemText={'title'}
              options={coins}
              placeholder={'Выберите монету'}
              onChange={changeCoinFrom}
            />

            <div className={'text-color-2 whitespace-pre'}>
              <CustomSelect
                currentValue={currentNetworkFrom}
                itemValue={'title'}
                itemText={'title'}
                options={networksFrom}
                placeholder={'Выберите сеть'}
                onChange={setCurrentNetworkFrom}
              />
            </div>
          </div>
        </Card>

        <div className="flex w-full justify-between my-5">
          <div className={'flex items-center gap-x-3'}>
            <Tippy
              content={<span className={'text-xs text-color-3'}>Сейчас курс примерный <br/> Финальный курс на шаге обмена</span>}
              placement="bottom"
              arrow={true}
              delay={[0, 100]} // задержка на появление и скрытие
              interactive={true}
            >
              <div className='cursor-pointer'>
                <InfoIcon />
              </div>
            </Tippy>

            <div className="text-sm text-color-3">
              1 {currentCoinFrom?.title}{' '}
              <span className={'mb-1'}>≈</span>{' '}
              <span className={'text-color-1'}>
                {rate} {currentCoinTo?.title}
              </span>
            </div>
          </div>

          <div>
            <Button onClick={handleSwap} type={'main'} size={'xs'}>
              <SwapIcon />
            </Button>
          </div>
        </div>

        <Card className="flex gap-x-4" valid={amountTo.valid}>
          <div className="flex flex-col gap-y-4 w-full">
            <div className={'text-color-2'}>Вы получаете</div>

            <FormInput
              value={amountTo.value}
              valid={amountTo.valid}
              error={amountTo.error}
              loading={isFetching || isFetchingEstimate}
              onChange={handleChangeAmountTo}
            />
          </div>

          <div className="flex flex-col gap-y-4">
            <CustomSelect
              currentValue={currentCoinTo}
              itemValue={'title'}
              withIcon
              itemIcon={'icon_url'}
              itemText={'title'}
              options={coins}
              placeholder={'Выберите монету'}
              onChange={changeCoinTo}
            />

            <div className={'text-color-2 whitespace-pre'}>
              <CustomSelect
                currentValue={currentNetworkTo}
                itemValue={'title'}
                itemText={'title'}
                options={networksTo}
                placeholder={'Выберите сеть'}
                onChange={setCurrentNetworkTo}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className='mt-10'>
        <div className='flex flex-col justify-center text-center'>
          <div className='text-xs text-color-3'>
            Нажимая «Начать обмен», ты соглашаешься с
          </div>

          <a href='../documents/terms.pdf' download='Crypto Swap (exchange) Terms and Conditions.pdf'
             target='_blank' className='text-brand text-xs cursor-pointer'>
            правилами использования сервиса
          </a>
        </div>

        <button
          className={`w-full min-h-7 text-color-1 text-sm border py-2 rounded-sm text-center border-bg-35 mt-10 transition-all ${!amountTo.value || !amountFrom.value || amountTo.error || amountFrom.error || isFetchingEstimate ? 'bg-transparent' : 'bg-brand'}`}
          onClick={submitForm}
        >
          Начать
        </button>
      </div>
    </div>
  );
};

export default ExchangeView;