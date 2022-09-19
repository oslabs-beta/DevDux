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
import { connect } from 'react-redux';
// import actions from action creators file
import * as actions from '../actions/actions';
// import child components...
import MarketCreator from '../components/MarketCreator.jsx';
import MarketDisplay from '../components/MarketsDisplay.jsx';

const mapStateToProps = state => ({
  totalMarkets: state.markets.totalMarkets,
  totalCards: state.markets.totalCards,
  marketList: state.markets.marketList
});

const mapDispatchToProps = dispatch => ({
  addMarket: () => dispatch(actions.addMarketActionCreator()),
  addCard: (id) => dispatch(actions.addCardActionCreator(id)),
  deleteCard: (id) => dispatch(actions.deleteCardActionCreator(id))
});

class MarketsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="innerbox">
        {<MarketCreator addMarket={this.props.addMarket}/>}
        {<MarketDisplay 
          marketlist={this.props.marketList} 
          deleteCard={this.props.deleteCard} 
          addCard={this.props.addCard} 
          totalcards={this.props.totalCards}
        />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketsContainer);
