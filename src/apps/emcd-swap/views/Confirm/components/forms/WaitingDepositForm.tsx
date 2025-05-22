import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { showToast, ToastType } from '../../../../reducer/emcdSwapToastSlice';

import Step from '../../../../components/Step/Step';
import CopyIcon from '../../../../components/icons/CopyIcon';
import QRCode from 'qrcode.react';
import ConfirmIcon from '../../../../components/icons/ConfirmIcon';

import { DetailSwapFormData, selectCoins, selectDepositAddress } from '../../../../reducer/emcdSwapSlice';
import { copyToClipboard } from '../../../../helpers/copy.helper';

interface WaitingDepositFormProps {
  confirm?: boolean | null;
  active?: boolean | null;
  needLine?: boolean | null;
  formData: DetailSwapFormData
}

const WaitingDepositForm:React.FC<WaitingDepositFormProps> = ({ active, confirm, needLine, formData}) => {
  const dispatch = useDispatch();

  const coins = useSelector(selectCoins)
  const depositAddress = useSelector(selectDepositAddress)

  const setToast = ({ message, type }: { message: string; type: ToastType }) => {
    dispatch(showToast({ message, type }))
  }

  const coinFrom = coins.find((item) => item.title === formData.coin_from)


  const getStyleTitle = () => {
    if (active) {
      return 'text-color-1'
    }

    if (confirm) {
      return 'text-success'
    }

    return 'text-color-3'
  }

  return (
    <div className="flex gap-x-4 h-full relative z-10">
      <div className="h-full">
        <div className="w-6 h-6 relative z-10">
          {confirm ? (
            <div className="bg-success-bg rounded-full">
              <ConfirmIcon />
            </div>
          ) : (
            <Step number={1} />
          )}
        </div>

        {needLine && (
          <div className="absolute top-5 left-2.5 w-[1px] h-full border-[1px] border-dashed border-bg-35"></div>
        )}
      </div>

      <div className="flex flex-col gap-y-4 transition-all w-full">
        <div>
          <div className={`${getStyleTitle()} font-semibold`}>
            Ожидаем депозит
          </div>

          {active && (
            <div className="text-sm leading-[1.3] text-color-3">
              Скорость обработки депозита зависит от загруженности блокчейна. В среднем это от 2 до 20 минут
            </div>
          )}
        </div>

        <div
          className={`flex flex-col gap-y-5 transition-all overflow-hidden w-full ${active ? 'h-auto' : 'h-0'}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">Переведите сумму</div>

              <div className="flex gap-x-2">
                <img
                  className="w-6 h-6"
                  src={coinFrom ? coinFrom.icon_url : ''}
                  alt=""
                />

                <div className="text-color-1">
                  {formData.amount_from} {formData.coin_from}
                </div>
              </div>
            </div>

            <div className='cursor-pointer' onClick={() => copyToClipboard(formData.amount_from, setToast)}>
              <CopyIcon />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">По адресу</div>

              <div className="text-color-1 break-words pr-2">
                {depositAddress}
              </div>
            </div>

            <div className='cursor-pointer' onClick={() => copyToClipboard(depositAddress, setToast)}>
              <CopyIcon />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm text-color-3">Сеть</div>

              <div className="text-color-1">{formData.network_from}</div>
            </div>

            <div className="text-sm text-attention mt-2">
              Отправляйте на этот адрес только {formData.coin_from} в сети {formData.network_from} <br /> Иначе вы
              потеряете средства
            </div>

            <div className="mt-7">
              <QRCode size={150} value={depositAddress || ''} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingDepositForm;