// src/components/ToastNotification.tsx
import React, { useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import { clearToast, selectToastMessage, selectToastType } from '../../reducer/emcdSwapToastSlice';

const ToastNotification = () => {
  const dispatch = useDispatch()

  const message = useSelector(selectToastMessage)
  const type = useSelector(selectToastType)

  useEffect(() => {
    if (message && type) {

      switch (type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'info':
          toast.info(message);
          break;
        case 'warning':
          toast.warning(message);
          break;
        default:
          toast.info(message);
      }
      // Clear the message after it's shown
      dispatch(clearToast())
    }
  }, [message, type, dispatch])

  return <ToastContainer autoClose={1000} stacked limit={3} />
}

export default ToastNotification
