-- =============================================
-- Tabel master dataset (shared)
-- =============================================
CREATE TABLE public.dataset (
    dataset_id SERIAL PRIMARY KEY,
    source_code VARCHAR(20) NOT NULL,
    topic VARCHAR(30) NOT NULL,
    subject_code INTEGER,
    subject_label TEXT,
    var_code INTEGER,
    var_label TEXT,
    frequency VARCHAR(20),
    data_year_start INTEGER,
    data_year_end INTEGER,
    data_periods TEXT[],
    last_update TIMESTAMP,
    data_availability VARCHAR(20),
    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT TRUE,
    import_timestamp TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    UNIQUE(source_code, topic, var_code, data_year_start, version)
);

-- =============================================
-- Dimensi waktu & wilayah (shared)
-- =============================================
CREATE TABLE public.dim_time (
    time_id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    quarter INTEGER,
    month INTEGER,
    period_label TEXT UNIQUE NOT NULL,
    is_annual BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.dim_region (
    region_id SERIAL PRIMARY KEY,
    region_code VARCHAR(20) UNIQUE NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    region_level VARCHAR(20) NOT NULL,
    parent_region_code VARCHAR(20)
);

-- =============================================
-- TABEL TOPIK 1: PDB (Flat, berisi komponen + nilai)
-- =============================================
CREATE TABLE public.gdp_data (
    id BIGSERIAL PRIMARY KEY,
    dataset_id INTEGER NOT NULL REFERENCES public.dataset(dataset_id) ON DELETE CASCADE,
    time_id INTEGER NOT NULL REFERENCES public.dim_time(time_id),
    region_id INTEGER NOT NULL REFERENCES public.dim_region(region_id),
    
    -- Komponen (dari vervar) disimpan langsung di sini
    component_code INTEGER,
    component_name TEXT,
    parent_code INTEGER,          -- untuk hierarki (opsional)
    category VARCHAR(30),         -- 'expenditure', 'production'
    
    -- Nilai-nilai numerik
    growth_rate_yoy NUMERIC(12,4),
    growth_rate_qtq NUMERIC(12,4),
    value_constant_price NUMERIC(18,2),
    value_current_price NUMERIC(18,2),
    contribution_percent NUMERIC(8,4)
);

CREATE INDEX idx_gdp_dataset ON public.gdp_data(dataset_id);
CREATE INDEX idx_gdp_time ON public.gdp_data(time_id);
CREATE INDEX idx_gdp_region ON public.gdp_data(region_id);

-- =============================================
-- TABEL TOPIK 2: INFLASI (Flat)
-- =============================================
CREATE TABLE public.inflation_data (
    id BIGSERIAL PRIMARY KEY,
    dataset_id INTEGER NOT NULL REFERENCES public.dataset(dataset_id) ON DELETE CASCADE,
    time_id INTEGER NOT NULL REFERENCES public.dim_time(time_id),
    region_id INTEGER NOT NULL REFERENCES public.dim_region(region_id),
    
    -- Kelompok (dari vervar)
    group_code VARCHAR(10),
    group_name TEXT,
    inflation_type VARCHAR(20),   -- 'headline', 'core', 'volatile', 'administered'
    weight NUMERIC(8,6),          -- bobot IHK
    
    -- Nilai
    price_index NUMERIC(12,4),
    inflation_mom NUMERIC(10,4),
    inflation_yoy NUMERIC(10,4),
    contribution NUMERIC(10,6)
);

CREATE INDEX idx_inflation_dataset ON public.inflation_data(dataset_id);
CREATE INDEX idx_inflation_time ON public.inflation_data(time_id);
CREATE INDEX idx_inflation_region ON public.inflation_data(region_id);

-- =============================================
-- TABEL TOPIK 3: KETENAGAKERJAAN (Flat)
-- =============================================
CREATE TABLE public.employment_data (
    id BIGSERIAL PRIMARY KEY,
    dataset_id INTEGER NOT NULL REFERENCES public.dataset(dataset_id) ON DELETE CASCADE,
    time_id INTEGER NOT NULL REFERENCES public.dim_time(time_id),
    region_id INTEGER NOT NULL REFERENCES public.dim_region(region_id),
    
    -- Indikator (dari vervar)
    indicator_code VARCHAR(30),
    indicator_name TEXT,
    category VARCHAR(30),          -- 'TPT', 'TPAK', 'angkatan kerja'
    demographic VARCHAR(50),       -- 'total', 'male', 'female'
    
    -- Nilai
    value NUMERIC(12,4),
    value_type VARCHAR(20)         -- 'percent', 'thousand_persons'
);

CREATE INDEX idx_employment_dataset ON public.employment_data(dataset_id);
CREATE INDEX idx_employment_time ON public.employment_data(time_id);
CREATE INDEX idx_employment_region ON public.employment_data(region_id);
