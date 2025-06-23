import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import Buy from "./Buy";
import Sell from "./Sell";
import { useWalletAddress } from "@etherspot/transaction-kit";
import { useGetWalletPortfolioQuery } from "../../../services/pillarXApiWalletPortfolio";
import useIntentSdk from "../hooks/useIntentSdk";
import PreviewBuy from "./PreviewBuy";
import { ExpressIntentResponse } from "@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types";

interface Props {
  setSearching: Dispatch<SetStateAction<boolean>>,
  buyToken: SelectedToken | null,
  setBuyToken: Dispatch<SetStateAction<any>>
  sellToken: any,
  setSellToken: Dispatch<SetStateAction<any>>,
  isBuy: boolean,
  setIsBuy: Dispatch<SetStateAction<boolean>>
}

export default function HomeScreen(
  props: Props
) {

  const accountAddress = useWalletAddress();
  const [previewBuy, setPreviewBuy] = useState(false);
  const [payingTokens, setPayingTokens] = useState<PayingToken[]>([]);
  const [expressIntentResponse, setExpressIntentResponse] = useState<ExpressIntentResponse | null>(null);

  const closePreviewBuy = () => {
    setPreviewBuy(false);
  }

  const {
    data: walletPortfolioData,
    isLoading: isWalletPortfolioDataLoading,
    isFetching: isWalletPortfolioDataFetching,
    refetch: refetchWalletPortfolioData,
  } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '' },
    { skip: !accountAddress }
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'black'}}>
      {
        previewBuy ?
        <PreviewBuy
          closePreview={closePreviewBuy}
          buyToken={props.buyToken}
          payingTokens={payingTokens}
          expressIntentResponse={expressIntentResponse}
        /> :
        <>
        <button
          className="flex items-center justify-center"
          style={{border: '2px solid #1E1D24', width: 446, height: 40, backgroundColor: "#121116", borderRadius: 10}}
          onClick={(e) => {props.setSearching(true)}}
        >
          <span style={{marginLeft: 10}}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </span>
          <div className="flex-1 w-fit">Search by token or paste address</div>
        </button>
        <div
          className="flex flex-col"
          style={{
            border: '2px solid #1E1D24',
            width: 446,
            height: 264,
            backgroundColor: "#121116",
            borderRadius: 10,
            marginTop: 40,
          }}
        >
          {/* buy/sell, refresh, settings */}
          <div className="flex">
            <div className="flex" style={{width: 318, height: 40, backgroundColor: 'black', borderRadius: 10, marginTop: 10, marginLeft: 10}}>
              <button
                className="flex-1"
                style={
                  props.isBuy ?
                  {backgroundColor: "#121116", borderRadius: 10, margin: 4}:
                  {backgroundColor: "black", borderRadius: 10, margin: 4, color: "grey"}
                }
                onClick={() => props.setIsBuy(true)}
              >
                <p className="text-center">Buy</p>
              </button>
              <button
                className="flex-1 items-center justify-center"
                style={
                  !props.isBuy ? {backgroundColor: "#121116", borderRadius: 10, margin: 4} :
                  {backgroundColor: "black", borderRadius: 10, margin: 4, color: "grey"}
                }
                onClick={() => props.setIsBuy(false)}
              >
                <p className="text-center">Sell</p>
              </button>
            </div>
            <div className="flex" style={{marginTop: 10}}>
              <button style={{marginLeft: 12, backgroundColor: "black", borderRadius: 10, width: 40, height: 40}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="grey"
                  className="size-5"
                  style={{backgroundColor: "#121116", borderRadius: 10, margin: 2}}
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button style={{marginLeft: 12, backgroundColor: "black", borderRadius: 10, width: 40, height: 40}}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="grey"
                  className="size-5"
                  style={{backgroundColor: "#121116", borderRadius: 10, margin: 2}}
                >
                  <path
                    fillRule="evenodd"
                    d="M6.455 1.45A.5.5 0 0 1 6.952 1h2.096a.5.5 0 0 1 .497.45l.186 1.858a4.996 4.996 0 0 1 1.466.848l1.703-.769a.5.5 0 0 1 .639.206l1.047 1.814a.5.5 0 0 1-.14.656l-1.517 1.09a5.026 5.026 0 0 1 0 1.694l1.516 1.09a.5.5 0 0 1 .141.656l-1.047 1.814a.5.5 0 0 1-.639.206l-1.703-.768c-.433.36-.928.649-1.466.847l-.186 1.858a.5.5 0 0 1-.497.45H6.952a.5.5 0 0 1-.497-.45l-.186-1.858a4.993 4.993 0 0 1-1.466-.848l-1.703.769a.5.5 0 0 1-.639-.206l-1.047-1.814a.5.5 0 0 1 .14-.656l1.517-1.09a5.033 5.033 0 0 1 0-1.694l-1.516-1.09a.5.5 0 0 1-.141-.656L2.46 3.593a.5.5 0 0 1 .639-.206l1.703.769c.433-.36.928-.65 1.466-.848l.186-1.858Zm-.177 7.567-.022-.037a2 2 0 0 1 3.466-1.997l.022.037a2 2 0 0 1-3.466 1.997Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {
            props.isBuy ?
            <Buy
              setSearching={props.setSearching}
              setToken={props.setBuyToken}
              token={props.buyToken}
              walletPortfolioData={walletPortfolioData}
              setPreviewBuy={setPreviewBuy}
              setPayingTokens={setPayingTokens}
              setExpressIntentResponse={setExpressIntentResponse}
            /> :
            <Sell
              setSearching={props.setSearching}
              setToken={props.setSellToken}
              token={props.sellToken}        
            />
          }
        </div>
        </>
      }
    </div>
  )
}