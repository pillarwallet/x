type TokensSearchInputProps = {
    className?: string;
    onClick?: () => void;
  };

const TokensSearchInput = ({ className, onClick }: TokensSearchInputProps) => {
    return (
        <input onClick={onClick} className={`w-full h-full p-4 bg-medium_grey rounded text-[17px] mobile:text-[15px] focus:outline-none focus:ring-0 placeholder-white ${className}`} placeholder="Search tokens" />
    );
};

export default TokensSearchInput;
