import { useSelector } from 'react-redux';
import { selectDetailFormDataSwap, selectDetailSwapStatus, selectSwapID } from '../reducer/emcdSwapSlice';

export const useConfirmLogic = () => {
  const detailFormDataSwap = useSelector(selectDetailFormDataSwap)
  const status = useSelector(selectDetailSwapStatus)
  const swapID = useSelector(selectSwapID)

  return {
    detailFormDataSwap,
    swapID,
    status,
  }
}