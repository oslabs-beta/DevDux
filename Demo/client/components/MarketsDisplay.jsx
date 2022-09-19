/**
 * ************************************
 *
 * @module  MarketsDisplay
 * @author
 * @date
 * @description presentation component that renders n Market components
 *
 * ************************************
 */

import React from 'react';
import Market from './Market.jsx';


const MarketsDisplay = props => {
  const marketList = [];
  for (let i = 0; i < props.marketlist.length; i++) {
    marketList.push(<Market 
      key={`market ${i}`} 
      market={props.marketlist[i]} 
      addCard={props.addCard} 
      deleteCard={props.deleteCard} 
      totalcards={props.totalcards}
    />);
  }
  return(
    <div className="displayBox">
      <h4>Markets</h4>
      {marketList}
    </div>
  );
};

export default MarketsDisplay;