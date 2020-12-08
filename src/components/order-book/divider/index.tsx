import React, { FC } from 'react'

import './divider.sass'

const Divider: FC = () => (
  <div className="order-book-divider">
    <div className="order-book-divider__col order-book-divider__col_price">
      <p className="order-book-divider__title">Last price</p>
      <p className="order-book-divider__value">0</p>
    </div>
    <div className="order-book-divider__col order-book-divider__col_currency">
      <p className="order-book-divider__title">USD</p>
      <p className="order-book-divider__value">0</p>
    </div>
    <div className="order-book-divider__col order-book-divider__col_change">
      <p className="order-book-divider__title">Change</p>
      <p className="order-book-divider__value">0</p>
    </div>
  </div>
)

export default Divider