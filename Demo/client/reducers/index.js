/**
 * ************************************
 *
 * @module  index.js
 * @author
 * @date
 * @description simply a place to combine reducers
 *
 * ************************************
 */

import { combineReducers } from 'redux';
import cardReducer from '../slices/cardSlice';

// import all reducers here
import marketsReducer from './marketsReducer';

// combine reducers
const reducers = combineReducers({
  // if we had other reducers, they would go here
  markets: marketsReducer,
  // cards : cardReducer
});

// make the combined reducers available for import
export default reducers;

