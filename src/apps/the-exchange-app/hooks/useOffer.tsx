import { BridgingProvider, ExchangeOffer } from '@etherspot/prime-sdk/dist/sdk/data';
import { useEtherspotSwaps } from '@etherspot/transaction-kit';
import { parseUnits } from 'ethers/lib/utils';
import { processEth } from '../utils/blockchain';

type SwapOffer = {
    fromAmount: number,
    fromTokenAddress: string,
    fromChainId: number;
    fromTokenDecimals: number;
    toTokenAddress: string,
    toChainId: number,
    toTokenDecimals: number;
    fromAccountAddress?: string
    slippage?: number;
    provider?: BridgingProvider
    
}

const useOffer = (chainId: number) => {
    const { getOffers } = useEtherspotSwaps(chainId);

        const getBestOffer = async ({ fromAmount, fromTokenAddress, fromChainId, fromTokenDecimals, toTokenAddress, toChainId, toTokenDecimals, fromAccountAddress, slippage, provider }: SwapOffer): Promise<ExchangeOffer | undefined> => {
            if (fromChainId !== toChainId) {
                return;
            }

            // TO DO - remove the if statement below when other functions are added to get offers
            if (fromAccountAddress || slippage || provider) {
                return;
            }

            let selectedOffer: ExchangeOffer | undefined = undefined;

            if (fromAmount && fromAmount > 0 && fromTokenAddress && toTokenAddress) {
                try {
                    const allOffersResponse = await getOffers(parseUnits(`${fromAmount}`, fromTokenDecimals), fromTokenAddress, toTokenAddress, toChainId);
                    
                    const allOffers = allOffersResponse?.offers as ExchangeOffer[];
                    
                    const bestOffer = allOffers.reduce((a,b) => {
                        const receiveAmountA = processEth(a.receiveAmount, toTokenDecimals);
                        const receiveAmountB = processEth(b.receiveAmount, toTokenDecimals)
                        return (
                            receiveAmountA > receiveAmountB ? a : b
                        )
                    })

                    selectedOffer = bestOffer;
                } catch (e) {
                    console.error('Sorry, an error occured while trying to fetch the best swap offer. Please try again.', e);
                }
                return selectedOffer;
            }
        }


    return {
        getBestOffer,
    }
    
}

export default useOffer;