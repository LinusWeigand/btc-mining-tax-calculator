import React from 'react'
import "./Header.css";
import { IconButton } from '@mui/material';
import BitcoinIcon from "../../data/BitcoinIcon";

function Header() {
  return (
    <div className="header">
        <div className="header__left">
                <IconButton>
                  <BitcoinIcon />
                </IconButton>
        </div>
    </div>
  )
}

export default Header