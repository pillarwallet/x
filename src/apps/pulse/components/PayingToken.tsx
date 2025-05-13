export default function PayingToken() {
  return (
    <div
      className="flex justify-between"
      style={{marginTop: 10, marginBottom: 10}}
    >
      <div className="flex items-center">
        <img
          className="w-8 h-8 rounded-50"
          src="https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
          style={{marginLeft: 10}}
        />
        <div style={{marginLeft: 5}}>
          <div style={{fontSize: 13}}>USDC</div>
          <div style={{fontSize: 13, color: "grey"}}>133.04 USDC</div>
        </div>
      </div>
      <div className="flex flex-col justify-center" style={{marginRight: 10}}>
        <div className="flex" style={{fontSize: 13, textAlign: "right"}}>2.557,14</div>
        <div className="flex justify-end" style={{fontSize: 12, color: "grey", textAlign: "right"}}>$5.37</div>
      </div>
    </div>
  )
}