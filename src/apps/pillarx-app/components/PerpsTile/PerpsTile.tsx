import { useNavigate } from 'react-router-dom';
import TileContainer from '../TileContainer/TileContainer';
import HyperliquidLogo from '../../images/hyperliquid-logo.png';

const PerpsTile = () => {
  const navigate = useNavigate();

  const handleNavigateToPerps = () => {
    navigate('/perps');
  };

  return (
    <TileContainer id="perps-tile">
      <button type="button" onClick={handleNavigateToPerps} className="w-full">
        <div className="flex flex-col rounded-2xl bg-container_grey desktop:min-h-[320px] tablet:min-h-[280px] mobile:min-h-[240px] p-10 mobile:p-4 cursor-pointer relative overflow-hidden">
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header with Icon and CTA Button */}
            <div className="flex items-start justify-between mb-6 mobile:mb-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-[52px] h-[52px] mobile:w-[40px] mobile:h-[40px] bg-lighter_container_grey rounded-xl flex items-center justify-center p-2">
                  {/* Hyperliquid Logo */}
                  <img
                    src={HyperliquidLogo}
                    alt="Hyperliquid"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold desktop:text-2xl tablet:text-xl mobile:text-lg mb-1 text-left">
                    Hyperliquid
                  </h3>
                  <p className="text-white/60 desktop:text-sm tablet:text-sm mobile:text-xs text-left">
                    Perpetual Futures Trading
                  </p>
                </div>
              </div>

              {/* CTA Button - Top Right */}
              <div className="flex-shrink-0 mobile:hidden">
                <span className="inline-flex items-center justify-center gap-2 font-medium bg-purple_medium hover:bg-purple_medium/90 rounded-lg py-2 px-6 text-white desktop:text-base tablet:text-base transition-colors">
                  Start Trading
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center mb-6 mobile:mb-4">
              <h2 className="text-white font-medium desktop:text-[38px] tablet:text-[32px] mobile:text-[22px] desktop:leading-[50px] tablet:leading-[42px] mobile:leading-[30px] mb-3 mobile:mb-2 text-left">
                Trade perpetuals with up to 50x leverage
              </h2>
              <p className="text-white/70 desktop:text-[18px] tablet:text-[16px] mobile:text-sm desktop:leading-[28px] tablet:leading-[24px] mobile:leading-[20px] text-left">
                Access long and short positions on crypto markets with advanced
                trading features
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-6 mobile:mb-4">
              <span className="inline-flex items-center gap-1.5 bg-lighter_container_grey px-3 py-1.5 rounded-md text-white/80 desktop:text-sm tablet:text-sm mobile:text-xs">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="mobile:w-3 mobile:h-3"
                >
                  <path
                    d="M5 7L7 9L12 4"
                    stroke="#00D4FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Up to 50x Leverage
              </span>
              <span className="inline-flex items-center gap-1.5 bg-lighter_container_grey px-3 py-1.5 rounded-md text-white/80 desktop:text-sm tablet:text-sm mobile:text-xs">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="mobile:w-3 mobile:h-3"
                >
                  <path
                    d="M5 7L7 9L12 4"
                    stroke="#00D4FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Long & Short Positions
              </span>
              <span className="inline-flex items-center gap-1.5 bg-lighter_container_grey px-3 py-1.5 rounded-md text-white/80 desktop:text-sm tablet:text-sm mobile:text-xs">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="mobile:w-3 mobile:h-3"
                >
                  <path
                    d="M5 7L7 9L12 4"
                    stroke="#00D4FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Advanced Tools
              </span>
            </div>

            {/* CTA Button - Mobile Only (Bottom) */}
            <div className="desktop:hidden tablet:hidden mobile:flex w-full">
              <span className="flex items-center justify-center gap-2 font-medium bg-purple_medium hover:bg-purple_medium/90 rounded-lg py-2.5 px-5 text-white text-sm transition-colors w-full">
                Start Trading
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-4 h-4"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </button>
    </TileContainer>
  );
};

export default PerpsTile;
