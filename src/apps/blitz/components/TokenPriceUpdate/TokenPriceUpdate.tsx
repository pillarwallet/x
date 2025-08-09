import RandomToken from '../../images/randomToken.png';

type TokenPriceUpdateProps = { classname?: string };

const TokenPriceUpdate = ({ classname }: TokenPriceUpdateProps) => {
  const DUMMY_TIME = '3:15pm';
  return (
    <div
      className={`flex w-fit bg-container_grey rounded-2xl desktop:py-4 tablet:py-3 desktop:px-7 tablet:px-[26px] justify-center items-center gap-2 ${classname}`}
    >
      <img
        src={RandomToken}
        alt="token-icon"
        className="desktop:h-8 desktop:w-8 tablet:h-6 tablet:w-6"
      />
      <h2 className="desktop:text-[32px] tablet:text-base">
        Token price at{' '}
        <span className="text-percentage_green">{DUMMY_TIME}</span>
      </h2>
    </div>
  );
};

export default TokenPriceUpdate;
