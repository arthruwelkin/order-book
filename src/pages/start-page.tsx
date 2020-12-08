import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import isNil from 'ramda/src/isNil'

import '../styles/pages/start-page.sass'

const StartPage: FC = () => {

  const [accessToken, setAccessToken] = useState<string>('')

  const handleChange = e => {
    setAccessToken(e.target.value)
  }

  const saveAccessToken = () => {
    localStorage.setItem('accessToken', accessToken)
  }

  //Remove accessToken from localStorage if it exists
  useEffect(() => {
    if (!isNil(localStorage.getItem('accessToken'))) {
      localStorage.removeItem('accessToken')
    }
  }, [])

  return (
    <div className="start-page-layout">
      <div className="start-page-layout__introductory-info">
        <ol className="introductory-steps">
          <li>Visit <a href="https://test.bitsgap.com">https://test.bitsgap.com</a></li>
          <li>Open DevTools</li>
          <li>Application Tab</li>
          <li>LocalStorage</li>
          <li>Take an accessToken</li>
        </ol>
      </div>
      <div className="start-page-layout__form">
        <textarea className="access-token-field" placeholder="Insert your accessToken" onChange={handleChange} />
        <Link
          className="enter-link-button"
          to="/trading"
          onClick={saveAccessToken}
          style={accessToken.length === 0 ? { pointerEvents: 'none' } : { pointerEvents: 'initial' }}>
          Enter
        </Link>
      </div>
    </div>
  )
}

export default StartPage