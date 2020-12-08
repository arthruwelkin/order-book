import React, { FC, useState } from 'react'
import Dropdown from '../dropdown'

import Table from './table'
import Divider from './divider'

import mapObjIndexed from 'ramda/src/mapObjIndexed'

import './order-book.sass'
import { DECIMALS, HYPHEN } from '../../constants'
import { NormalizedRow } from '../../services/order-book'

const genEmptyRows = () => Array(50).fill({ price: HYPHEN, amount: HYPHEN })

const controlAssets = {
  ask_view: {
    default: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMjFIMjRWMjRIMHpNMCAxNUgyNFYxOEgweiIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMiAwTDI0IDEwLjUgMCAxMC41eiIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCAxMC41KSIvPgogICAgPC9nPgo8L3N2Zz4K',
    active: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTAgMjFIMjRWMjRIMHpNMCAxNUgyNFYxOEgweiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGRjQxMTQiIGQ9Ik0xMiAwTDI0IDEwLjUgMCAxMC41eiIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCAxMC41KSIvPgogICAgPC9nPgo8L3N2Zz4K',
  },
  mixed_view: {
    default: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTEyIDBMMjQgMTAuNSAwIDEwLjV6IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDI0KSBtYXRyaXgoMSAwIDAgLTEgMCAxMC41KSIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMiAxMy41TDI0IDI0IDAgMjR6IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDI0KSIvPgogICAgPC9nPgo8L3N2Zz4K',
    active: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iIzAwQ0Y1QyIgZD0iTTEyIDBMMjQgMTAuNSAwIDEwLjV6IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDI0KSBtYXRyaXgoMSAwIDAgLTEgMCAxMC41KSIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNGRjQxMTQiIGQ9Ik0xMiAxMy41TDI0IDI0IDAgMjR6IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDI0KSIvPgogICAgPC9nPgo8L3N2Zz4K',
  },
  bid_view: {
    default: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgNkgyNFY5SDB6TTAgMEgyNFYzSDB6TTEyIDEzLjVMMjMuNDI5IDIzLjUuNTcxIDIzLjV6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=',
    active: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTAgNkgyNFY5SDB6TTAgMEgyNFYzSDB6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzAwQ0Y1QyIgZD0iTTEyIDEzLjVMMjQgMjQgMCAyNHoiLz4KICAgIDwvZz4KPC9zdmc+Cg==',
  },
}

enum View {
  ask_view = 'ask_view',
  mixed_view = 'mixed_view',
  bid_view = 'bid_view'
}

type Props = {
  asks: NormalizedRow[]
  bids: NormalizedRow[]
}

const OrderBook: FC<Props> = ({ asks, bids }) => {

  const [view, setView] = useState<View>(View.mixed_view)
  const [currentDecimal, setCurrentDecimal] = useState<number>(DECIMALS.length - 1)

  const handleDropdownClick = (index): void => {
    setCurrentDecimal(index)
  }

  return (
    <div className="order-book">
      <div className="order-book__header">
        <span className="order-book__title">Order book</span>
        <div className="order-book__header-controls">
          <Dropdown items={DECIMALS} onClick={handleDropdownClick} currentIndex={currentDecimal} />
          <div className="order-book__view-buttons">
            {Object.values(
              mapObjIndexed((state, key) => {
                return (
                  <button type="button" className="order-book__view-button" onClick={() => setView(View[key])}
                          key={key}>
                    <img src={view === key ? state.active : state.default} alt={key}
                         className="order-book__view-icon" />
                  </button>
                )
              }, controlAssets),
            )}
          </div>
        </div>
      </div>
      <div className="order-book__content">
        <Table
          rows={asks.length !== 0 ? asks : genEmptyRows()}
          scrollDown
          isHidden={view === View.bid_view}
          isFullHeight={view === View.ask_view}
          currentDecimal={currentDecimal} />
        <Divider />
        <Table
          rows={bids.length !== 0 ? bids : genEmptyRows()}
          isHeaderDisabled={view !== View.bid_view}
          isHidden={view === View.ask_view}
          isFullHeight={view === View.bid_view}
          currentDecimal={currentDecimal} />
      </div>
    </div>
  )
}

export default OrderBook