/**
 * ************************************
 *
 * @module  MarketCreator
 * @author
 * @date
 * @description presentation component that takes user input for new market creation
 *
 * ************************************
 */

import React from 'react';


const MarketCreator = props => (
  // how do we create the circuit between the store and an input field?
  <div id='market-creator'>
    <h2>Create New Market</h2>
    <h3>Location:</h3>
    <input id="input" placeholder='Location'></input>  
    <button onClick={props.addMarket}>Add Market</button>
  </div>
  
  // how do we update the store from a presentation component?
    
);

export default MarketCreator;