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

//import { createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
// import { composeWithDevTools } from 'redux-devtools-extension';
import cardReducer from './slices/cardSlice';
// import marketsReducer from './reducers/marketsReducer';
import marketCardReducer from './slices/marketSlice';

console.log(cardReducer);
// we are adding composeWithDevTools here to get easy access to the Redux dev tools
const store = configureStore({
  // cardReducer,
  // reducer: {reducers}
  reducer: { 
    // marketsReducer, 
    cardReducer, 
    marketCardReducer,
  },
  // totalCards: cardReducer,
  // composeWithDevTools()
  // }
});
console.log(store.getState());
export default store;
