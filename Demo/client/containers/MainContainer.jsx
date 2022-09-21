/**
 * ************************************
 *
 * @module  MainContainer
 * @author
 * @date
 * @description stateful component that renders TotalsDisplay and MarketsContainer
 *
 * ************************************
 */


import React from 'react';
import { useSelector } from 'react-redux';
import MarketsContainer from './MarketsContainer.jsx';
import TotalsDisplay from '../components/TotalsDisplay.jsx';


const MainContainer = () => {


  const totalCards = useSelector((state) => state.cardReducer.totalCards);
  const totalMarkets = useSelector((state) => state.marketCardReducer.totalMarkets);

  return (
    <div className="container">
      <div className="outerBox">
        <h1 id="header">MegaMarket Loyalty Cards</h1>
        {<TotalsDisplay
          totalCards={totalCards}
          totalMarkets={totalMarkets}
        />}
        {<MarketsContainer />}
      </div>
    </div>
  );
  //}
};


export default MainContainer;