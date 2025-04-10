import { useEffect } from 'react';

// api
import { useGetBlockchainsListQuery } from '../../api/token';

// reducer
import { setBlockchainList } from '../../reducer/tokenAtlasSlice';

// hooks
import { useAppDispatch } from '../../hooks/useReducerHooks';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import Body from '../Typography/Body';

type ChainCardProps = {
  chainName: string;
};

const ChainCard = ({ chainName }: ChainCardProps) => {
  const dispatch = useAppDispatch();
  const { data: blockchainListData, isSuccess } = useGetBlockchainsListQuery();

  useEffect(() => {
    if (blockchainListData && isSuccess) {
      dispatch(setBlockchainList(blockchainListData?.result?.data));
    }
    if (!isSuccess) {
      dispatch(setBlockchainList([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchainListData, isSuccess]);

  const blockchain = blockchainListData?.result?.data.find(
    (chain) => chain.name.toLowerCase() === chainName.toLowerCase()
  );

  const explorerLink = blockchain ? blockchain.explorer : undefined;
  const blockchainLogo = blockchain ? blockchain.logo : undefined;

  return (
    <a href={explorerLink} target="_blank" rel="noopener noreferrer">
      <div
        id="token-atlas-chain-card"
        className={`flex rounded-[50px] bg-medium_grey p-1 pr-3 items-center h-8 max-w-[150px] ${
          explorerLink && 'cursor-pointer'
        }`}
      >
        {blockchainLogo ? (
          <img
            src={blockchainLogo}
            alt="chain-logo"
            className="w-[24px] h-[24px] object-fill rounded-full mr-2"
          />
        ) : (
          <div className="w-[24px] h-[24px] object-fill rounded-full mr-2 overflow-hidden">
            <RandomAvatar name={chainName} />
          </div>
        )}
        <Body className="truncate capitalize">{chainName}</Body>
      </div>
    </a>
  );
};

export default ChainCard;
