import { createSlice } from '@reduxjs/toolkit';

const cardsInitialState = {
  totalCards: 0,

};

const cardSlice = createSlice({
  name: 'totalCards',
  initialState: 0,
  reducers: {
    addCard: (state, action) => {
      console.log(action);
      console.log('in add card');
      for (let i = 0; i < state.marketList.length; i++) {
        if (state.markets.marketList[i]['Market Id'] === action.payload) {
          state.markets.marketList[i]['Cards'] = state.markets.marketList[i]['Cards'] + 1;
        }
      }
      console.log(state.totalCards);
      state.totalCards += 1;

    },
    deleteCard: (state) => {
      state.totalCards -= 1;
    },
  },
});

export const { addCard, deleteCard } = cardSlice.actions;
export default cardSlice.reducer;