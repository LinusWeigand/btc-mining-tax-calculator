import React from 'react'
import "./Sidebar.css";
import SidebarOption from "../SidebarOption/SidebarOption.js";
import { useNavigate } from "react-router-dom"
import { HiHome } from 'react-icons/hi';
import { MdAccountBalance } from 'react-icons/md';

function Sidebar() {
    let navigate = useNavigate();
  return (
    <div className="sidebar">
      <div>
        <div onClick={() => {navigate("/home")}}>
          <SidebarOption Icon={HiHome} title="Home" />
        </div>
        <div onClick={() => {navigate("/tax")}}>
          <SidebarOption Icon={MdAccountBalance} title="Tax Calculator" />
        </div>
      </div>
   </div>
  )
}

export default Sidebar