import { parseInt } from 'lodash';
import { Dispatch, SetStateAction, useState } from 'react';

// types
import { WalletPortfolioMobulaResponse } from '../../../../types/api';
import { SelectedToken } from '../../types/tokens';

// utils
import { getLogoForChainId } from '../../../../utils/blockchain';
import { limitDigitsNumber } from '../../../../utils/number';

// components
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import ArrowDown from '../../assets/arrow-down.svg';
import WarningIcon from '../../assets/warning.svg';

interface SellProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  token: SelectedToken | null;
  walletPortfolioData: WalletPortfolioMobulaResponse | undefined;
}

const Sell = (props: SellProps) => {
  const { setSearching, token, walletPortfolioData } = props;
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('0.00');
  const [notEnoughLiquidity, setNotEnoughLiquidity] = useState<boolean>(false);

  // Get the user's balance for the selected token
  const getTokenBalance = () => {
    if (!token || !walletPortfolioData?.result?.data?.assets) return 0;

    // Find the asset in the portfolio
    const assetData = walletPortfolioData.result.data.assets.find(
      (asset) => asset.asset.symbol === token.symbol
    );

    if (!assetData) return 0;

    // Find the contract balance for the specific token address
    const contractBalance = assetData.contracts_balances.find(
      (contract) =>
        contract.address.toLowerCase() === token.address.toLowerCase()
    );

    return contractBalance?.balance || 0;
  };

  const tokenBalance = getTokenBalance();

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!input || !Number.isNaN(parseFloat(input))) {
      setInputPlaceholder('0.00');
      setTokenAmount(input);

      if (input && token) {
        const inputAmount = parseFloat(input);
        setNotEnoughLiquidity(inputAmount > tokenBalance);
      } else {
        setNotEnoughLiquidity(false);
      }
    }
  };

  return (
    <>
      <div className="m-2.5 bg-black w-[422px] h-[100px] rounded-[10px]">
        <div className="flex items-center gap-3 p-3">
          <button
            onClick={() => {
              setSearching(true);
            }}
            type="button"
            className="flex-shrink-0"
          >
            {token ? (
              <div className="flex items-center justify-center w-[150px] h-9 bg-[#1E1D24] rounded-[10px]">
                <div className="relative inline-block">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt="Main"
                      className="w-6 h-6 rounded-full ml-1.5 mr-1.5"
                    />
                  ) : (
                    <div className="w-full h-full overflow-hidden rounded-full w-6 h-6 ml-1.5 mr-1.5">
                      <RandomAvatar name={token.name || ''} />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                        {token.name?.slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <img
                    src={getLogoForChainId(token.chainId)}
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    alt="Chain Logo"
                  />
                </div>
                <div className="flex flex-col ml-1.5 mt-1.5 h-9">
                  <div className="flex">
                    <p className="text-xs font-normal">{token.symbol}</p>
                    <p className="text-xs font-normal ml-0.5 text-grey">
                      {token.name.length >= 10
                        ? `${token.name.slice(0, 6)}...`
                        : token.name}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="text-[10px] font-normal text-grey h-2.5">
                      ${token.usdValue}
                    </p>
                  </div>
                </div>
                <img src={ArrowDown} alt="arrow-down" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-[150px] h-9 bg-[#1E1D24] rounded-[10px]">
                <div className="flex font-normal text-xs ml-1.5">
                  Select token
                </div>
                <div className="flex ml-2">
                  <img src={ArrowDown} alt="arrow-down" />
                </div>
              </div>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div
              className="flex items-center justify-between"
              style={{ height: 36 }}
            >
              <div className="flex-1 min-w-0 overflow-hidden">
                <input
                  className="w-full no-spinner text-right bg-transparent outline-none pr-0"
                  style={{
                    fontSize: '36px',
                    lineHeight: '1.2',
                    fontWeight: '500',
                  }}
                  placeholder={inputPlaceholder}
                  onChange={handleTokenAmountChange}
                  value={tokenAmount}
                  type="text"
                  onFocus={() => setInputPlaceholder('')}
                />
              </div>
              <p
                className="text-grey ml-0 flex-shrink-0 opacity-50"
                style={{ fontSize: '36px', fontWeight: '500' }}
              >
                {token ? token.symbol : 'TOKEN'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between m-2.5">
          <div className="flex">
            {notEnoughLiquidity && (
              <>
                <div className="flex items-center justify-center">
                  <img src={WarningIcon} alt="warning" />
                </div>
                <div className="underline text-[#FF366C] text-xs ml-1.5">
                  Not enough liquidity
                </div>
              </>
            )}
          </div>
          <div className="flex float-right">
            {token && (
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-3.5 h-3.5 rounded-full"
              />
            )}
            <div className="text-[#8A77FF] ml-1.5 text-xs">
              {token ? (
                <>
                  {limitDigitsNumber(tokenBalance)} {token.symbol} ($
                  {limitDigitsNumber(tokenBalance * parseFloat(token.usdValue))}
                  )
                </>
              ) : (
                '0.00($0.00)'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* amounts */}
      <div className="flex">
        {['10%', '25%', '50%', '75%', 'MAX'].map((item) => {
          const isMax = item === 'MAX';
          const percentage = isMax ? 100 : parseInt(item);
          const isDisabled = !token;

          return (
            <div
              key={item}
              className="flex bg-black ml-2.5 w-[75px] h-[30px] rounded-[10px] p-0.5 pb-1 pt-0.5"
            >
              <button
                className={`flex-1 items-center justify-center rounded-[10px] ${
                  isDisabled
                    ? 'bg-[#1E1D24] text-grey cursor-not-allowed'
                    : 'bg-[#121116] text-white cursor-pointer'
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    if (isMax) {
                      setTokenAmount(tokenBalance.toFixed(6));
                    } else {
                      const amount = (tokenBalance * percentage) / 100;
                      setTokenAmount(amount.toFixed(6));
                    }
                  }
                }}
                type="button"
                disabled={isDisabled}
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>

      {/* sell button */}
      <div className="flex m-2.5 w-[422px] h-[50px] rounded-[10px] bg-black p-0.5 pb-1 pt-0.5">
        <button
          className="flex flex-1 items-center justify-center rounded-[10px] text-white text-base font-medium disabled:opacity-50"
          style={{
            backgroundColor: '#121116',
          }}
          type="button"
          disabled={
            !token ||
            !tokenAmount ||
            parseFloat(tokenAmount) <= 0 ||
            notEnoughLiquidity
          }
        >
          Sell
        </button>
      </div>
    </>
  );
};

export default Sell;
