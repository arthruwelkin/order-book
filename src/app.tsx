import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import StartPage from './pages/start-page'
import TradingPage from './pages/trading'
import NotFoundPage from './pages/not-found'

const App = () => (
  <Switch>
    <Route path="/start-page" exact>
      <StartPage />
    </Route>
    <Route path="/trading" exact>
      <TradingPage />
    </Route>
    <Redirect from='/' to='/start-page' exact/>
    <Route>
      <NotFoundPage />
    </Route>
  </Switch>
)

export default App