import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  marketList: [],
  lastMarketId: 1000,
  totalMarkets: 0,
};

const marketSlice = createSlice({
  name: 'marketList',
  initialState,
  reducers: {
    addMarketCard: (state, action) => {
      for (let i = 0; i < state.marketList.length; i++) {
        if (state.marketList[i]['Market Id'] === action.payload) {
          state.marketList[i]['Cards'] = state.marketList[i]['Cards'] + 1;
        }
      }
    },
    deleteMarketCard: (state, action) => {
      //loop through markets array
      for (let i = 0; i < state.marketList.length; i++) {
        if (state.marketList[i]['Market Id'] === action.payload) {
          if (state.marketList[i]['Cards'] > 0)
            state.marketList[i]['Cards'] = state.marketList[i]['Cards'] - 1;
        }
      }

    },
    addMarket: (state, action) => {
      state.lastMarketId = state.lastMarketId + 1;
      state.totalMarkets = state.totalMarkets + 1;

      const newMarket = {
        // what goes in here?
        'Market Id': state.lastMarketId,
        Location: document.querySelector('#input').value,
        Cards: 0,
        // '% of total': 0,
      };
      // newMarket['% of total'] = newMarket.Cards / state.totalCards;

      // push the new market onto a copy of the market list
      // deep copy JSON parse the JSON stringified version of the array
      state.marketList = state.marketList.slice();
      state.marketList.push(newMarket);
    },
  },
});

export const { addMarketCard, deleteMarketCard, addMarket } = marketSlice.actions;
export default marketSlice.reducer;