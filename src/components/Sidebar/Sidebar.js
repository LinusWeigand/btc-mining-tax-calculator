import React from 'react'
import "./Sidebar.css";
import SidebarOption from "../SidebarOption/SidebarOption.js";
import { useNavigate } from "react-router-dom"
import EthereumIcon from "../../data/EthereumIcon";
import BitcoinIcon from "../../data/BitcoinIcon";

function Sidebar() {
    let navigate = useNavigate();
  return (
    <div className="sidebar">

        <div>
            <div onClick={() => {navigate("/bitcoin")}}>
                <SidebarOption Icon={BitcoinIcon} title="Bitcoin"/>
            </div>
        </div>
   </div>
  )
}

export default Sidebar