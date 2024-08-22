import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TokenAltasState = {
  isSearchTokenModalOpen: boolean;
  isSelectChainDropdownOpen: boolean;
};

const initialState: TokenAltasState = {
    isSearchTokenModalOpen: false,
    isSelectChainDropdownOpen: false,
};

const tokenAtlasSlice = createSlice({
  name: 'tokenAtlas',
  initialState,
  reducers: {
    setIsSearchTokenModalOpen(state, action: PayloadAction<boolean>) {
      state.isSearchTokenModalOpen = action.payload;
    },
    setIsSelectChainDropdownOpen(state, action: PayloadAction<boolean>) {
      state.isSelectChainDropdownOpen = action.payload;
    },
  },
});

export const {
    setIsSearchTokenModalOpen,
    setIsSelectChainDropdownOpen,
} = tokenAtlasSlice.actions;

export default tokenAtlasSlice;
