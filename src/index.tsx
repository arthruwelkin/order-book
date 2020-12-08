import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { StylesProvider } from '@material-ui/core/styles'

import { BrowserRouter } from 'react-router-dom'

import './styles/main.sass'

const render = (Component: FC) => {
  return ReactDOM.render(
    <BrowserRouter>
      <StylesProvider injectFirst>
        <Component />
      </StylesProvider>
    </BrowserRouter>,
    document.getElementById('root'),
  )
}

render(App)