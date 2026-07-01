import React from 'react';
import { statsData } from '../data';

const Social = () => {
  return (
    <div className="space-y-md">
      <h1 className="font-display text-display text-primary">Statistik Sosial</h1>
      <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant">
        <p className="text-body-lg">Indeks Pembangunan Manusia (IPM): <strong>{statsData.hdi.value}</strong> ({statsData.hdi.period})</p>
        <p className="text-body-sm text-outline mt-sm">Data kemiskinan, pendidikan, kesehatan, dan ketenagakerjaan tersedia di sini.</p>
      </div>
    </div>
  );
};

export default Social;
