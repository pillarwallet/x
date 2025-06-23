import { useEffect, useState } from "react"
import { Hex } from "viem";
import Esc from "./Esc";
import useIntentSdk from "../hooks/useIntentSdk";


interface Props {
  closePreview: () => void,
  token: SelectedToken,
  bidHash: Hex;
  isBuy: boolean;
  amount: string;
}

const getStatusIndex = (status: "PENDING" | "SHORTLISTING_INITIATED" | "SHORTLISTED" | "EXECUTED") => {
  if(status === "PENDING")
    return 0;
  if(status === "SHORTLISTING_INITIATED")
    return 1;
  if(status === "SHORTLISTED")
    return 2;
  if(status === "EXECUTED")
    return 3;
  return -1;
}

const getCircleCss = (status: "PENDING" | "SHORTLISTING_INITIATED" | "SHORTLISTED" | "EXECUTED", f = true) => {
  const index = getStatusIndex(status);
  if(f) {
    if(index >= 2) {
      return {
        backgroundColor: "#8A77FF",
      }
    }
    return {
      border: "1px solid white"
    }
  }
  if (index >= 3)
    return {
      backgroundColor: "#8A77FF",
    }
  return {
    border: "1px solid white"
  }
}

export default function IntentTracker(props: Props) {
  const {intentSdk} = useIntentSdk();
  const [bid, setBid] = useState<any>(null);

  useEffect(() => {
    let isCancelled = false;

    const poll = async () => {
      if (isCancelled || !intentSdk) return;

      try {
        const res = await intentSdk.searchBidByBidHash(props.bidHash);
        if(res && res.length > 0) {
          setBid(res[0]);
        }
      } catch (err) {
        console.error(err);
      }

      if (!isCancelled) {
        setTimeout(poll, 15000);
      }
    };

    poll(); // Start polling

    return () => {
      isCancelled = true; // Cleanup
    };
  }, [intentSdk]);

  return (
    <>
    <div className="flex justify-between" style={{margin: 10}}>
      <div className="flex" style={{fontSize: 20}}>
        {`${props.isBuy ? "Buy" : "Sell"}`}
        <img src={props.token.logo} style={{borderRadius: 50, height: 32, width: 32, marginLeft: 10}}/>
      </div>
      <div className="flex">
        <div style={{marginLeft: 10}}>
          <Esc closePreview={props.closePreview} />
        </div>
      </div>
    </div>
    <div
      className="flex justify-between"
      style={{width: 422, height: 180, background: "black", borderRadius: 10, margin: 10}}
    >
      {/* Vertical Timeline */}
      <div className="p-8">
        <div className="flex items-start gap-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm`}
              style={{...getCircleCss(bid?.bidStatus), color: "grey"}}
            >
              1
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div>Resource Lock Creation</div>
            <p style={{fontSize: 10}}>state.description</p>
          </div>
        </div>

        <div style={{height: 25, marginLeft: 19, width: 1, backgroundColor: getStatusIndex(bid?.bidStatus) >= 2 ? "#8A77FF" : "white"}}></div>
        <div style={{height: 25, marginLeft: 19, width: 1, backgroundColor: getStatusIndex(bid?.bidStatus) >= 3 ? "#8A77FF" : "white"}}></div>


        <div className="flex items-start gap-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm`}
              style={{...getCircleCss(bid?.bidStatus, false), color: "grey"}}
            >
              2
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div>{props.isBuy ? "Buy" : "Sell"} Complete</div>
            <p style={{fontSize: 10}}>state.description</p>
          </div>
        </div>
      </div>
    </div>
    <div
      className="flex"
      style={{margin: 10, width: 422, height: 50, borderRadius: 10, backgroundColor: "black"}}
    >
      <button
        className="flex-1 items-center justify-center"
        style={{
          margin: 2,
          borderRadius: 10,
          backgroundColor: getStatusIndex(bid?.bidStatus) !== 3 ? "#121116" : "#8A77FF"
        }}
        disabled={getStatusIndex(bid?.bidStatus) !== 3}
      >
        Close
      </button>
    </div>
    </>
  )
}
