import React, { FC, useState, MouseEvent } from 'react'
import { Menu, MenuItem, Button } from '@material-ui/core'
import { Maybe } from '../../types'
import cn from 'classnames'

import './dropdown.sass'

type Props = {
  onClick?: (...args: unknown[]) => void
  items: Array<number | string>
  currentIndex: number
}

const Dropdown: FC<Props> = ({ onClick, items, currentIndex }) => {

  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Maybe<HTMLElement>>(null)

  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(e.currentTarget)
    setIsMenuOpened(true)
  }

  const handleClose = (index): void => {
    setAnchorEl(null)
    setIsMenuOpened(false)
    if (typeof index === 'number') {
      onClick?.(index)
    }
  }

  return (
    <>
      <Button
        className={cn('dropdown-button', { 'dropdown-button_opened': isMenuOpened })}
        disableRipple
        onClick={handleClick}
        aria-haspopup="true">
        {items[currentIndex]}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </Button>
      <Menu
        keepMounted
        elevation={8}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: 'dropdown-menu' }}
        open={isMenuOpened}
        onClose={handleClose}>
        {items.map((value, index) => (
          <MenuItem
            key={index}
            disableRipple
            className="dropdown-menu__item"
            classes={{ selected: 'dropdown-menu__item_selected' }}
            onClick={() => handleClose(index)}
            selected={items[currentIndex] === value}>
            {value}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default Dropdown
