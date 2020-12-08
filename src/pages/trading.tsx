import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Currency, MARKET } from '../constants'

import useOrderBookService from '../services/order-book'
import OrderBook from '../components/order-book'

import isNil from 'ramda/src/isNil'

import '../styles/pages/trading.sass'

const TradingPage: FC = () => {
  const getAccessToken = () => localStorage.getItem('accessToken')

  const { asks, bids, isServiceClosed } = useOrderBookService(getAccessToken())

  if (isNil(getAccessToken()) || isServiceClosed) return (
    <div className="trading-layout trading-layout_invalid-token">
      <h1>Invalid accessToken...</h1>
      <Link to='/start-page'>Try again</Link>
    </div>
  )

  return (
    <div className="trading-layout">
      <div className="page-header">
        <div className="page-header-part">
          <img src={`${process.env.PUBLIC_URL}/images/binance-logo.png`} alt="Binance logo"
               className="page-header__logo" />
          <h1 className="page-header__market">{MARKET}</h1>
        </div>
        <div className="page-header-part">
          <span className="page-header__pair">
            {Currency.AAVEUP}/{Currency.USDT}
          </span>
        </div>
      </div>
      <div className="page-content">
        <OrderBook asks={asks} bids={bids} />
      </div>
    </div>
  )
}

export default TradingPage