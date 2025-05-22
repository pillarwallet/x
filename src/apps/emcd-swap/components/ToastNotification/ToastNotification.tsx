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
      if (type === 'success') {
        toast.success(message)
      } else if (type === 'error') {
        toast.error(message)
      }

      // Очистить сообщение после того, как оно будет показано
      dispatch(clearToast())
    }
  }, [message, type, dispatch])

  return <ToastContainer autoClose={1000} stacked limit={3} />
}

export default ToastNotification
