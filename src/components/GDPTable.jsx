import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const GDPTable = ({ datasets, datasetId }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uniqueCodesOnly, setUniqueCodesOnly] = useState(false);

  // Fetch ALL GDP data from backend
  const { data: allData, isLoading, error } = useQuery({
    queryKey: ['allGdpData'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/gdp_data');
      return response.data.data;
    },
  });

  // Determine latest dataset
  const latestDataset = useMemo(() => {
    if (datasets && datasets.length > 0) {
      return datasets.find(d => d.is_latest) || [...datasets].sort((a, b) => (b.data_year_end || b.dataset_id) - (a.data_year_end || a.dataset_id))[0];
    }
    if (allData && allData.length > 0) {
      const maxYear = Math.max(...allData.map(d => Number(d.year) || 0));
      const rowWithMaxYear = allData.find(d => Number(d.year) === maxYear);
      return { dataset_id: rowWithMaxYear?.dataset_id, var_label: rowWithMaxYear?.var_label || 'Dataset PDB Terkini' };
    }
    return { dataset_id: datasetId || 1, var_label: 'Dataset PDB Terkini' };
  }, [datasets, allData, datasetId]);

  // Determine currently active dataset based on selectedYear
  const activeDataset = useMemo(() => {
    if (!allData || !latestDataset) return latestDataset;
    if (!selectedYear) return latestDataset;

    const matchingRows = allData.filter(item => String(item.year) === String(selectedYear));
    if (matchingRows.length === 0) return latestDataset;

    const matchingDatasetIds = Array.from(new Set(matchingRows.map(r => r.dataset_id))).sort((a, b) => b - a);
    const targetId = matchingDatasetIds[0];

    if (datasets) {
      const found = datasets.find(d => d.dataset_id === targetId);
      if (found) return found;
    }
    const sampleRow = matchingRows.find(r => r.dataset_id === targetId);
    return { dataset_id: targetId, var_label: sampleRow?.var_label || `Dataset ${targetId}` };
  }, [allData, latestDataset, selectedYear, datasets]);

  // Extract unique options dynamically across all datasets
  const { uniqueRegions, uniqueYears } = useMemo(() => {
    if (!allData) return { uniqueRegions: [], uniqueYears: [] };

    const regions = new Set();
    const years = new Set();

    allData.forEach(item => {
      if (item.region_name) regions.add(item.region_name);
      if (item.year !== undefined && item.year !== null) years.add(item.year);
    });

    return {
      uniqueRegions: Array.from(regions).sort(),
      uniqueYears: Array.from(years).sort((a, b) => b - a),
    };
  }, [allData]);

  // Filter data client-side based on user selection and active dataset
  const filteredData = useMemo(() => {
    if (!allData || !activeDataset) return [];

    const datasetRows = allData.filter(item => item.dataset_id === activeDataset.dataset_id);

    const filtered = datasetRows.filter(item => {
      const matchRegion = !selectedRegion || item.region_name === selectedRegion;
      const matchYear = !selectedYear || String(item.year) === String(selectedYear);
      const matchPeriod = !selectedPeriod || (() => {
        const pLabel = (item.period_label || '').toLowerCase();
        if (selectedPeriod === 'Annual') {
          return pLabel.includes('annual') || pLabel.includes('tahun');
        }
        if (selectedPeriod === 'Quarter') {
          return pLabel.includes('qnone') || pLabel.includes('quarter') || pLabel.includes('kuartal') || pLabel.includes('triwulan') || pLabel.includes('-q');
        }
        return item.period_label === selectedPeriod;
      })();
      const matchSearch = !searchQuery || 
        (item.component_name && item.component_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.component_code && String(item.component_code).includes(searchQuery));

      return matchRegion && matchYear && matchPeriod && matchSearch;
    });

    const sorted = filtered.sort((a, b) => {
      const numA = Number(a.component_code);
      const numB = Number(b.component_code);
      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
        return numA - numB;
      }
      const strCompare = String(a.component_code || '').localeCompare(String(b.component_code || ''), undefined, { numeric: true });
      if (strCompare !== 0) return strCompare;
      return (b.year || 0) - (a.year || 0);
    });

    if (!uniqueCodesOnly) return sorted;

    const seenCodes = new Set();
    return sorted.filter(item => {
      if (!item.component_code) return true;
      const key = `${item.component_code}_${item.period_label || ''}`;
      if (seenCodes.has(key)) return false;
      seenCodes.add(key);
      return true;
    });
  }, [allData, activeDataset, selectedRegion, selectedYear, selectedPeriod, searchQuery, uniqueCodesOnly]);

  const handleResetFilters = () => {
    setSelectedRegion('');
    setSelectedYear('');
    setSelectedPeriod('');
    setSearchQuery('');
    setUniqueCodesOnly(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-body-md text-outline font-medium">Memuat data dari database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-error-container text-on-error-container rounded-xl border border-error/20 my-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error text-[32px]">error</span>
          <div>
            <h4 className="font-semibold text-body-lg">Gagal Memuat Data</h4>
            <p className="text-body-sm opacity-90">{error.message || 'Terjadi kesalahan koneksi ke server.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Dataset Banner */}
      <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px]">dataset</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-label-caps text-primary font-bold tracking-wider">SERI DATASET AKTIF</span>
              {!selectedYear ? (
                <span className="bg-primary text-on-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                  Dataset Terbaru (Default)
                </span>
              ) : (
                <span className="bg-secondary text-on-secondary text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                  Filter Tahun: {selectedYear}
                </span>
              )}
            </div>
            <h4 className="text-h4 font-display font-bold text-on-surface mt-0.5 leading-snug">
              {activeDataset?.var_label || 'Dataset PDB Indonesia'}
            </h4>
          </div>
        </div>
        <div className="text-body-sm text-outline max-w-md sm:text-right bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40">
          Gunakan filter <strong className="text-on-surface font-semibold">Tahun</strong> di bawah untuk memilih periode atau otomatis beralih ke seri dataset tahun terdahulu.
        </div>
      </div>

      {/* Dynamic Filters Panel */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <h3 className="font-display text-h3 text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">filter_list</span>
            Penyaringan Data
          </h3>
          {(selectedRegion || selectedYear || selectedPeriod || searchQuery || !uniqueCodesOnly) && (
            <button 
              onClick={handleResetFilters}
              className="text-body-sm font-semibold text-secondary hover:text-secondary-container flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-label-caps text-on-surface-variant">Cari Komponen</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Cari nama/kode..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-secondary transition-all text-body-md"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-label-caps text-on-surface-variant">Wilayah / Provinsi</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-secondary transition-all text-body-md"
            >
              <option value="">Semua Wilayah</option>
              {uniqueRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-label-caps text-on-surface-variant">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-secondary transition-all text-body-md"
            >
              <option value="">Semua Tahun</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Period/Quarter Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-label-caps text-on-surface-variant">Periode (Quarter / Annual)</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-secondary transition-all text-body-md"
            >
              <option value="">Semua Periode</option>
              <option value="Annual">Annual (Tahunan)</option>
              <option value="Quarter">Quarter (Kuartal)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/30">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uniqueCodesOnly}
              onChange={(e) => setUniqueCodesOnly(e.target.checked)}
              className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary accent-secondary cursor-pointer"
            />
            <span className="text-body-sm font-medium text-on-surface">
              Sembunyikan duplikat kode <span className="text-outline font-normal">(tampilkan hanya data terbaru per kode)</span>
            </span>
          </label>
          <div className="text-body-sm text-outline flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">info</span>
            Menampilkan <strong className="text-on-surface font-semibold">{filteredData.length}</strong> dari {allData?.filter(d => d.dataset_id === activeDataset?.dataset_id).length || 0} entri data dalam seri ini.
          </div>
        </div>
      </div>

      {/* GDP Data Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant text-label-caps text-on-surface-variant font-semibold">
                <th className="py-3.5 px-4 w-24">Kode</th>
                <th className="py-3.5 px-4">Komponen GDP</th>
                <th className="py-3.5 px-4 w-40">Wilayah</th>
                <th className="py-3.5 px-4 w-24">Tahun</th>
                <th className="py-3.5 px-4 w-36">Periode</th>
                <th className="py-3.5 px-4 text-right w-36">Nilai Pertumbuhan</th>
                <th className="py-3.5 px-4 w-44">Tipe Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-body-md text-on-surface">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-surface-container-low transition-colors duration-150 odd:bg-surface-container-lowest even:bg-surface-container-low/20">
                    <td className="py-3 px-4 font-mono text-body-sm text-outline">{row.component_code || '-'}</td>
                    <td className="py-3 px-4 font-medium">
                      {/* Decode HTML tags like <b> in component_name safely */}
                      {row.component_name && (row.component_name.includes('<b>') || row.component_name.includes('</b>')) ? (
                        <span dangerouslySetInnerHTML={{ __html: row.component_name }} />
                      ) : (
                        row.component_name || '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">{row.region_name || '-'}</td>
                    <td className="py-3 px-4">{row.year || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-body-sm font-medium bg-primary-fixed text-on-primary-fixed">
                        {row.period_label || '-'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold text-data-num text-[16px] ${Number(row.growth_rate) < 0 ? 'text-error' : 'text-primary'}`}>
                      {row.growth_rate !== null && row.growth_rate !== undefined ? (
                        `${Number(row.growth_rate).toFixed(2)}%`
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-body-sm text-outline italic">
                      {row.growth_type && row.growth_type !== 'None' ? row.growth_type : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-body-md text-outline font-medium bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-[48px] text-outline/50 block mb-2">database_off</span>
                    Tidak ada data yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GDPTable;
