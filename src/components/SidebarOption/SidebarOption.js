import React from 'react';
import "./SidebarOption.css";



function SidebarOption( {Icon, title}) {
  
  return (
    <div className={`sidebarOption`}>
        <Icon />
        <h3>{title}</h3>
    </div>
  )
}

export default SidebarOption