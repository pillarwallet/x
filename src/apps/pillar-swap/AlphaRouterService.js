import  { AlphaRouter } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import { ethers, BigNumber } from 'ethers'
import PillarXABI from './constants/PillarXABI.json'
import PillarYABI from './constants/PillarYABI.json'

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const RPC = 'https://eth-goerli.g.alchemy.com/v2/dYfnm53DsDD80Wmr3foRg5j8Y09i1XRv'

const chainId = 5

const web3Provider = new ethers.providers.JsonRpcProvider(RPC)
const router = new AlphaRouter({ chainId: chainId, provider: web3Provider})

const name0 = 'PillarX'
const symbol0 = 'PX'
const decimals0 = 18
const address0 = '0x9e6ce019Cd6e02D905Ee454718F3DF149fe4e5F8'

const name1 = 'PillarY'
const symbol1 = 'PY'
const decimals1 = 18
const address1 = '0x5aD9555C092e83C53f9b413F3a4D0A96e40215a9'

const PX = new Token(chainId, address0, decimals0, symbol0, name0)
const PY = new Token(chainId, address1, decimals1, symbol1, name1)

export const getPillarXContract = () => new ethers.Contract(address0, PillarXABI, web3Provider)
export const getPillarYContract = () => new ethers.Contract(address1, PillarYABI, web3Provider)

export const getPrice = async (inputAmount, slippageAmount, deadline, walletAddress) => {
    const percentSlippage = new Percent(slippageAmount, 100)
    const wei = ethers.utils.parseUnits((inputAmount.toString()), 18)
    const currencyAmount = CurrencyAmount.fromRawAmount(PX, wei)

    const route = await router.route(
        currencyAmount,
        PY,
        TradeType.EXACT_INPUT,
        {
            recipient: walletAddress,
            slippageTolerance: percentSlippage,
            deadline: deadline,
        }
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