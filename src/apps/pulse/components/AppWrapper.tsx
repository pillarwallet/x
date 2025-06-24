import { SetStateAction, useRef, useState } from "react";
import Search from "./Search";
import HomeScreen from "./HomeScreen";

export default function AppWrapper() {
  const [searching, setSearching] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [buyToken, setBuyToken] = useState<SelectedToken | null>(null);
  const [sellToken, setSellToken] = useState<SelectedToken | null>(null);

  return (
    <>
    {
      searching ?
      <Search setSearching={setSearching} isBuy={isBuy} setBuyToken={setBuyToken} setSellToken={setSellToken}/> :
      <HomeScreen
        setSearching={setSearching}
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        sellToken={sellToken}
        setSellToken={setSellToken}
        isBuy={isBuy}
        setIsBuy={setIsBuy}
      />
    }
    </>
  );
}