/**
 * ************************************
 *
 * @module  marketsReducer
 * @author
 * @date
 * @description reducer for market data
 *
 * ************************************
 */

import * as types from '../constants/actionTypes';

const initialState = {
  totalMarkets: 0,
  //totalCards: 0,
  marketList: [],
  lastMarketId: 10000,
  newLocation: '',
};

const marketsReducer = (state = initialState, action) => {
  let marketList;
  let newMarket;
  let lastMarketId;
  let totalMarkets;
  let totalCards;

  switch (action.type) {
    case types.ADD_MARKET:
      // increment lastMarketId and totalMarkets counters
      lastMarketId = state.lastMarketId + 1;
      totalMarkets = state.totalMarkets + 1;

      newMarket = {
        // what goes in here?
        'Market Id': lastMarketId,
        Location: document.querySelector('#input').value,
        Cards: 0,
        // '% of total': 0,
      };
      // newMarket['% of total'] = newMarket.Cards / state.totalCards;

      // push the new market onto a copy of the market list
      // deep copy JSON parse the JSON stringified version of the array
      marketList = state.marketList.slice();
      marketList.push(newMarket);

      // return updated state
      return {
        ...state,
        marketList,
        lastMarketId,
        totalMarkets,
        newLocation: '',
      };

    //case types.SET_NEW_LOCATION:

    // --------------- COME BACK TO ME ----------------------
    case types.ADD_CARD:
      // create new copy of state using slice
      marketList = state.marketList.slice();
      //loop through markets array
      for (let i = 0; i < marketList.length; i++) {
        if (marketList[i]['Market Id'] === action.payload) {
          marketList[i]['Cards'] = marketList[i]['Cards'] + 1;
        }
      }

      totalCards = state.totalCards + 1;

      // returned state

      return {
        ...state,
        marketList,
        totalCards,
      };

    case types.DELETE_CARD:
      marketList = state.marketList.slice();
      //loop through markets array
      for (let i = 0; i < marketList.length; i++) {
        if (marketList[i]['Market Id'] === action.payload) {
          if (marketList[i]['Cards'] > 0)
            marketList[i]['Cards'] = marketList[i]['Cards'] - 1;
        }
      }

      if (state.totalCards > 0) totalCards = state.totalCards - 1;
      else totalCards = 0;

      return {
        ...state,
        marketList,
        totalCards,
      };

    default: {
      return state;
    }
  }
};

//console.log(marketsReducer);
export default marketsReducer;
