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

const Market = props => {
  const { addCard, deleteCard } = props;
  // const cards = useSelector((state) => state.cardReducer.totalCards);
  // const dispatch = useDispatch();
  console.log(addCard);
  console.log(props.totalcards);
  console.log('in Market, here is props:', props);
  // console.log('in Market, here is cards:', cards);

  return (
    <div className="marketBox">
      <h3>Market ID:</h3> <p>{props.market['Market Id']}</p>
      <h3>Location:</h3>  <p>{props.market['Location']}</p>
      <h3>Cards:</h3> <p>{props.market['Cards']}</p>
      <h3>% of total:</h3> <p>{props.totalcards !== 0 ? Math.floor(props.market['Cards'] / props.totalcards * 100) : 0}</p>
      <button onClick={(e) => addCard(e, props.market['Market Id'])}>Add Card</button>
      <button onClick={(e) => deleteCard(e, props.market['Market Id'])}>Delete Card</button>
    </div>
  );
};

export default Market;

