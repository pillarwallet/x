import { isNaN } from 'lodash';
import { TailSpin } from 'react-loader-spinner';

// images
import logoEthereum from '../../assets/images/logo-ethereum.png';
import UpgradeGreenLogo from '../../assets/images/upgrade-green-logo.svg';

// utils
import { limitDigitsNumber } from '../../utils/number';

interface EIP7702UpgradeActionProps {
  onClose: () => void;
  handleUpgrade: () => void;
  gasFeeEstimates?: string;
  isCheckingGas?: boolean;
  hasEnoughGas?: boolean;
}

const CheckIcon = () => {
  return (
    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#8A77FF] border-[1.5px] border-[#A594FF]">
      <svg
        className="w-3 h-3 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        strokeWidth="2"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

const EIP7702UpgradeAction = ({
  onClose,
  gasFeeEstimates,
  handleUpgrade,
  isCheckingGas = false,
  hasEnoughGas = false,
}: EIP7702UpgradeActionProps) => {
  return (
    <>
      <div className="flex flex-col gap-2.5 items-center">
        <img
          src={UpgradeGreenLogo}
          alt="upgrade-green-arrows"
          className="w-[66px] h-[44px]"
        />
        <p className="text-white font-normal text-xl">Upgrade your account</p>
        <div className="flex justify-center items-center text-sm font-normal gap-1">
          <p className="text-white">Network:</p>
          <img
            src={logoEthereum}
            className="rounded-full w-4 h-4 flex-shrink-0"
            alt="logo-ethereum"
          />
          <p className="text-[#627EEA]">Ethereum</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-[7px]">
          <CheckIcon />
          <p className="text-white text-base font-normal">
            <span className="text-white" style={{ opacity: 0.7 }}>
              Faster Transactions.{' '}
            </span>
            Lower fees.
          </p>
        </div>
        <div className="flex items-center gap-[7px]">
          <CheckIcon />
          <p className="text-white text-base font-normal">
            <span className="text-white" style={{ opacity: 0.7 }}>
              Pay with any token.{' '}
            </span>
            Any time.
          </p>
        </div>
        <div className="flex items-center gap-[7px]">
          <CheckIcon />
          <p className="text-white text-base font-normal">
            <span className="text-white" style={{ opacity: 0.7 }}>
              Same account.{' '}
            </span>
            Smart Features.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full items-center">
        <div className="flex gap-2 items-center">
          <p
            className="text-[13px] text-white font-normal"
            style={{ opacity: 0.7 }}
          >
            Fees:
          </p>
          {isCheckingGas ? (
            <TailSpin color="#FFFFFF" height={12} width={12} />
          ) : (
            <p className="text-[13px] text-white font-normal">
              {gasFeeEstimates && !isNaN(Number(gasFeeEstimates))
                ? limitDigitsNumber(Number(gasFeeEstimates))
                : '-'}{' '}
              ETH
            </p>
          )}
        </div>
        <div className="w-full rounded-[10px] bg-[#121116] p-[2px_2px_6px_2px]">
          <button
            className={`flex items-center justify-center w-full rounded-[8px] h-[42px] p-[1px_6px_1px_6px] text-white font-normal text-base transition-opacity ${
              isCheckingGas || !hasEnoughGas
                ? 'bg-[#3D3A44] cursor-not-allowed opacity-60'
                : 'bg-[#8A77FF] hover:opacity-90'
            }`}
            type="button"
            onClick={handleUpgrade}
            disabled={isCheckingGas || !hasEnoughGas}
          >
            {!hasEnoughGas && !isCheckingGas ? 'Not enough gas' : 'Upgrade now'}
          </button>
        </div>
        <button
          type="button"
          className="text-white text-xs font-normal underline underline-offset-2 opacity-70"
          onClick={onClose}
        >
          Upgrade later
        </button>
      </div>
    </>
  );
};

export default EIP7702UpgradeAction;
