import React from 'react';
import clsx from 'clsx';

import { useRecipientLogic } from '../hooks/useRecipientLogic';

import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import Step from '../components/Step/Step';
import DefaultInput from '../components/DefaultInput/DefaultInput';
import Header from '../components/Header/Header';
import Loader from '../components/Loader/Loader';

import { isValidEmail } from '../helpers/email-validator.helper';

const RecipientView = () => {
  const {
    addressTo,
    email,
    tagTo,
    pasteAddressTo,
    pasteEmail,
    pasteTagTo,
    onChangeAddress,
    onChangeEmail,
    onChangeTag,
    handleButtonClick,
    formData,
    coins,
    submitForm,
    isLoading,
  } = useRecipientLogic()


  const coinTo = coins.find((item) => item.title === formData.coin_to) || null
  const coinFrom = coins.find((item) => item.title === formData.coin_from) || null

  const isFormValid = isValidEmail(email) && !!addressTo && !isLoading

  return (
    <div>
      <Header title={'О получателе'} close onClose={handleButtonClick} smallFAQ />

      <div className="flex justify-between items-center mt-10">
        <div className="flex flex-col gap-y-2">
          <div className="text-color-3">Вы отдаете</div>

          <div className="flex items-center gap-x-2">
            <img
              className="w-6 h-6"
              src={coinFrom ? coinFrom.icon_url : ''}
              alt={`${formData.coin_from || 'Coin'} icon`}
            />

            <div className="text-lg text-color-1">
              {formData.amount_from || ''} {formData.coin_from || ''}
            </div>
          </div>
        </div>

        <div>
          <ArrowRightIcon />
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="text-color-3">Вы получаете</div>

          <div className="flex items-center gap-x-2">
            <img
              className="w-6 h-6"
              src={coinTo ? coinTo.icon_url : ''}
              alt={`${formData.coin_to || 'Coin'} icon`}
            />

            <div className="text-lg text-color-1">
              {formData.amount_to} {formData.coin_to}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-6 mt-10">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Step number={1} success={!!addressTo} />

              <div className="text-color-1 text-sm">Куда перевести ?</div>
            </div>

            <div
              className="text-brand text-2.5 cursor-pointer"
              onClick={pasteAddressTo}
            >
              Вставить
            </div>
          </div>

          <DefaultInput
            placeholder={'Укажите адрес кошелька'}
            value={addressTo}
            onChange={onChangeAddress}
          />
        </div>

        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Step number={2} success={!!tagTo} />

              <div className="text-color-1 text-sm">
                Укажите, если требуется
              </div>
            </div>

            <div
              className="text-brand text-2.5 cursor-pointer"
              onClick={pasteTagTo}
            >
              Вставить
            </div>
          </div>

          <div>
            <DefaultInput
              placeholder={'Укажите мемо адрес'}
              value={tagTo}
              onChange={onChangeTag}
            />

            <div className="mt-1 text-xs text-color-3">
              Укажите Memo/Тег, если он нужен; иначе оставьте поле пустым
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Step number={3} success={isValidEmail(email)} />

              <div className="text-color-1 text-sm">
                На какую почту отправить статус?
              </div>
            </div>

            <div
              className="text-brand text-2.5 cursor-pointer"
              onClick={pasteEmail}
            >
              Вставить
            </div>
          </div>

          <DefaultInput
            placeholder={'Укажите почту'}
            value={email}
            onChange={onChangeEmail}
          />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-col justify-center text-center">
          <div className="text-xs text-color-3">
            Нажимая «Начать обмен», ты соглашаешься с
          </div>

          <a
            href="/emcd-swap/documents/terms.pdf"
            download="Crypto Swap (exchange) Terms and Conditions.pdf"
            target="_blank"
            className="text-brand text-xs cursor-pointer"
          >
            правилами использования сервиса
          </a>
        </div>

        <button
          className={clsx(
            'w-full min-h-7 text-color-1 text-sm border py-2 rounded-sm text-center border-bg-35 mt-10 transition-all',
            { 'bg-transparent': !isFormValid, 'bg-brand': isFormValid }
          )}
          disabled={!isFormValid}
          onClick={submitForm}
        >
          {
            !isLoading ? 'Начать' : <Loader />
          }
        </button>
      </div>
    </div>
  );
};

export default RecipientView;
