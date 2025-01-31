import RandomToken from '../../images/randomToken.png';

const TokenPriceUpdate = () => {
  const DUMMY_TIME = '3:15pm';
  return (
    <div className="flex w-fit bg-container_grey rounded-2xl py-4 px-7 justify-center items-center gap-2">
      <img src={RandomToken} alt="token-icon" className="h-8 w-8" />
      <h2 className="text-[32px]">
        Token price at{' '}
        <span className="text-percentage_green">{DUMMY_TIME}</span>
      </h2>
    </div>
  );
};

export default TokenPriceUpdate;
