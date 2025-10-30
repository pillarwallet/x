import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import EscIcon from '../../assets/esc-icon.svg';
import Refresh from '../Misc/Refresh';
import UsdcLogo from '../../assets/usd-coin-usdc-logo.png';
import ConfirmedIcon from '../../assets/confirmed-icon.svg';
import {
  getLogoForChainId,
  CompatibleChains,
} from '../../../../utils/blockchain';
import Tooltip from '../Misc/Tooltip';

interface SettingsMenuProps {
  closeSettingsMenu: () => void;
  setCustomBuyAmounts: Dispatch<SetStateAction<string[]>>;
  customBuyAmounts: string[];
  setCustomSellAmounts: Dispatch<SetStateAction<string[]>>;
  customSellAmounts: string[];
  selectedChainId: number;
  setSelectedChainId: Dispatch<SetStateAction<number>>;
}

export default function SettingsMenu(props: SettingsMenuProps) {
  const {
    closeSettingsMenu,
    setCustomBuyAmounts,
    customBuyAmounts,
    setCustomSellAmounts,
    customSellAmounts,
    selectedChainId,
    setSelectedChainId,
  } = props;

  // Chain options for USDC settlement - using CompatibleChains from blockchain.ts
  const chainOptions = CompatibleChains.map((chain) => ({
    symbol: chain.chainName,
    name: chain.chainName,
    chainId: chain.chainId,
  }));

  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Local state for buy amounts
  const [buyAmount1, setBuyAmount1] = useState(customBuyAmounts[0] || '10');
  const [buyAmount2, setBuyAmount2] = useState(customBuyAmounts[1] || '20');
  const [buyAmount3, setBuyAmount3] = useState(customBuyAmounts[2] || '50');
  const [buyAmount4, setBuyAmount4] = useState(customBuyAmounts[3] || '100');

  // Local state for sell percentages
  const [sellPercent1, setSellPercent1] = useState(
    customSellAmounts[0]?.replace('%', '') || '10'
  );
  const [sellPercent2, setSellPercent2] = useState(
    customSellAmounts[1]?.replace('%', '') || '25'
  );
  const [sellPercent3, setSellPercent3] = useState(
    customSellAmounts[2]?.replace('%', '') || '50'
  );
  const [sellPercent4, setSellPercent4] = useState(
    customSellAmounts[3]?.replace('%', '') || '75'
  );

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate a refresh action - you can add actual refresh logic here
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    setIsRefreshing(false);
  };

  // Update parent state when confirm is clicked
  const handleConfirm = () => {
    // Validate that no buy amounts are empty
    const validatedBuyAmounts = [
      buyAmount1 || '10',
      buyAmount2 || '20',
      buyAmount3 || '50',
      buyAmount4 || '100',
    ];

    // Validate that no sell percentages are empty
    const validatedSellAmounts = [
      `${sellPercent1 || '10'}%`,
      `${sellPercent2 || '25'}%`,
      `${sellPercent3 || '50'}%`,
      `${sellPercent4 || '75'}%`,
    ];

    setCustomBuyAmounts(validatedBuyAmounts);
    setCustomSellAmounts(validatedSellAmounts);
    closeSettingsMenu();
  };

  // Handle ESC key to close settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showChainDropdown) {
          setShowChainDropdown(false);
        } else {
          closeSettingsMenu();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSettingsMenu, showChainDropdown]);

  // Handle click outside to close dropdown and tooltip
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showChainDropdown) {
        const target = e.target as HTMLElement;
        if (
          !target.closest('[data-testid="pulse-settings-chain-selector"]') &&
          !target.closest('.absolute')
        ) {
          setShowChainDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChainDropdown]);

  return (
    <div
      className="flex flex-col w-full border-2 border-[#1E1D24] min-h-[264px] bg-[#1E1D24] rounded-2xl mt-10"
      data-testid="pulse-settings-menu-component"
    >
      {/* Header inside the box */}
      <div className="flex justify-between p-3 ml-1">
        <div className="flex items-center h-10 rounded-lg flex-1 max-w-[318px]">
          <h2 className="text-xl font-medium text-white">Settings</h2>
        </div>
        <div className="flex ml-3">
          {/* Refresh Button */}
          <div className="bg-black rounded-[10px] w-10 h-10 flex justify-center items-center p-[2px_2px_4px_2px]">
            <div
              className="w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center"
              data-testid="pulse-settings-refresh-button"
            >
              <Refresh
                onClick={handleRefresh}
                isLoading={isRefreshing}
                disabled={isRefreshing}
              />
            </div>
          </div>

          {/* ESC Button */}
          <div className="ml-3 bg-black rounded-[10px] w-10 h-10 flex justify-center items-center p-[2px_2px_4px_2px]">
            <button
              onClick={closeSettingsMenu}
              type="button"
              className="flex items-center justify-center w-9 h-[34px] bg-[#1E1D24] rounded-lg"
              data-testid="pulse-settings-close-button"
              aria-label="Close Settings"
            >
              <img src={EscIcon} alt="ESC" className="w-9 h-[34px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex flex-col w-full p-3">
        {/* Default Settlement Section */}
        <div className="mb-3 ml-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 relative">
              <span className="text-[13px] font-normal leading-[14px] tracking-[-0.02em] align-middle text-white/50">
                Default Settlement USDC
              </span>
              <Tooltip content="Choose which USDC you would like to sell your assets to">
                <div
                  className="flex items-center justify-center w-3 h-3 rounded-full bg-[#121116] hover:bg-black transition-colors flex-none order-1 flex-grow-0"
                  aria-label="Info"
                >
                  <span className="text-white/30 text-xs">?</span>
                </div>
              </Tooltip>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowChainDropdown(!showChainDropdown)}
                className="flex items-center justify-between h-10 px-3 gap-2 bg-[#1E1D24] rounded-lg hover:bg-black transition-colors w-full border-2 border-[#121116]"
                data-testid="pulse-settings-chain-selector"
              >
                <div className="flex items-center gap-2">
                  <div className="relative inline-block">
                    <img
                      src={UsdcLogo}
                      alt="USDC"
                      className="w-5 h-5 rounded-full"
                    />
                    <img
                      src={getLogoForChainId(selectedChainId)}
                      className="w-2.5 h-2.5 absolute bottom-[-2px] right-[-2px] rounded-full"
                      alt="Chain Logo"
                    />
                  </div>
                  <span className="text-white font-medium text-sm">USDC</span>
                </div>
                <div className="w-2.5 h-1.5 flex items-center">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="white"
                      strokeOpacity="0.3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </button>

              {/* Chain Dropdown Menu */}
              {showChainDropdown && (
                <div className="absolute right-0 mt-2 w-[200px] h-[180px] bg-[#121116] rounded-xl shadow-lg z-10 border border-[#1E1D24] overflow-y-auto p-1.5">
                  {chainOptions.map((chain) => {
                    const isSelected = chain.chainId === selectedChainId;
                    return (
                      <button
                        key={chain.symbol}
                        type="button"
                        onClick={() => {
                          setSelectedChainId(chain.chainId);
                          setShowChainDropdown(false);
                        }}
                        className={`flex items-center gap-2 w-[188px] h-9 px-2.5 py-1.5 rounded-lg justify-between transition-colors ${
                          isSelected ? 'bg-[#25232D]' : 'hover:bg-[#1E1D24]'
                        }`}
                        data-testid={`pulse-settings-chain-${chain.symbol.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={getLogoForChainId(chain.chainId)}
                            alt={chain.symbol}
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="text-white font-normal text-base leading-4 tracking-[-0.02em]">
                            {chain.symbol}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="flex ml-auto w-[16px] h-[16px] bg-[#121116] items-center justify-center">
                            <img
                              src={ConfirmedIcon}
                              alt="Selected"
                              className="w-[6px] h-[4px] color-white items-center justify-center"
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Buy Amount Section */}
        <div className="mb-3">
          <div className="flex items-center mb-3 ml-1">
            <span className="text-[13px] font-normal leading-[14px] tracking-[-0.02em] align-middle text-white/50">
              Custom Buy Amount
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: buyAmount1, setter: setBuyAmount1 },
              { value: buyAmount2, setter: setBuyAmount2 },
              { value: buyAmount3, setter: setBuyAmount3 },
              { value: buyAmount4, setter: setBuyAmount4 },
            ].map((item, index) => (
              <div
                key={`buy-${index}`}
                className="flex items-center h-10 bg-[#121116] rounded-lg px-3"
              >
                <span className="text-white/50 text-sm mr-1">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={item.value}
                  onChange={(e) => {
                    const { value } = e.target;
                    // Only allow empty string or valid numbers (including decimals)
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      item.setter(value);
                    }
                  }}
                  onBlur={(e) => {
                    // If empty on blur, set to default
                    if (e.target.value === '') {
                      item.setter(['10', '20', '50', '100'][index]);
                    }
                  }}
                  className="flex-1 bg-transparent text-white !text-[13px] font-medium outline-none w-full"
                  data-testid={`pulse-settings-buy-amount-${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Sell Amount Section */}
        <div className="mb-3">
          <div className="flex items-center mb-3 ml-1">
            <span className="text-[13px] font-normal leading-[14px] tracking-[-0.02em] align-middle text-white/50">
              Custom Sell Amount
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: sellPercent1, setter: setSellPercent1 },
              { value: sellPercent2, setter: setSellPercent2 },
              { value: sellPercent3, setter: setSellPercent3 },
              { value: sellPercent4, setter: setSellPercent4 },
            ].map((item, index) => (
              <div
                key={`sell-${index}`}
                className="flex items-center h-10 bg-[#121116] rounded-lg px-3"
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={item.value}
                  onChange={(e) => {
                    const { value } = e.target;
                    // Only allow empty string or valid numbers (including decimals)
                    // Also check that the value doesn't exceed 100
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      const numValue = parseFloat(value);
                      if (value === '' || numValue <= 100) {
                        item.setter(value);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    // If empty on blur, set to default
                    if (e.target.value === '') {
                      item.setter(['10', '25', '50', '75'][index]);
                    }
                  }}
                  className="flex-1 bg-transparent text-white !text-[13px] font-medium outline-none w-full"
                  data-testid={`pulse-settings-sell-percent-${index + 1}`}
                />
                <span className="text-white/50 text-sm ml-1">%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <div className="w-full rounded-[10px] bg-[#121116] p-[2px_2px_6px_2px]">
          <button
            onClick={handleConfirm}
            type="button"
            className="flex items-center justify-center w-full rounded-[8px] h-[42px] p-[1px_6px_1px_6px] bg-[#8A77FF]"
            data-testid="pulse-settings-confirm-button"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
