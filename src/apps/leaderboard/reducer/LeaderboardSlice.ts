/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LeaderboardTabsType = 'all' | 'migration' | 'trading';
export type LeaderboardTimeTabsType = 'all' | 'weekly';

export type LeaderboardState = {
  activeTab: LeaderboardTabsType;
  timeTab: LeaderboardTimeTabsType;
  isUserInMigrationData: boolean;
};

const initialState: LeaderboardState = {
  activeTab: 'all',
  timeTab: 'all',
  isUserInMigrationData: false,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<LeaderboardTabsType>) {
      state.activeTab = action.payload;
    },
    setTimeTab(state, action: PayloadAction<LeaderboardTimeTabsType>) {
      state.timeTab = action.payload;
    },
    setIsUserInMigrationData(state, action: PayloadAction<boolean>) {
      state.isUserInMigrationData = action.payload;
    },
  },
});

export const { setActiveTab, setTimeTab, setIsUserInMigrationData } =
  leaderboardSlice.actions;

export default leaderboardSlice;
