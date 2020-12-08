import React from 'react'
import { Link } from 'react-router-dom'

import "../styles/pages/not-found.sass"

const NotFoundPage = () => (
  <div className='not-found-layout'>
    <h1 className="not-found-layout__title">404 Page Not Found</h1>
    <Link to='start-page' className="not-found-layout__link-button">
      Go to Start Page
    </Link>
  </div>
)

export default NotFoundPage