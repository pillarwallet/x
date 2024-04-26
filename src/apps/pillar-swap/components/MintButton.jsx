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
            <EtherspotBatch chainId={11155111}>
              <EtherspotContractTransaction
                contractAddress={'0x7010F7Ac55A64Ca6b48CDC7C680b1fb588dF439f'}
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
