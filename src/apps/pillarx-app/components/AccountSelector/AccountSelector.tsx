import { useState, useRef, useEffect, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// services
import { useGetWalletPortfolioQuery } from '../../../../services/pillarXApiWalletPortfolio';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { setActiveAccountMode } from '../../reducer/WalletPortfolioSlice';

// images
import WalletPortfolioIcon from '../../images/wallet-portfolio-icon.png';

const AccountSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { user } = usePrivy();
  const { walletAddress } = useTransactionKit();
  const activeAccountMode = useAppSelector(
    (state) => state.walletPortfolio.activeAccountMode
  );

  const eoaAddress = user?.wallet?.address;
  const smartAddress = walletAddress;

  // Fetch portfolio data for both accounts
  const { data: smartPortfolioData } = useGetWalletPortfolioQuery(
    { wallet: smartAddress || '', isPnl: false },
    { skip: !smartAddress }
  );

  const { data: eoaPortfolioData } = useGetWalletPortfolioQuery(
    { wallet: eoaAddress || '', isPnl: false },
    { skip: !eoaAddress }
  );

  // Calculate balances
  const smartBalance = useMemo(() => {
    return smartPortfolioData?.result?.data?.total_wallet_balance || 0;
  }, [smartPortfolioData]);

  const eoaBalance = useMemo(() => {
    return eoaPortfolioData?.result?.data?.total_wallet_balance || 0;
  }, [eoaPortfolioData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSelectAccount = (account: 'eoa' | 'smart') => {
    dispatch(setActiveAccountMode(account));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img
          src={WalletPortfolioIcon}
          alt="wallet-portfolio-icon"
          className="w-8 h-6"
        />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-sm font-medium">My portfolio</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-white/50 text-[11px]">Managing 2 Accounts</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[280px] bg-lighter_container_grey rounded-xl border border-white/[.05] shadow-lg z-50">
          <div
            onClick={() => handleSelectAccount('smart')}
            className={`flex items-center justify-between px-4 py-2 hover:bg-white/[.05] cursor-pointer transition-colors ${
              activeAccountMode === 'smart'
                ? 'bg-white/[.08] border-l-2 border-purple_medium'
                : ''
            }`}
          >
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[14px] font-medium">
                    Smart Account
                  </span>
                  {activeAccountMode === 'smart' && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-[14px] font-medium">
                    ${smartBalance.toFixed(2)}
                  </span>
                  <div
                    className="relative group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <circle
                        cx="7"
                        cy="7"
                        r="6.5"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <text
                        x="7"
                        y="10"
                        fontSize="10"
                        fill="white"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        i
                      </text>
                    </svg>
                    <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-[200px] bg-lighter_container_grey text-white text-[11px] px-3 py-2 rounded shadow-lg border border-white/[.05] z-[100]">
                      <div className="font-semibold mb-1.5">Smart Account</div>
                      <div className="flex items-start gap-1.5 mb-1">
                        <span className="text-green-500">✓</span>
                        <span>Batch transactions</span>
                      </div>
                      <div className="flex items-start gap-1.5 mb-1">
                        <span className="text-green-500">✓</span>
                        <span>Universal Gas Tank</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-green-500">✓</span>
                        <span>Chain Abstraction</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/50 text-[12px]">
                  {truncateAddress(smartAddress || '')}
                </span>
                <svg
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(smartAddress || '');
                  }}
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                >
                  <rect
                    x="5"
                    y="5"
                    width="9"
                    height="9"
                    rx="1"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 11V3C3 2.44772 3.44772 2 4 2H10"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleSelectAccount('eoa')}
            className={`flex items-center justify-between px-4 py-2 hover:bg-white/[.05] cursor-pointer transition-colors ${
              activeAccountMode === 'eoa'
                ? 'bg-white/[.08] border-l-2 border-purple_medium'
                : ''
            }`}
          >
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[14px] font-medium">
                    EOA
                  </span>
                  {activeAccountMode === 'eoa' && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-[14px] font-medium">
                    ${eoaBalance.toFixed(2)}
                  </span>
                  <div
                    className="relative group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <circle
                        cx="7"
                        cy="7"
                        r="6.5"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <text
                        x="7"
                        y="10"
                        fontSize="10"
                        fill="white"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        i
                      </text>
                    </svg>
                    <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-[200px] bg-lighter_container_grey text-white text-[11px] px-3 py-2 rounded shadow-lg border border-white/[.05] z-[100]">
                      <div className="font-semibold mb-1.5">EOA</div>
                      <div className="flex items-start gap-1.5 mb-1">
                        <span className="text-red-500">✗</span>
                        <span>Gas Tokens needed</span>
                      </div>
                      <div className="flex items-start gap-1.5 mb-1">
                        <span className="text-red-500">✗</span>
                        <span>Batch transactions</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-red-500">✗</span>
                        <span>Network Switching</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/50 text-[12px]">
                  {truncateAddress(eoaAddress || '')}
                </span>
                <svg
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(eoaAddress || '');
                  }}
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                >
                  <rect
                    x="5"
                    y="5"
                    width="9"
                    height="9"
                    rx="1"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 11V3C3 2.44772 3.44772 2 4 2H10"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
