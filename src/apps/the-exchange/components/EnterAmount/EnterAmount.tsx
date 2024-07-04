import { useContext, useState, useEffect } from 'react';
import _ from 'lodash';
import { useEtherspotPrices, useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';
import { hasThreeZerosAfterDecimal } from '../../utils/converters';
import { processEth } from '../../utils/blockchain';

// hooks
import useOffer from '../../hooks/useOffer';
import useAccountBalances from '../../../../hooks/useAccountBalances';

// context
import { SwapDataContext } from '../../context/SwapDataProvider';

// types
import { CardPosition } from '../../utils/types';

// components
import BodySmall from '../Typography/BodySmall';
import NumberText from '../Typography/NumberText';
import Body from '../Typography/Body';
import { CircularProgress } from '@mui/material';

// images
import SendArrow from '../../images/send-arrow.png';
import ReceiveArrow from '../../images/receive-arrow.png';

type EnterAmountProps = {
    type: CardPosition;
    tokenSymbol?: string;
};

const EnterAmount = ({ type, tokenSymbol }: EnterAmountProps) => {
    const [isHover, setIsHover] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const {
        amountSwap,
        setAmountSwap,
        amountReceive,
        setAmountReceive,
        swapToken,
        receiveToken,
        setBestOffer,
        bestOffer,
    } = useContext(SwapDataContext);
    const [inputValue, setInputValue] = useState<number>(0);
    const { getPrice } = useEtherspotPrices();
    const balances = useAccountBalances();
    const walletAddress = useWalletAddress();
    const { isZeroAddress, addressesEqual } = useEtherspotUtils();
    const { getBestOffer } = useOffer(swapToken?.chainId || 0);
    const [isOfferLoading, setIsOfferLoading] = useState<boolean>(false);
    const [isNoOffer, setIsNoOffer] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Gets the best swap offer
    const getOffer = async () => {
        const params = {
            fromAmount: amountSwap?.tokenAmount || 0,
            fromTokenAddress: swapToken?.address || '',
            fromChainId: swapToken?.chainId || 0,
            fromTokenDecimals: swapToken?.decimals || 0,
            toTokenAddress: receiveToken?.address || '',
            toChainId: receiveToken?.chainId || 0,
            toTokenDecimals: receiveToken?.decimals || 0,
            slippage: 0.05,
        };

        try {
            const offer = await getBestOffer(params);

            if (offer && receiveToken) {
                const usdPrice = await getPrice(receiveToken.address, receiveToken.chainId);
                if (usdPrice) {
                    setAmountReceive({
                        tokenAmount: offer.tokenAmountToReceive,
                        usdAmount: usdPrice.usd * offer.tokenAmountToReceive,
                    });
                } else {
                    setAmountReceive({ tokenAmount: offer.tokenAmountToReceive, usdAmount: 0 });
                }
            } else {
                setIsNoOffer(true);
            }

            return offer;
        } catch (error) {
            console.error('Failed to fetch the best offer');
            return null;
        } finally {
            setIsOfferLoading(false);
        }
    };

    // Debounced getOffer function with 2-second delay
    const debouncedGetOffer = _.debounce(() => {
        getOffer().then((offer) => {
            if (offer) setBestOffer(offer);
        });
    }, 2000);

    // Similar function being used for the SendModal and AccountModal to check tokens balances
    const tokenBalanceLimit = (tokenAmount: number) => {
        if (!swapToken) return;

        const assetBalance =
            swapToken.chainId &&
            balances[swapToken.chainId]?.[walletAddress as string]?.find((balance) => {
                if (!swapToken.address) {
                    setErrorMessage('This token is not being supported by your wallet');
                    return;
                }

                const assetAddress = swapToken.address;
                const isNativeBalance = balance.token === null || isZeroAddress(balance.token);

                return (
                    (isNativeBalance && isZeroAddress(assetAddress)) ||
                    addressesEqual(balance.token, assetAddress)
                );
            });

        const assetBalanceValue = assetBalance ? assetBalance.balance : '0';
        const balance = processEth(assetBalanceValue, swapToken.decimals ?? 18);

        // Check if the value exceeds the max token amount limit
        if (balance && tokenAmount > balance) {
            setErrorMessage(`The max amount limit in your wallet is ${balance.toFixed(4)} ${swapToken?.symbol}`);
        }
    };

    // getOffer will be called every time the swap amount or the swap/receive token is changed
    useEffect(() => {
        setInputValue(amountSwap ? amountSwap.tokenAmount : 0);
        if (amountSwap?.tokenAmount) {
            setIsOfferLoading(true);
            debouncedGetOffer();
            tokenBalanceLimit(amountSwap?.tokenAmount);
        }
        // Clean-up debounce on component unmount
        return () => {
            debouncedGetOffer.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amountSwap, swapToken, receiveToken]);

    // When the token amount value changes, the input value reflects that change
    // the handleTokenAmountChange will make sure that we get a USD price, and will then add it to amountSwap
    const handleTokenAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(Number(value));
        setErrorMessage('');

        // Might need to find a way to debounce the getPrice call too
        if (type === CardPosition.SWAP && swapToken) {
            const usdPrice = await getPrice(swapToken.address, swapToken.chainId);
            if (usdPrice) {
                setAmountSwap({ tokenAmount: Number(value), usdAmount: usdPrice.usd * Number(value) });
            } else {
                setAmountSwap({ tokenAmount: Number(value), usdAmount: 0 });
            }
        }
    };

    // Function to render offer based on loading and offer state
    const renderOffer = () => {
        if (isOfferLoading) {
            return <CircularProgress size={36} sx={{ color: '#343434' }} />;
        } else if (isNoOffer) {
            return <Body>No offer</Body>;
        } else if (bestOffer) {
            return (
                <NumberText className="text-black_grey font-normal text-3xl break-words mobile:max-w-[180px] tablet:max-w-[260px] desktop:max-w-[260px] xs:max-w-[110px]">
                    {hasThreeZerosAfterDecimal(bestOffer?.tokenAmountToReceive)
                        ? bestOffer?.tokenAmountToReceive.toFixed(8)
                        : bestOffer?.tokenAmountToReceive.toFixed(4)}
                </NumberText>
            );
        }
    };

    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="flex flex-col gap-1 group"
        >
            <BodySmall className={`${isHover && !isFocus && 'text-black_grey/[.4]'} font-normal`}>
                {tokenSymbol}
            </BodySmall>
            {type === CardPosition.SWAP ? (
                <>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => handleTokenAmountChange(e)}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        style={{ width: '100%' }}
                        className="text-black_grey font-normal !text-3xl outline-none focus:outline-none focus:ring-0 focus:bg-[#292D32]/[.05] focus:border-b focus:border-b-black_grey group-hover:bg-[#292D32]/[.05] group-hover:border-b group-hover:border-b-black_grey"
                    />
                    {errorMessage && <BodySmall>{errorMessage}</BodySmall>}
                </>
            ) : (
                renderOffer()
            )}
            <div className="flex justify-between">
                <BodySmall className={`${isHover && !isFocus && 'text-black_grey/[.4]'}`}>
                    ${type === CardPosition.SWAP ? amountSwap?.usdAmount.toFixed(2) : amountReceive?.usdAmount.toFixed(2)}
                </BodySmall>
                <img src={type === CardPosition.SWAP ? SendArrow : ReceiveArrow} alt={type === CardPosition.SWAP ? 'Send' : 'Receive'} />
            </div>
        </div>
    );
};

export default EnterAmount;
