import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo"> BPS Portal</h2>
      <nav>
        <ul>
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/economic">Economic Indicators</NavLink></li>
          <li><NavLink to="/social">Social Statistics</NavLink></li>
          <li><NavLink to="/census">Census</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
