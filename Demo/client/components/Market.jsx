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


const Market = props => {
  return ( 
    <div className="marketBox">
      <h3>Market ID:</h3> <p>{props.market['Market Id']}</p>
      <h3>Location:</h3>  <p>{props.market['Location']}</p>
      <h3>Cards:</h3> <p>{props.market['Cards']}</p>
      <h3>% of total:</h3> <p>{Math.floor(props.market['Cards'] / props.totalcards * 100)}</p>
      <button onClick={() => props.addCard(props.market['Market Id'])}>Add Card</button>
      <button onClick={() => props.deleteCard(props.market['Market Id'])}>Delete Card</button>
    </div>
  );
};

export default Market;