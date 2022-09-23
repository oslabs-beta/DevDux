/**
 *
 * @module cardSlice
 *
 *
 */
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  totalCards: 0,
};

const cardSlice = createSlice({
  name: 'totalCards',
  initialState,
  reducers: {
    addCard: (state, action) => {
      console.log(action);
      console.log('in add card');
      console.log(state);
      // const reduxStore = store.getState();
      // const marketList = reduxStore.marketsReducer.marketList;
      // console.log(marketList);
      // for (let i = 0; i < state.marketList.length; i++) {
      //   if (state.markets.marketList[i]['Market Id'] === action.payload) {
      //     state.markets.marketList[i]['Cards'] = state.markets.marketList[i]['Cards'] + 1;
      //   }
      // }
      // console.log(state.totalCards);
      state.totalCards += 1;
    },
    deleteCard: (state) => {
      if (state.totalCards > 0) state.totalCards -= 1;
      else state.totalCards = 0;
    },
  },
});

console.log(cardSlice);
export const { addCard, deleteCard } = cardSlice.actions;
export default cardSlice.reducer;
