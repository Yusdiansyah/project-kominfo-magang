import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { statsData, publications, categories } from '../data';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg">
          <img alt="background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpkkKNInW4LVgX7yZcuuu406LQCjlfwjdCa2waftslSf1LqxBiJ0UCLsn9EhDhWFNeELEBsqBLz5aEu4lyrRjA8GXj8T5W74w1x3GJQouoh-JhDcveC9PYvnp1CzimK77HQp8GUvp7ZUqgr9yFjgsIa3kOKhDCq3bsgsHlZaF4Kf-m-q2_CUE2wGI_eGZvZCPDHe97eMQnEyt-NNNV30ml-9-dPluPcUiV8TtnGnjZlInMk-C35TcdcttaVVcd1DDQyiSOASxcRg" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Cari Data Statistik Nasional</h1>
          <p className="hero-desc">Akses basis data resmi Badan Pusat Statistik untuk analisis kebijakan dan riset mendalam.</p>
          <div className="search-container">
            <span className="search-icon material-symbols-outlined">search</span>
            <input type="text" className="search-input" placeholder="Cari indikator, publikasi, atau subjek..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="search-btn" onClick={() => alert(`Mencari: ${searchQuery}`)}>Cari</button>
          </div>
        </div>
      </section>

      {/* Statistik Utama */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Statistik Utama</h2>
          <a href="#" className="section-link">Indikator Lainnya <span className="material-symbols-outlined">chevron_right</span></a>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header"><span className="stat-label">PERTUMBUHAN EKONOMI</span><span className="stat-trend">{statsData.economicGrowth.trend}</span></div>
            <div><span className="stat-value">{statsData.economicGrowth.value}<span style={{fontSize:'16px'}}>%</span></span><p className="stat-period">{statsData.economicGrowth.period}</p></div>
            <div className="chart-bars"><div className="bar" style={{height:'66%'}}></div><div className="bar" style={{height:'50%'}}></div><div className="bar" style={{height:'75%'}}></div><div className="bar" style={{height:'66%'}}></div><div className="bar" style={{height:'100%'}}></div></div>
          </div>
          <div className="stat-card">
            <div className="stat-header"><span className="stat-label">TINGKAT PENGANGGURAN</span><span className="stat-trend" style={{backgroundColor:'#ffdbcb', color:'#a04100'}}>{statsData.unemploymentRate.trend}</span></div>
            <div><span className="stat-value">{statsData.unemploymentRate.value}<span style={{fontSize:'16px'}}>%</span></span><p className="stat-period">{statsData.unemploymentRate.period}</p></div>
            <div className="chart-bars"><div className="bar" style={{height:'100%'}}></div><div className="bar" style={{height:'83%'}}></div><div className="bar" style={{height:'66%'}}></div><div className="bar" style={{height:'75%'}}></div><div className="bar" style={{height:'66%'}}></div></div>
          </div>
          <div className="stat-card">
            <div className="stat-header"><span className="stat-label">INDEKS PEMBANGUNAN MANUSIA</span><span className="stat-trend" style={{backgroundColor:'#d2e4ff', color:'#004173'}}>{statsData.hdi.trend}</span></div>
            <div><span className="stat-value">{statsData.hdi.value}</span><p className="stat-period">{statsData.hdi.period}</p></div>
            <div className="chart-bars"><div className="bar" style={{height:'50%'}}></div><div className="bar" style={{height:'60%'}}></div><div className="bar" style={{height:'66%'}}></div><div className="bar" style={{height:'80%'}}></div><div className="bar" style={{height:'100%'}}></div></div>
          </div>
        </div>
      </div>

      {/* Kategori Data & Publikasi */}
      <div className="two-col">
        <div>
          <h2 className="section-title" style={{marginBottom:'16px'}}>Kategori Data Utama</h2>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card" onClick={() => cat.link !== '#' && navigate(cat.link)}>
                <div><div className="category-name">{cat.name}</div><div className="category-desc">{cat.desc}</div></div>
                <span className="category-icon material-symbols-outlined">{cat.icon}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="section-title" style={{marginBottom:'16px'}}>Publikasi Terbaru</h2>
          <div className="pub-list">
            {publications.map((pub, idx) => (
              <div key={idx} className="pub-item">
                <div className="pub-flex">
                  <div className="pub-icon"><span className="material-symbols-outlined">picture_as_pdf</span></div>
                  <div><div className="pub-title">{pub.title}</div><div className="pub-meta">Rilis: {pub.date} • {pub.size}</div></div>
                </div>
              </div>
            ))}
            <div className="view-all"><button className="view-all-btn">LIHAT SEMUA PUBLIKASI</button></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2023 Badan Pusat Statistik - Republik Indonesia. Seluruh hak cipta dilindungi.</p>
        <div className="footer-links">
          <a href="#" className="footer-link">Kebijakan Privasi</a>
          <a href="#" className="footer-link">Syarat Penggunaan</a>
          <a href="#" className="footer-link">API Documentation</a>
        </div>
      </footer>
    </>
  );
};
export default Dashboard;
