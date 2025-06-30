import { Dispatch, SetStateAction } from "react";

interface Props {
  setSearching: Dispatch<SetStateAction<boolean>>,
  token: any
  setToken: Dispatch<SetStateAction<any>>
}

export default function Sell(props: Props) {
  return (
    <>
      <div
      className="flex"
      style={{margin: 10, backgroundColor: "black", width: 422, height: 100, borderRadius: 10}}
      >
      </div>
  
      {/* amounts */}
      <div className="flex">
        {["$10", "$20", "$50", "$100", "MAX"].map(item => {
          return (
            <div className="flex" style={{backgroundColor: "black", marginLeft: 10, width: 75, height: 30, borderRadius: 10}}>
              <button className="flex-1 items-center justify-center" style={{backgroundColor: "#121116", borderRadius: 10, margin: 2, color: "grey"}}>
                {item}
              </button>
            </div>
          )
        })}
      </div>

      {/* buy/sell button */}
      <div
        className="flex bg-deep_purple-A700"
        style={{margin: 10, width: 422, height: 50, borderRadius: 10}}
      >
        <button className="flex-1 items-center justify-center">
          Sell
        </button>
      </div>
    </>
  );
}