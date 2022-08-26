import React from 'react'
import "./Header.css";
import { IconButton } from '@mui/material';
import logo from "../../data/logo.png";

function Header() {
  return (
    <div className="header">
        <div className="header__left">
                <IconButton>
                    <img src={logo} alt="" className="header__logo"></img>
                </IconButton>
        </div>
    </div>
  )
}

export default Header