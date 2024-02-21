import {
    EtherspotBatches,
    EtherspotBatch,
    EtherspotContractTransaction,
    useEtherspotTransactions
  } from '@etherspot/transaction-kit';

import { utils } from 'ethers';

/* eslint-disable react/prop-types */
const MintButton = () => {
    const { estimate, send } = useEtherspotTransactions();


    const mintTokens = async () => {
        await estimate(['2']);
        await send(['2']);
      }

    return (
    <div className="my-2 buttonContainerTop">
        <EtherspotBatches id="2">
            <EtherspotBatch chainId={5}>
              <EtherspotContractTransaction
                contractAddress={'0x9e6ce019Cd6e02D905Ee454718F3DF149fe4e5F8'}
                abi={['function mint(uint)']}
                methodName={'mint'}
                params={[utils.parseEther('100')]}
              >
                <div className="buttonContainer">
                  <div
                    onClick={() => mintTokens()}
                    className='mintButton'
                  >
                  Mint 100 PillarX Tokens
                </div>
              </div>
                </EtherspotContractTransaction>
          </EtherspotBatch>
      </EtherspotBatches>
    </div>
    )
};

export default MintButton
