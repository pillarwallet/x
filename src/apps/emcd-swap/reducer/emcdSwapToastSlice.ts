// src/slices/toastSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Типы состояния для уведомлений
export type ToastType = 'success' | 'error' | null

export interface ToastState {
  message: string | null
  type: ToastType
}

const initialState: ToastState = {
  message: null,
  type: null,
}

const emcdSwapToast = createSlice({
  name: 'emcdSwapToast',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: ToastType }>
    ) => {
      state.message = action.payload.message
      state.type = action.payload.type
    },

    clearToast: (state) => {
      state.message = null
      state.type = null
    },
  },
})

export const { showToast, clearToast } = emcdSwapToast.actions

export const selectToastMessage = (state: { emcdSwapToast: ToastState }) =>
  state.emcdSwapToast.message

export const selectToastType = (state: { emcdSwapToast: ToastState }) =>
  state.emcdSwapToast.type

export default emcdSwapToast
