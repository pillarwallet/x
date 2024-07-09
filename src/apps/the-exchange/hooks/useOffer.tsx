// hooks
import { useEtherspotSwaps } from '@etherspot/transaction-kit';

// types
import { SwapOffer, SwapType } from '../utils/types';
import { ExchangeOffer } from '@etherspot/prime-sdk/dist/sdk/data';
import { Route } from '@lifi/sdk';

// utils
import { parseUnits } from 'ethers/lib/utils';
import { processEth } from '../utils/blockchain';

const useOffer = (chainId: number) => {
    const { getOffers } = useEtherspotSwaps(chainId);

    const getBestOffer = async ({
        fromAmount, 
        fromTokenAddress, 
        fromChainId, 
        fromTokenDecimals, 
        toTokenAddress, 
        toChainId, 
        toTokenDecimals
    }: SwapType): Promise<SwapOffer | undefined> => {
        let selectedOffer: SwapOffer;

        // uses getAdvanceRoutesLifi (Lifi) - different chains, different tokens
        if (fromChainId !== toChainId) {
            try {
                const allOffersResponse = await getOffers(parseUnits(`${fromAmount}`, fromTokenDecimals), fromTokenAddress, toTokenAddress, toChainId);
                const allOffers = allOffersResponse?.offers as Route[];

                if (allOffers.length) {
                    const bestOffer = allOffers.reduce((a, b) => {
                        const receiveAmountA = processEth(a.toAmount, toTokenDecimals);
                        const receiveAmountB = processEth(b.toAmount, toTokenDecimals);
                        return receiveAmountA > receiveAmountB ? a : b;
                    });

                    selectedOffer = {
                        tokenAmountToReceive: processEth(bestOffer.toAmount, toTokenDecimals),
                        offer: bestOffer as Route,
                    };

                    return selectedOffer;
                }
                
            } catch (e) {
                console.error('Sorry, an error occurred while trying to fetch the best swap offer. Please try again.', e);
                return {} as SwapOffer;
            }
        }

        // TO DO - (add slippage) uses getQuotes (Connext) - different chains, same token
        // if ((fromChainId !== toChainId) && swapToken?.name === receiveToken?.name) {
        //     try {
        //         const allOffersResponse = await getQuotes(toTokenAddress, toChainId, fromTokenAddress, parseUnits(`${fromAmount}`, fromTokenDecimals), slippage);
        //     } catch (e) {
        //         console.error('Sorry, an error occurred while trying to fetch the best swap offer. Please try again.', e);
        //     }
        //     return selectedOffer;
        // }

        // uses getExchangeOffers - same chain, different tokens
        if ((fromChainId === toChainId) && fromAmount > 0 && fromTokenAddress && toTokenAddress) {
            try {
                const allOffersResponse = await getOffers(parseUnits(`${fromAmount}`, fromTokenDecimals), fromTokenAddress, toTokenAddress, toChainId);
                const allOffers = allOffersResponse?.offers as ExchangeOffer[];

                if (allOffers.length) {
                    const bestOffer = allOffers.reduce((a, b) => {
                        const receiveAmountA = processEth(a.receiveAmount, toTokenDecimals);
                        const receiveAmountB = processEth(b.receiveAmount, toTokenDecimals);
                        return receiveAmountA > receiveAmountB ? a : b;
                    });

                    selectedOffer = {
                        tokenAmountToReceive: processEth(bestOffer.receiveAmount, toTokenDecimals),
                        offer: bestOffer as ExchangeOffer,
                    };

                    return selectedOffer;
                }
                
            } catch (e) {
                console.error('Sorry, an error occurred while trying to fetch the best swap offer. Please try again.', e);
                return {} as SwapOffer;
            }
        }

        return {} as SwapOffer;
    };

    return {
        getBestOffer,
    };
};

export default useOffer;
