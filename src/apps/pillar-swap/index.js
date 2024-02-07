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
  useEtherspotTransactions
} from '@etherspot/transaction-kit';

import BeatLoader from 'react-spinners/BeatLoader';
import { getPillarXContract, getPillarYContract, getPrice } from './AlphaRouterService'


function App() {
  const { estimate, send } = useEtherspotTransactions();
  const [signerAddress, setSignerAddress] = useState(undefined)

  const [slippageAmount, setSlippageAmount] = useState(2)
  const [deadlineMinutes, setDeadlineMinutes] = useState(10)
  const [showModal, setShowModal] = useState(undefined)

  const [inputAmount, setInputAmount] = useState('1')
  const [outputAmount, setOutputAmount] = useState(undefined)
  const [transaction, setTransaction] = useState({
    'data': '0x5ae401dc0000000000000000000000000000000000000000000000000000000065c2308100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000009e6ce019cd6e02d905ee454718f3df149fe4e5f80000000000000000000000005ad9555c092e83c53f9b413f3a4d0a96e40215a900000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000087413e4d0098391b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    'to': '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    'value': {
        'type': 'BigNumber',
        'hex': '0x00'
    },
    'gasPrice': {
        'type': 'BigNumber',
        'hex': '0x165a574d'
    },
    'gasLimit': '0x0f4240'
})
  const [loading, setLoading] = useState(undefined)
  const [ratio, setRatio] = useState(undefined)
  const [pillarXContract, setPillarXContract] = useState(undefined)
  const [pillarYContract, setPillarYContract] = useState(undefined)
  const [pillarXAmount, setPillarXAmount] = useState(undefined)
  const [pillarYAmount, setPillarYAmount] = useState(undefined)

  const goerliAddress = useWalletAddress('etherspot-prime', 5);

  useEffect(() => {
    const onLoad = async () => {
      setSignerAddress(goerliAddress)
      const pillarXContract = getPillarXContract()
      setPillarXContract(pillarXContract)

      const pillarYContract = getPillarYContract()
      setPillarYContract(pillarYContract)
    }
    onLoad()
  }, [])

  const getWalletAddress = () => {

    pillarXContract.balanceOf(goerliAddress)
      .then(res => {
        setPillarXAmount( Number(ethers.utils.formatEther(res)) )
      })
    pillarYContract.balanceOf(goerliAddress)
      .then(res => {
        setPillarYAmount( Number(ethers.utils.formatEther(res)) )
      })

      
  }

  if (pillarXContract != undefined && goerliAddress != undefined) {
    getWalletAddress()
  }

  const getSwapPrice = (inputAmount1) => {
    setLoading(true)

    const swap = getPrice(
      inputAmount1,
      slippageAmount,
      Math.floor(Date.now()/1000 + (deadlineMinutes * 60)),
      signerAddress
    ).then(data => {
      setInputAmount(inputAmount1.toString())
      setTransaction(data[0])
      setOutputAmount(data[1])
      setRatio(data[2])
      setLoading(false)
    })

    return(swap)
  }

  const pillarSwap = async () => {
    /* eslint-disable no-console */
    console.log(inputAmount)
    await estimate(['1']);
    await send(['1']);
  }

  return (
    <div className="App">
      
      <MintButton></MintButton>

      <div className="appBody">
        <div className="swapContainer">
          <div className="swapHeader">
            <span className="swapText">Swap</span>
            <span className="gearContainer" onClick={() => setShowModal(true)}>
              <GearFill color="black"/>
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount} />
            )}
          </div>

          <div className="swapBody">
            <CurrencyField
              field="input"
              tokenName="PillarX"
              getSwapPrice={getSwapPrice}
              balance={pillarXAmount} />
            <CurrencyField
              field="output"
              tokenName="PillarY"
              value={outputAmount}
              balance={pillarYAmount}
              spinner={BeatLoader}
              loading={loading} />
          </div>

          <div className="ratioContainer">
            {ratio && (
              <>
                {`1 PX = ${ratio} PY`}
              </>
            )}
          </div>
          <EtherspotBatches id={'1'}>
            <EtherspotBatch chainId={5}>
              {/** TODO fix value input */}
              <EtherspotApprovalTransaction
                tokenAddress={'0x9e6ce019Cd6e02D905Ee454718F3DF149fe4e5F8'}
                receiverAddress={'0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'}
                value={'10'}
              />
              <EtherspotTransaction
                to={'0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'}
                value={'0'}
                data={transaction.data}
              >
                <div className="swapButtonContainer">
                  <div
                    onClick={() => pillarSwap()}
                    className="swapButton"
                  >
                    Approve PX & Swap
                  </div>
                </div>
              </EtherspotTransaction>
            </EtherspotBatch>
          </EtherspotBatches>
        </div>
      </div>

    </div>
  );
}

export default App