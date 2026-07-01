import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { statsData } from '../data';
import './Economic.css';
import GDPTable from './GDPTable.jsx';
import DataTable from './DataTable.jsx';

const Economic = () => {
  const [activeTab, setActiveTab] = useState('gdp');
  // Fetch GDP datasets
  const { data: datasets } = useQuery({
    queryKey: ['gdpDatasets'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/gdp_datasets');
      return response.data.data;
    },
  });

  return (
    <div className="economic-page space-y-6">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-primary leading-tight">Indikator Ekonomi</h1>
          <p className="text-body-lg text-outline mt-1">
            Data PDB dan indikator pasar tenaga kerja Indonesia untuk analisis berkala.
          </p>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <span className="text-label-caps text-outline">PDB INDONESIA TERKINI</span>
          <div className="text-data-num text-[36px] text-primary mt-1 font-bold">5.17%</div>
          <p className="text-body-sm text-outline mt-1">
            Laju Pertumbuhan PDB (y-on-y) Triwulan IV {statsData.economicGrowth.period}.
          </p>
        </div>
        <div className="border-l border-outline-variant/65 pl-0 md:pl-6 pt-4 md:pt-0">
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Halaman ini memuat visualisasi dan tabel terperinci terkait Produk Domestik Bruto (PDB) Indonesia yang terhubung langsung dengan basis data PostgreSQL resmi.
          </p>
        </div>
      </div>

      {/* Main Tabs (GDP vs Unemployment) */}
      <div className="border-b border-outline-variant/80">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('gdp')}
            className={`pb-4 text-body-lg font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'gdp'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-outline hover:text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined">database</span>
            Produk Domestik Bruto (PDB)
          </button>
          <button
            onClick={() => setActiveTab('unemployment')}
            className={`pb-4 text-body-lg font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'unemployment'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-outline hover:text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined">group</span>
            Tingkat Pengangguran
          </button>
        </nav>
      </div>

      {/* Content Rendering based on Active Tab */}
      {activeTab === 'gdp' ? (
        <div className="space-y-6">
          <GDPTable datasets={datasets} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <h3 className="font-display text-h3 text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">group</span>
              Tingkat Pengangguran Terbuka (TPT)
            </h3>
            <p className="text-body-md text-outline mb-6">
              Data statistik tingkat pengangguran terbuka yang disaring berdasarkan Provinsi dan Periode survei nasional.
            </p>
            <DataTable />
          </div>
        </div>
      )}
    </div>
  );
};

export default Economic;
