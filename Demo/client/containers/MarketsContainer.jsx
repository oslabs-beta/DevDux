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

import React, { Component } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
// import actions from action creators file
import * as actions from '../actions/actions';
// import child components...
import MarketCreator from '../components/MarketCreator.jsx';
import MarketDisplay from '../components/MarketsDisplay.jsx';
import { addCard, deleteCard } from '../slices/cardSlice';
import cardReducer from '../slices/cardSlice';

// const mapStateToProps = state => ({
//   totalMarkets: state.markets.totalMarkets,
//   totalCards: state.markets.totalCards,
//   marketList: state.markets.marketList
// });

// const mapDispatchToProps = dispatch => ({
//   addMarket: () => dispatch(actions.addMarketActionCreator()),
//   addCard: (id) => dispatch(actions.addCardActionCreator(id)),
//   deleteCard: (id) => dispatch(actions.deleteCardActionCreator(id))
// });

const MarketsContainer = () => {
  // class MarketsContainer extends Component {
  // constructor(props) {
  //   super(props);

  const totalCards = useSelector((state) => state.marketsReducer.totalCards);
  const marketList = useSelector((state) => state.marketsReducer.marketList);

  const dispatch = useDispatch();


  // render() {
  return (
    <div className="innerbox">
      {<MarketCreator addMarket={() => dispatch(actions.addMarketActionCreator())} />}
      {<MarketDisplay
        marketlist={marketList}
        deleteCard={(id) => dispatch(actions.deleteCardActionCreator(id))}
        addCard={(id) => dispatch(addCard(id))}
        totalcards={totalCards}
      />}
    </div>
  );
};


// export default connect(mapStateToProps, mapDispatchToProps)(MarketsContainer);
export default MarketsContainer;