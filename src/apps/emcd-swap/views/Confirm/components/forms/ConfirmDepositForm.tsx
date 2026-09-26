import React from 'react';

import { DetailSwapFormData } from '../../../../reducer/emcdSwapSlice';

import Step from '../../../../components/Step/Step';
import ConfirmIcon from '../../../../components/icons/ConfirmIcon';

interface ConfirmDepositFormProps {
  confirm?: boolean | null;
  active?: boolean | null;
  needLine?: boolean | null;
  formData: DetailSwapFormData;
}

const ConfirmDepositForm:React.FC<ConfirmDepositFormProps> = ({ active, confirm, needLine, formData }) => {
  const getStyleTitle = () => {
    if (active) {
      return 'text-color-1'
    }

    if (confirm) {
      return 'text-success'
    }

    return 'text-color-3'
  }

  console.log('formData', formData);

  return (
    <div className="flex gap-x-4 h-full relative mt-4">
      <div className="h-full">
        <div className="w-6 h-6 relative z-10">
          {confirm ? (
            <div className="bg-success-bg rounded-full">
              <ConfirmIcon />
            </div>
          ) : (
            <Step number={2} />
          )}
        </div>

        {needLine && (
          <div className="absolute top-5 left-2.5 w-[1px] h-full border-[1px] border-dashed border-bg-35"></div>
        )}
      </div>

      <div className="flex flex-col gap-y-4 transition-all w-full">
        <div>
          <div className={`transition-all  font-semibold ${getStyleTitle()}`}>
            Подтверждаем депозит
          </div>

          {active && (
            <div className="text-sm leading-[1.3] text-color-3">
              Мы получили ваш депозит и ждем подтверждения в блокчейне
            </div>
          )}
        </div>

        <div
          className={`flex flex-col gap-y-5 transition-all overflow-hidden w-full ${active ? 'h-auto' : 'h-0'}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">Статус</div>

              <div className="text-attention">Подтверждаем в блокчейне</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">Сумма</div>

              <div className="text-color-1">
                { formData.amount_from } { formData.coin_from }
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">По адресу</div>

              <div className="text-color-1 break-words pr-2">
                {formData.address_to}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">В сети</div>

              <div className="text-color-1">{formData.network_from}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDepositForm;