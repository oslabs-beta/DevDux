/**
 * ************************************
 *
 * @module  store.js
 * @author
 * @date
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

import { configureStore } from '@reduxjs/toolkit';
import cardReducer from './slices/cardSlice.js';
import marketCardReducer from './slices/marketSlice.js';


const store = configureStore({
  reducer: {
    cardReducer,
    marketCardReducer,
  },
});
export default store;
