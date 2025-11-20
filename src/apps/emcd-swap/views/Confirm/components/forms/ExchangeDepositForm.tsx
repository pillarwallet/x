import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DetailSwapFormData, selectDepositAddress } from '../../../../reducer/emcdSwapSlice';

import Step from '../../../../components/Step/Step';
import CopyIcon from '../../../../components/icons/CopyIcon';
import ConfirmIcon from '../../../../components/icons/ConfirmIcon';
import { showToast, ToastType } from '../../../../reducer/emcdSwapToastSlice';
import { copyToClipboard } from '../../../../helpers/copy.helper';

interface ExchangeDepositProps {
  confirm?: boolean | null;
  active?: boolean | null;
  needLine?: boolean | null;
  formData: DetailSwapFormData;
}

const ExchangeDepositForm:React.FC<ExchangeDepositProps> = ({ active, confirm, formData, needLine }) => {
  const depositAddress = useSelector(selectDepositAddress)
  const formattedAddress = depositAddress || 'Загрузка адреса...';

  const dispatch = useDispatch();

  const getStyleTitle = () => {
    if (active) {
      return 'text-color-1'
    }

    if (confirm) {
      return 'text-success'
    }

    return 'text-color-3'
  }

  const setToast = ({ message, type }: { message: string; type: ToastType }) => {
    dispatch(showToast({ message, type }))
  }

  return (
    <div className="flex gap-x-4 h-full relative mt-4">
      <div className="h-full">
        <div className="w-6 h-6 relative z-10">
          {confirm ? (
            <div className="bg-success-bg rounded-full">
              <ConfirmIcon />
            </div>
          ) : (
            <Step number={3} />
          )}
        </div>

        {needLine && (
          <div className="absolute top-5 left-2.5 w-[1px] h-full border-[1px] border-dashed border-bg-35"></div>
        )}
      </div>

      <div className="flex flex-col gap-y-4 transition-all w-full">
        <div>
          <div className={`transition-all  font-semibold ${getStyleTitle()}`}>
            Обмениваем
          </div>

          {active && (
            <div className="text-sm leading-[1.3] text-color-3">
              Мы подтвердили депозит. Начинаем обмен
            </div>
          )}
        </div>

        <div
          className={`flex flex-col gap-y-5 transition-all overflow-hidden w-full ${active ? 'h-auto' : 'h-0'}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">Статус</div>

              <div className="text-attention">Идет обмен</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">По адресу</div>

              <div className="text-color-1 break-words pr-2">
                {formattedAddress}
              </div>
            </div>
          </div>

          {formData.tag_to && <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">Мемо или тэг</div>

              <div className="text-color-1">
                {formData.tag_to}
              </div>
            </div>

            <div onClick={() => copyToClipboard(formData.tag_to || '', setToast)}>
              <CopyIcon />
            </div>
          </div>
          }

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">Сумма</div>

              <div className="text-color-1">
                {formData.amount_to} {formData.coin_to}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">В сети</div>

              <div className="text-color-1">{formData.network_to}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeDepositForm;