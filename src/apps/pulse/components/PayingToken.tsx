interface Props {
  payingToken: PayingToken
}

export default function PayingToken(props: Props) {
  return (
    <div
      className="flex justify-between"
      style={{marginTop: 10, marginBottom: 10}}
    >
      <div className="flex items-center">
        <img
          className="w-8 h-8 rounded-50"
          src={props.payingToken.logo}
          style={{marginLeft: 10}}
        />
        <div style={{marginLeft: 5}}>
          <div style={{fontSize: 13}}>{props.payingToken.name}</div>
          <div style={{fontSize: 13, color: "grey"}}>{props.payingToken.actualBal} {props.payingToken.symbol}</div>
        </div>
      </div>
      <div className="flex flex-col justify-center" style={{marginRight: 10}}>
        <div className="flex" style={{fontSize: 13, textAlign: "right"}}>{props.payingToken.totalRaw}</div>
        <div className="flex justify-end" style={{fontSize: 12, color: "grey", textAlign: "right"}}>${props.payingToken.totalUsd.toFixed(2)}</div>
      </div>
    </div>
  )
}