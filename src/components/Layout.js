import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div>
          <span className="logo">Stats Checker</span>
        </div>
        <div className="nav-desktop">
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              Beranda
            </NavLink>
            <a href="#" className="nav-link">Data Lokal</a>
            <a href="#" className="nav-link">Metodologi</a>
          </nav>
          <div className="icon-group">
            <button className="icon-btn material-symbols-outlined">notifications</button>
            <button className="icon-btn material-symbols-outlined">help</button>
            <button className="icon-btn material-symbols-outlined">account_circle</button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="icon-box">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <div>
              <p className="title-small">Portal Data</p>
              <p className="subtitle"> </p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/economic" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <span className="material-symbols-outlined">monitoring</span>
            <span>Economic Indicators</span>
          </NavLink>
          <NavLink to="/social" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <span className="material-symbols-outlined">query_stats</span>
            <span>Social Statistics</span>
          </NavLink>
          <NavLink to="/census" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <span className="material-symbols-outlined">groups</span>
            <span>Census</span>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <span className="material-symbols-outlined">info</span>
            <span>About</span>
          </NavLink>
        </nav>
        <div className="status-widget">
          <div className="status-header">
            <span className="status-label">STATUS SISTEM</span>
            <span className="status-dot"></span>
          </div>
          <p className="status-text">Data Terverifikasi</p>
          <p className="status-update">Update: 24 Okt 2023</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Beranda</span>
        </NavLink>
        <NavLink to="/economic" className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}>
          <span className="material-symbols-outlined">monitoring</span>
          <span>Indikator</span>
        </NavLink>
        <NavLink to="/social" className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}>
          <span className="material-symbols-outlined">query_stats</span>
          <span>Sosial</span>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `bottom-link ${isActive ? 'bottom-link-active' : ''}`}>
          <span className="material-symbols-outlined">info</span>
          <span>Tentang</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
