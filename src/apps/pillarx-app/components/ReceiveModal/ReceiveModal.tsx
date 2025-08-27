/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';

// utils
import {
  CompatibleChains,
  getLogoForChainId,
} from '../../../../utils/blockchain';

// reducer
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import { setIsReceiveModalOpen } from '../../reducer/WalletPortfolioSlice';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';

// images
import CopyIcon from '../../images/token-market-data-copy.png';

// components
import TokenLogoMarketDataRow from '../TokenMarketDataRow/TokenLogoMarketDataRow';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

const ReceiveModal = () => {
  const { walletAddress: accountAddress } = useTransactionKit();
  const dispatch = useAppDispatch();
  const isReceiveModalOpen = useAppSelector(
    (state) => state.walletPortfolio.isReceiveModalOpen as boolean
  );
  const [copied, setCopied] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOnCloseReceiveModal = () => {
    dispatch(setIsReceiveModalOpen(false));
  };

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleOnCloseReceiveModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [copied]);

  if (!isReceiveModalOpen) return null;

  return (
    <div
      id="wallet-portfolio-tile-receive-modal"
      className="fixed inset-0 bg-[#12111680]/[.5] backdrop-blur-sm z-30"
      onMouseDown={handleOnCloseReceiveModal}
      data-testid="wallet-portfolio-tile-receive-modal"
    >
      <div className="fixed inset-0 flex items-center justify-center z-40 mobile:items-start tablet:items-start mt-20">
        <div
          ref={modalRef}
          className="relative flex flex-col w-full p-4 desktop:max-w-[446px] tablet:max-w-[446px] mobile:max-w-full mobile:mx-4 bg-container_grey border-[1px] border-white/[.05] rounded-2xl overflow-y-auto max-h-[75vh] mb-20"
          onMouseDown={(e) => e.stopPropagation()} // Prevents closing when clicking inside
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xl font-medium text-white">Receive</p>
            <div
              className="flex cursor-pointer p-2 w-fit h-fit items-center justify-center border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] cursor-pointer"
              onClick={handleOnCloseReceiveModal}
            >
              <p className="text-[13px] font-medium text-white/[.5]">ESC</p>
            </div>
          </div>
          <BodySmall className="italic text-white/[.5] mb-6 font-normal">
            Currently, PillarX Accounts support only the following ecosystems.
            If you deposit tokens from other networks, you may not be able to
            withdraw them.
          </BodySmall>
          <Body className="text-white mb-3">EVM Address</Body>
          <CopyToClipboard
            text={accountAddress || ''}
            onCopy={() => setCopied(true)}
          >
            <div className="flex items-center justify-between p-3 bg-lighter_container_grey rounded-[10px] mb-6 max-w-full cursor-pointer">
              <div className="flex-1 min-w-0">
                <BodySmall className="text-white/[.5] font-normal truncate">
                  {!accountAddress
                    ? 'We were not able to retrieve your EVM address, please check your internet connection and reload the page.'
                    : accountAddress}
                </BodySmall>
              </div>
              <div className="flex flex-shrink-0 pl-2">
                {copied ? (
                  <MdCheck
                    style={{
                      width: '12px',
                      height: '12px',
                      color: 'white',
                      opacity: 0.5,
                    }}
                  />
                ) : (
                  <img
                    src={CopyIcon}
                    alt="copy-evm-address"
                    className="w-3 h-3.5"
                  />
                )}
              </div>
            </div>
          </CopyToClipboard>

          <Body className="text-white mb-6">Supported Chains</Body>
          <div className="grid grid-cols-2 gap-4">
            {CompatibleChains.map((chain, index) => (
              <div key={index} className="flex items-center gap-2">
                <TokenLogoMarketDataRow
                  tokenLogo={getLogoForChainId(chain.chainId)}
                  size="w-9 h-9"
                  chainLogoSize="w-[14px] h-[14px]"
                />
                <Body className="text-white/[.5] font-normal">
                  {chain.chainName}
                </Body>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;
