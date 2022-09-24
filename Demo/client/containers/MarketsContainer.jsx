/**
 * ************************************
 *
 * @module  MarketsContainer
 * @author
 * @date
 * @description stateful component that renders MarketCreator and MarketsDisplay
 *
 * ************************************
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MarketCreator from '../components/MarketCreator.jsx';
import MarketDisplay from '../components/MarketsDisplay.jsx';
import { addCard, deleteCard } from '../slices/cardSlice.js';
import { addMarketCard, deleteMarketCard, addMarket } from '../slices/marketSlice.js';


const MarketsContainer = () => {

  const totalCards = useSelector((state) => state.cardReducer.totalCards);
  const marketList = useSelector((state) => state.marketCardReducer.marketList);

  const dispatch = useDispatch();
  const handleAddCard = (e, marketId) => {
    dispatch(addCard(marketId));
    dispatch(addMarketCard(marketId));
  };
  const handleDeleteCard = (e, marketId) => {
    dispatch(deleteCard(marketId));
    dispatch(deleteMarketCard(marketId));
  };
  const handleAddMarket = () => {
    dispatch(addMarket());
  };
  // render() {
  return (
    <div className="innerbox">
      {<MarketCreator addMarket={handleAddMarket} />}
      {<MarketDisplay
        marketlist={marketList}
        deleteCard={handleDeleteCard}
        addCard={handleAddCard}
        totalcards={totalCards}
      />}
    </div>
  );
};


export default MarketsContainer;

