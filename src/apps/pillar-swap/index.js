import './App.css';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GearFill } from 'react-bootstrap-icons';

import MintButton from './components/MintButton';
import ConfigModal from './components/ConfigModal';
import CurrencyField from './components/CurrencyField';

import {
  EtherspotBatches,
  EtherspotBatch,
  EtherspotTransaction,
  EtherspotApprovalTransaction,
  useWalletAddress,
  useEtherspotTransactions,
} from '@etherspot/transaction-kit';

import BeatLoader from 'react-spinners/BeatLoader';
import {
  getPillarXContract,
  getPillarYContract,
  getPrice,
} from './AlphaRouterService';

function App() {
  const { send } = useEtherspotTransactions();
  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState(undefined);

  const [inputAmount, setInputAmount] = useState('1000000');
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  const [pillarXContract, setPillarXContract] = useState(undefined);
  const [pillarYContract, setPillarYContract] = useState(undefined);
  const [pillarXAmount, setPillarXAmount] = useState(undefined);
  const [pillarYAmount, setPillarYAmount] = useState(undefined);

  const goerliAddress = useWalletAddress('etherspot-prime', 11155111);

  useEffect(() => {
    const onLoad = async () => {
      const newPillarXContract = getPillarXContract();
      setPillarXContract(newPillarXContract);

      const newPillarYContract = getPillarYContract();
      setPillarYContract(newPillarYContract);
    };
    onLoad();
  }, []);

  useEffect(() => {
    const getWalletAddress = () => {
      if (!pillarXContract || !goerliAddress) return;

      pillarXContract.balanceOf(goerliAddress).then((res) => {
        setPillarXAmount(Number(ethers.utils.formatEther(res)));
      });
      pillarYContract.balanceOf(goerliAddress).then((res) => {
        setPillarYAmount(Number(ethers.utils.formatEther(res)));
      });
    };

    getWalletAddress();
  }, [pillarXContract, pillarYContract, goerliAddress]);

  const getSwapPrice = (inputAmount1) => {
    setLoading(true);

    const swap = getPrice(
      inputAmount1,
      slippageAmount,
      Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
      goerliAddress
    ).then((data) => {
      setInputAmount(inputAmount1.toString());
      setTransaction(data[0]);
      setOutputAmount(data[1]);
      setRatio(data[2]);
      setLoading(false);
    });

    return swap;
  };

  const pillarSwap = async () => {
    await send(['1']);
  };

  return (
    <div className="App">
      <MintButton></MintButton>
      <div className="appBody">
        <div className="swapContainer">
          <div className="swapHeader">
            <span className="swapText">Swap</span>
            <span className="gearContainer" onClick={() => setShowModal(true)}>
              <GearFill color="black" />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount}
              />
            )}
          </div>

          <div className="swapBody">
            <CurrencyField
              field="input"
              tokenName="PillarX"
              getSwapPrice={getSwapPrice}
              balance={pillarXAmount}
            />
            <CurrencyField
              field="output"
              tokenName="PillarY"
              value={outputAmount}
              balance={pillarYAmount}
              spinner={BeatLoader}
              loading={loading}
            />
          </div>

          <div className="ratioContainer">
            {ratio && <>{`1 PX = ${ratio} PY`}</>}
          </div>
          {!!transaction && (
            <EtherspotBatches id={'1'}>
              <EtherspotBatch chainId={11155111}>
                <EtherspotApprovalTransaction
                  tokenAddress={'0x7010F7Ac55A64Ca6b48CDC7C680b1fb588dF439f'}
                  receiverAddress={'0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E'}
                  value={inputAmount}
                />
                <EtherspotTransaction
                  to={'0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E'}
                  value={'0'}
                  data={transaction.data}
                >
                  <div className="swapButtonContainer">
                    <div onClick={() => pillarSwap()} className="swapButton">
                      Approve PX & Swap
                    </div>
                  </div>
                </EtherspotTransaction>
              </EtherspotBatch>
            </EtherspotBatches>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
