/**
 * ************************************
 *
 * @module  Market
 * @author
 * @date
 * @description presentation component that renders a single box for each market
 *
 * ************************************
 */

import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { addCard, deleteCard } from '../slices/cardSlice';
import cardReducer from '../slices/cardSlice';

const Market = props => {

  const cards = useSelector((state) => state.cardReducer.totalCards);
  const dispatch = useDispatch();
  
  console.log('in Market, here is props:', props);
  // console.log('in Market, here is cards:', cards);
  const handleAddCard = e => {
    console.log('in add card button');
    dispatch(addCard(props.market['Market Id']));
  };
  return (
    <div className="marketBox">
      <h3>Market ID:</h3> <p>{props.market['Market Id']}</p>
      <h3>Location:</h3>  <p>{props.market['Location']}</p>
      <h3>Cards:</h3> <p>{props.market['Cards']}</p>
      <h3>% of total:</h3> <p>{props.totalcards !== 0 ? Math.floor(props.market['Cards'] / props.totalcards * 100) : 0}</p>
      <button onClick={handleAddCard}>Add Card</button>
      <button onClick={() => props.deleteCard(props.market['Market Id'])}>Delete Card</button>
    </div>
  );
};

export default Market;

