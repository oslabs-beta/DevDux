import { createSlice } from '@reduxjs/toolkit';

const cardsInitialState = {
  totalCards: 0,
};

const cardSlice = createSlice({
  name: 'totalCards',
  cardsInitialState,
  reducers: {
    ADD_CARD(state) {
      state.totalCards++;
    },
    DELETE_CARD(state) {
      state.totalCards--;
    }
  }
});

export const {ADD_CARD, DELETE_CARD} = cardSlice.actions;
export default cardSlice.reducer;