import { ExpressIntentResponse } from "@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types";
import Esc from "./Esc";
import PayingToken  from "./PayingToken";
import Refresh from "./Refresh";
import useIntentSdk from "../hooks/useIntentSdk";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import IntentTracker from "./IntentTracker";
import { getLogoForChainId } from "../../../utils/blockchain";

interface Props {
  closePreview: () => void,
  buyToken?: SelectedToken | null,
  payingTokens: PayingToken[],
  expressIntentResponse: ExpressIntentResponse | null
}

export default function PreviewBuy(props: Props) {
  const totalPay = props.payingTokens.reduce((acc, curr) => acc + curr.totalUsd, 0).toFixed(2);

  const [isLoading, setIsLoading] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  const detailsEntry = (lhs: string, rhs: string, moreInfo = true, tokenName = '') => {
    return (
      <div className="flex justify-between" style={{margin: 10}}>
        <div className="flex" style={{color: "grey", fontSize: 13}}>
          <div>{lhs}</div>
          {
            moreInfo &&
            <div style={{marginTop: 4, marginLeft: 4}}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="12" height="12" rx="6" fill="white" fill-opacity="0.1"/>
                <g opacity="0.5">
                  <path d="M8.08335 4.75002C8.08335 4.19749 7.86386 3.66758 7.47316 3.27688C7.08246 2.88618 6.55255 2.66669 6.00002 2.66669C5.44749 2.66669 4.91758 2.88618 4.52688 3.27688C4.13618 3.66758 3.91669 4.19749 3.91669 4.75002C3.91669 4.86053 3.96059 4.96651 4.03873 5.04465C4.11687 5.12279 4.22285 5.16669 4.33335 5.16669C4.44386 5.16669 4.54984 5.12279 4.62798 5.04465C4.70612 4.96651 4.75002 4.86053 4.75002 4.75002C4.75002 4.50279 4.82333 4.26112 4.96068 4.05556C5.09804 3.85 5.29326 3.68978 5.52167 3.59517C5.75007 3.50056 6.00141 3.47581 6.24388 3.52404C6.48636 3.57227 6.70909 3.69132 6.8839 3.86614C7.05872 4.04095 7.17777 4.26368 7.226 4.50616C7.27423 4.74863 7.24948 4.99997 7.15487 5.22837C7.06026 5.45678 6.90004 5.65201 6.69448 5.78936C6.48892 5.92671 6.24725 6.00002 6.00002 6.00002C5.88951 6.00002 5.78353 6.04392 5.70539 6.12206C5.62725 6.2002 5.58335 6.30618 5.58335 6.41669V7.25002C5.58335 7.36053 5.62725 7.46651 5.70539 7.54465C5.78353 7.62279 5.88951 7.66669 6.00002 7.66669C6.11053 7.66669 6.21651 7.62279 6.29465 7.54465C6.37279 7.46651 6.41669 7.36053 6.41669 7.25002V6.79169C6.88726 6.69563 7.31019 6.43994 7.6139 6.0679C7.91761 5.69585 8.08345 5.23029 8.08335 4.75002Z" fill="white"/>
                  <path d="M6.00016 9.33327C6.23028 9.33327 6.41683 9.14672 6.41683 8.91661C6.41683 8.68649 6.23028 8.49994 6.00016 8.49994C5.77004 8.49994 5.5835 8.68649 5.5835 8.91661C5.5835 9.14672 5.77004 9.33327 6.00016 9.33327Z" fill="white"/>
                </g>
              </svg>
            </div>
          }
        </div>
        <div>
          <div className="flex" style={{fontSize: 13}}>
            <div>{rhs}</div>
            {
              tokenName &&
              <div style={{color: "grey"}}>{tokenName}</div>
            }
          </div>
        </div>
      </div>
    )
  }

  const {intentSdk} = useIntentSdk();

  const shortlistBid = async () => {
    setIsLoading(true);
    try {
      const res = await intentSdk?.shortlistBid(
        props.expressIntentResponse?.intentHash!, props.expressIntentResponse?.bids[0].bidHash!
      );
      setShowTracker(true);
    } catch (error) {
      console.log("shortlisting bid failed:: ", error);
    }
    setIsLoading(false);
  }

  return (
    <div
      className="flex flex-col"
      style={{
        border: '2px solid #1E1D24',
        width: 446,
        backgroundColor: "#121116",
        borderRadius: 10,
      }}
    >
      {
        showTracker ?
        <>
        <IntentTracker
          closePreview={props.closePreview}
          bidHash={props.expressIntentResponse?.bids[0].bidHash!}
          token={props.buyToken!}
          isBuy={true}
          amount={props.buyToken?.usdValue ? (Number(totalPay)/Number(props.buyToken.usdValue)).toFixed(4) : ""}
        />
        </> :
        <>
        <div className="flex justify-between" style={{margin: 10}}>
          <div style={{fontSize: 20}}>Preview</div>
          <div className="flex">
            <Refresh />
            <div style={{marginLeft: 10}}>
              <Esc closePreview={props.closePreview} />
            </div>
          </div>
        </div>

        <div className="flex justify-between" style={{margin: 10, marginBottom: 0, fontSize: 13, color: "grey"}}>
          <div>You’re paying</div>
          <div className="flex">Total: ${totalPay}</div>
        </div>

        <div className="rounded-[10px]" style={{width: 422, minHeight: 50, background: "black", margin: 10}}>
          {props.payingTokens.map((item) => <PayingToken payingToken={item}/>)}
        </div>

        <div className="flex justify-between" style={{margin: 10, marginBottom: 0, fontSize: 13, color: "grey"}}>
          <div>You’re buying</div>
        </div>

        <div>
          <div
            className="flex justify-between"
            style={{width: 422, height: 50, background: "black", borderRadius: 10, margin: 10}}
          >
            <div className="flex items-center">
              <div style={{position: "relative", display: "inline-block" }}>
                <img
                  src={props.buyToken?.logo}
                  alt="Main"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 50,
                    marginLeft: 5,
                    marginRight: 5
                  }}
                />
                <img
                  src={getLogoForChainId(props.buyToken?.chainId!)}
                  style={{position: "absolute",
                    bottom: "-1px",
                    right: "2px",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div style={{marginLeft: 5}}>
                <div className="flex">
                  <div style={{fontSize: 13}}>{props.buyToken?.name}</div>
                  <div style={{color: "grey", marginLeft: 5, fontSize: 13}}>{props.buyToken?.symbol}</div>
                </div>
                <div className="flex">
                  <div style={{fontSize: 13, color: "grey"}}>{props.buyToken?.address?.slice(0,6)}...{props.buyToken?.address.slice(-4)}</div>
                  <button style={{marginLeft: 5}} onClick={() => {navigator.clipboard.writeText(props.buyToken?.address ?? '')}}>
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.5">
                        <path opacity="0.5" d="M4 1.50004C4 0.671611 4.67157 3.76701e-05 5.5 3.76701e-05H8.5C9.32843 3.76701e-05 10 0.671611 10 1.50004V6.50004C10 7.32846 9.32843 8.00004 8.5 8.00004H7V5C7 3.89543 6.10457 3 5 3H4L4 1.50004Z" fill="white"/>
                        <path d="M0 5.5C0 4.67157 0.671573 4 1.5 4H4.5C5.32843 4 6 4.67157 6 5.5V10.5C6 11.3284 5.32843 12 4.5 12H1.5C0.671573 12 0 11.3284 0 10.5V5.5Z" fill="white"/>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center" style={{marginRight: 10}}>
              <div className="flex" style={{fontSize: 13, textAlign: "right"}}>{props.buyToken?.usdValue ? (Number(totalPay)/Number(props.buyToken.usdValue)).toFixed(4) : ""}</div>
              <div className="flex justify-end" style={{fontSize: 12, color: "grey", textAlign: "right"}}>${totalPay}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between" style={{margin: 10, marginBottom: 0, fontSize: 13, color: "grey"}}>
          <div>Details</div>
        </div>

        <div>
          <div style={{width: 422, height: 137, background: "black", borderRadius: 10, margin: 10}}>
            {
              detailsEntry("Rate", `1 USD ≈ ${props.buyToken?.usdValue ? Number(1/Number(props.buyToken.usdValue)).toFixed(3) : 1.000}`, false, props.buyToken?.symbol ?? '')
            }
            {
              detailsEntry("Minimum Receive", totalPay)
            }
            {
              detailsEntry("Price Impact", "0.00%")
            }
            {
              detailsEntry("Max Spillage", "0.0%")
            }
            {
              detailsEntry("Gas Fee", "≈ $0.00")
            }
          </div>
        </div>
        
        <div
          className="flex"
          style={{margin: 10, width: 422, height: 50, borderRadius: 10, backgroundColor: "black"}}
        >
          <button
            className="flex-1 items-center justify-center"
            style={{
              borderRadius: 10,
              backgroundColor: isLoading ? "#121116" : "#8A77FF",
              margin: 2
            }}
            onClick={shortlistBid}
            disabled={isLoading}
          >
            {
              isLoading  ?
              <div className="flex items-center justify-center">
                Waiting for signature...
              </div> :
              <>Confirm</>
            }
          </button>
        </div>
        </>
      }
      
    </div>
  )
}