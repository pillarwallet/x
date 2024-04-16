import  { AlphaRouter, SwapType } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import { ethers, BigNumber } from 'ethers'
import PillarXABI from './constants/PillarXABI.json'
import PillarYABI from './constants/PillarYABI.json'

const V3_SWAP_ROUTER_ADDRESS = '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';
const RPC = 'https://eth-sepolia.g.alchemy.com/v2/QdA15emJqv1MJIKgWbAni6N7hIIam8ze'

const chainId = 11155111

const web3Provider = new ethers.providers.JsonRpcProvider(RPC)
const router = new AlphaRouter({ chainId: chainId, provider: web3Provider})

const name0 = 'PillarX'
const symbol0 = 'PX'
const decimals0 = 18
const address0 = '0x7010F7Ac55A64Ca6b48CDC7C680b1fb588dF439f'

const name1 = 'PillarY'
const symbol1 = 'PY'
const decimals1 = 18
const address1 = '0xa8cCDb5Cb1BCB7eC9113AFA7740C2AaE3B47ab2b'

const PX = new Token(chainId, address0, decimals0, symbol0, name0)
const PY = new Token(chainId, address1, decimals1, symbol1, name1)

export const getPillarXContract = () => new ethers.Contract(address0, PillarXABI, web3Provider)
export const getPillarYContract = () => new ethers.Contract(address1, PillarYABI, web3Provider)

export const getPrice = async (inputAmount, slippageAmount, deadline, walletAddress) => {

    const wei = ethers.utils.parseUnits((inputAmount.toString()), 18)
    const currencyAmount = CurrencyAmount.fromRawAmount(PX, wei)

    const options = {
        recipient: walletAddress,
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
    }

    const route = await router.route(
        currencyAmount,
        PY,
        TradeType.EXACT_INPUT,
        options
    )

    const transaction = {
        data: route.methodParameters.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(route.methodParameters.value),
        from: walletAddress,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit:  ethers.utils.hexlify(1000000)
    }

    const quoteAmountOut = route.quote.toFixed(6)
    const ratio = (quoteAmountOut / inputAmount).toFixed(3)

    return [
        transaction, quoteAmountOut, ratio
    ]
}