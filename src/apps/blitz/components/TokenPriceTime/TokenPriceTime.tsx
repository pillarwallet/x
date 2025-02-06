import TokenPotIcon from '../../images/token_pot_icon.svg';
import TimeClock from '../TimeClock/TimeClock';
import TokenPriceUpdate from '../TokenPriceUpdate/TokenPriceUpdate';
import Body from '../Typography/Body';

const TokenPriceTime = () => {
  const DUMMY_TOKEN_PRICE = '120,582.08';
  const DUMMY_TOKEN_AMOUNT = 3515;
  const DUMMY_TOKEN_SYMBOL = 'RBTC';
  const DUMMY_TOKEN_WON_CLAIMABLE = 562;

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col relative w-full items-center mb-10">
        <TokenPriceUpdate classname="absolute top-0 -translate-y-1/2" />
        <div className="w-full px-[44px] pt-[55px] pb-[88px] rounded-[20px] bg-gradient-to-t from-[#27262F4D] via-[#27262F] to-[#27262F4D]">
          <h1 className="text-[80px] font-light text-center">
            ${DUMMY_TOKEN_PRICE}
          </h1>
        </div>
        <TimeClock classname="absolute bottom-0 translate-y-1/4" />
      </div>
      <div className="flex w-fit bg-container_grey rounded-[10px] px-6 py-3.5 gap-2.5 mb-2">
        <img src={TokenPotIcon} alt="token-pot-icon" className="w-5 h-5" />
        <Body className="font-normal">
          {DUMMY_TOKEN_AMOUNT} {DUMMY_TOKEN_SYMBOL} in the Pot!
        </Body>
      </div>
      <Body className="font-normal">
        {DUMMY_TOKEN_WON_CLAIMABLE} {DUMMY_TOKEN_SYMBOL} Won{' '}
        <span className="text-percentage_green underline">Claim Now!</span>
      </Body>
    </div>
  );
};

export default TokenPriceTime;
