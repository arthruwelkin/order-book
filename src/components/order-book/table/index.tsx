import React, { CSSProperties, FC, useEffect, useRef } from 'react'
import { NormalizedRow } from '../../../services/order-book'
import formatNumber from '../../../helpers/format-number'
import { Currency, HYPHEN } from '../../../constants'
import cn from 'classnames'

import './table.sass'

const sortByDecimal = (arr, index, isMoreHyphen, isHyphensFromTop) => {
  if (arr[0].price !== HYPHEN) {
    const cols = isMoreHyphen ? 16 : 8
    const res = Object.values(
      arr.reduce((acc, { price, amount, decimals, ...rest }) =>
        ((acc[decimals[index]] = acc[decimals[index]] || {
          price,
          amount: 0,
          decimals, ...rest,
        }).amount += amount, acc), {}),
    )

    const empty = Array(res.length < cols ? cols - res.length : 0).fill({
      price: HYPHEN,
      amount: HYPHEN,
    })

    if (isHyphensFromTop) {
      return [...empty, ...res]
    } else {
      return [...res, ...empty]
    }
  } else return arr
}

const RowBar: FC<{ style: CSSProperties }> = ({ style }) => (
  <div className="order-book-bar" style={style} />
)

type RowProps = Omit<NormalizedRow, 'price' | 'amount'> & {
  price: number | typeof HYPHEN
  amount: number | typeof HYPHEN
  currentDecimal: number
  total: number
}

const Row: FC<RowProps> = ({ price, amount, decimals, currentDecimal, total }) => (
  <div className="order-book-row">
    <div className="order-book-row__cell order-book-row__cell_decimals">
      <span>{price !== HYPHEN ? decimals[currentDecimal] : HYPHEN}</span>
    </div>
    <div className="order-book-row__cell order-book-row__cell_amount">
      <span>{amount !== HYPHEN ? formatNumber(amount) : HYPHEN}</span>
    </div>
    <div className="order-book-row__cell order-book-row__cell_total">
      {price !== HYPHEN && amount !== HYPHEN ? (
        <>
          <RowBar
            style={{ transform: `translateX(${100 - (((parseFloat(decimals[currentDecimal]) * amount) / total) * 100)}%)` }} />
          <span className="order-book-row__text">
            {formatNumber(Math.floor(+decimals[currentDecimal] * amount))}
            </span>
        </>
      ) : (
        <span className="order-book-row__text">{HYPHEN}</span>
      )}
    </div>
  </div>
)

type Props = {
  rows: NormalizedRow[]
  scrollDown?: boolean
  isHeaderDisabled?: boolean
  isFullHeight: boolean
  isHidden?: boolean
  currentDecimal: number
}

const Table: FC<Props> = ({ scrollDown, isHeaderDisabled, isHidden, isFullHeight, rows, currentDecimal }) => {

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (scrollDown) {
      node!.scrollTop = node!.scrollHeight
    } else {
      node!.scrollTop = 0
    }
  }, [isFullHeight, scrollDown, currentDecimal])

  return (
    <div className={cn('order-book-table', {
      'order-book-table_full-height': isFullHeight,
      'order-book-table_hidden': isHidden,
      'order-book-table_asks': scrollDown,
      'order-book-table_bids': !scrollDown,
    })}>
      {!isHeaderDisabled && (
        <div className="order-book-table__header">
          <div className="order-book-table__header-cell">
            Price {Currency.USDT}
          </div>
          <div className="order-book-table__header-cell">
            Amount {Currency.AAVEUP}
          </div>
          <div className="order-book-table__header-cell">
            Total {Currency.USDT}
          </div>
        </div>
      )}
      <div className="order-book-table__list" ref={ref}>
        {sortByDecimal(rows, currentDecimal, isFullHeight, scrollDown).map((row, index) => (
          <Row {...row} key={index} currentDecimal={currentDecimal}
               total={rows.reduce((acc, currValue) => acc + (currValue.price * currValue.amount), 0)} />
        ))}
      </div>
    </div>
  )
}


export default Table
