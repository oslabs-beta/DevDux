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

//import React from 'react';
import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import MarketsContainer from './MarketsContainer.jsx';
import TotalsDisplay from '../components/TotalsDisplay.jsx';

// const mapStateToProps = state => ({
//   // add pertinent state here
//   totalMarkets: state.markets.totalMarkets,
//   totalCards: state.markets.totalCards
// });
/**

 */
//function MainContainer() {
const MainContainer = () => {
  //
  // constructor(props) {
  //   super(props);
  // }
  //delete render()
  // render() {

  const totalCards = useSelector((state) => state.cardReducer.totalCards);
  const totalMarkets = useSelector((state) => state.marketsReducer.totalMarkets);

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

// export default connect(mapStateToProps, null)(MainContainer);
export default MainContainer;