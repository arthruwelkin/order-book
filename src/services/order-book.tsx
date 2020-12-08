import { useEffect, useRef, useState, MutableRefObject } from 'react'
import { MARKET, Currency, DECIMALS } from '../constants'
import { Maybe } from '../types'

import mapObjIndexed from 'ramda/src/mapObjIndexed'

enum Proc {
  ORDER_BOOK = 'ob',
}

type SKey = {
  proc: Proc
  market?: typeof MARKET
  pair?: string
}

type Row = {
  [key: string]: number
}

export type NormalizedRow = {
  price: number,
  amount: number
  decimals: string[]
}

type Message = {
  error: string
  type: string
  skey: SKey
  value: {
    a: Row[]
    b: Row[]
  }
}

type Return = {
  asks: NormalizedRow[]
  bids: NormalizedRow[]
  isServiceClosed: boolean
}

const BITSGAP_API_URL = 'wss://test.bitsgap.com/ws/'

const useOrderBookService = (accessToken: Maybe<string>): Return => {
  const socket: MutableRefObject<Maybe<WebSocket>> = useRef<WebSocket>(null)

  const [asks, setAsks] = useState<NormalizedRow[]>([])
  const [bids, setBids] = useState<NormalizedRow[]>([])

  const [isClosed, setIsClosed] = useState<boolean>(false)

  const pushSubs = (skey: SKey): void => {
    socket.current!.send(JSON.stringify({
      type: 'push_subs',
      subs: 1,
      skey,
    }))
  }

  const handleOpen = (): void => {
    pushSubs({
      proc: Proc.ORDER_BOOK,
      market: MARKET,
      pair: `${Currency.AAVEUP}_${Currency.USDT}`,
    })
  }

  const handleClose = (): void => {
    setIsClosed(true)
    setAsks([])
    setBids([])
  }

  const handleError = (): void => {
    console.log('==ERROR==')
  }

  const normalize = data => {
    return Object.values(
      mapObjIndexed<number, NormalizedRow>((amount, price) => {
        const parsedPrice = parseFloat(price)
        return {
          price: parsedPrice,
          amount,
          decimals: Array(DECIMALS.length).fill(0).map((item, index) => {
            return parsedPrice.toFixed(index + 1)
          }),
        }
      }, data),
    ).sort((a, b) => {
      return b.price - a.price
    })
  }

  const handleMessage = ({ data }): void => {
    const parsedData = JSON.parse(data) as Message
    const { a, b } = parsedData.value

    const asks = normalize(a)
    const bids = normalize(b)

    setAsks(asks)
    setBids(bids)
  }

  useEffect(() => {
    socket.current = new WebSocket(BITSGAP_API_URL + `?jwt=${accessToken}`)
    socket.current.onopen = handleOpen
    socket.current.onclose = handleClose
    socket.current.onmessage = handleMessage
    socket.current.onerror = handleError
  }, [])

  return {
    asks,
    bids,
    isServiceClosed: isClosed,
  }
}

export default useOrderBookService