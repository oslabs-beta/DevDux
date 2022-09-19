/**
 * ************************************
 *
 * @module  actions.js
 * @author
 * @date
 * @description Action Creators
 *
 * ************************************
 */

// import actionType constants
import * as types from '../constants/actionTypes';

export const addCardActionCreator = marketId => ({
  type: types.ADD_CARD,
  payload: marketId,
});

export const addMarketActionCreator = () => ({
  type: types.ADD_MARKET
});

export const deleteCardActionCreator = marketId => ({
  type: types.DELETE_CARD,
  payload: marketId,
});

// add more action creators