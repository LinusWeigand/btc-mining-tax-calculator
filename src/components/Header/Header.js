import React, { useEffect } from 'react'
import "./Header.css";
import { IconButton } from '@mui/material';
import BitcoinIcon from "../../data/BitcoinIcon";

import { useStateContext } from '../../contexts/ContextProvider';

function Header() {

  const { user, setUser } = useStateContext();

  const onLogin = () => {
    window.location.href = '/login';
  }

  const onLogout = () => {
    window.location.href = '/logout';
  }

  const loadUserInfo = async () => {
    const response = await fetch('/userinfo');
    const data = await response.json();
    return data;
  }

  useEffect(() => { 
    console.log("Header.js useEffect");
    loadUserInfo().then(data => {
      console.log("loadUserInfo: ", data);
      setUser(data);
    });
  }, []);

  return (
    <div className="header">
          <div className="header__left">
                <IconButton>
                  <BitcoinIcon />
                </IconButton>
      </div>
      <div className='header__middle'>
        <button onClick={onLogin}>Login</button>
        <button onClick={onLogout}>Logout</button>
      </div>
      <div className="header__right">
        <p>Welcome {user ? `There is a user: ${user.name}` : "unknown"} </p>
      </div>
    </div>
  )
}

export default Header