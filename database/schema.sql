-- ===========================================================================
-- SAVEPLATE & DECISION SUPPORT CENTER - UNIFIED DATABASE SCHEMA
-- Target Database: PostgreSQL (Supabase Compatible)
-- Author: Data Engineering & Analytics Team
-- Date: 2026-06-02
-- ===========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================================================
-- CORE RELATION TABLES (SavePlate Platform & Auth)
-- ===========================================================================

-- A. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('consumer', 'restaurant', 'admin')),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B. RESTAURANTS / COMMERCES TABLE
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    cuisine_type VARCHAR(100),
    avg_waste_kg DOUBLE PRECISION DEFAULT 0.0 CHECK (avg_waste_kg >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- C. FOOD SURPLUS OFFERS TABLE
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price >= 0),
    current_price NUMERIC(10, 2) NOT NULL CHECK (current_price >= 0),
    quantity_total INTEGER NOT NULL CHECK (quantity_total > 0),
    quantity_remaining INTEGER NOT NULL CHECK (quantity_remaining >= 0),
    photo_url VARCHAR(2048),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'reserved', 'expired', 'saved')) DEFAULT 'active',
    category VARCHAR(50) NOT NULL CHECK (category IN ('Prepared Meals', 'Bakery & Bread', 'Produce', 'Dairy & Eggs', 'Meat & Fish')),
    CONSTRAINT chk_prices CHECK (current_price <= original_price),
    CONSTRAINT chk_quantity CHECK (quantity_remaining <= quantity_total)
);

-- D. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    consumer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- ===========================================================================
-- ANALYTICAL & METRIC TABLES (Fusion Additions)
-- ===========================================================================

-- E. BENEFICIARY PROFILES TABLE (Social Category tracking & Personal stats)
CREATE TABLE IF NOT EXISTS beneficiary_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL CHECK (category IN ('Student', 'Low Income', 'Homeless', 'Other')),
    saved_meals_count INTEGER DEFAULT 0 CHECK (saved_meals_count >= 0),
    saved_co2_kg NUMERIC(8, 2) DEFAULT 0.0 CHECK (saved_co2_kg >= 0.0),
    saved_water_liters INTEGER DEFAULT 0 CHECK (saved_water_liters >= 0),
    current_level VARCHAR(30) DEFAULT 'Eco Beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- F. ENVIRONMENTAL METRICS TABLE (Impact log mapping)
CREATE TABLE IF NOT EXISTS environmental_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    reservation_id UUID UNIQUE NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    kg_saved NUMERIC(8, 2) NOT NULL CHECK (kg_saved >= 0.0),
    co2_saved_kg NUMERIC(8, 2) NOT NULL CHECK (co2_saved_kg >= 0.0),
    water_saved_liters INTEGER NOT NULL CHECK (water_saved_liters >= 0),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- G. GAMIFICATION & IMPACT SCORES TABLE
CREATE TABLE IF NOT EXISTS impact_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_score INTEGER DEFAULT 0 CHECK (total_score >= 0),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    unlocked_badges_count INTEGER DEFAULT 0 CHECK (unlocked_badges_count >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- H. BUSINESS METRICS TABLE (Merchant dashboard tracking)
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID UNIQUE NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    total_offers_published INTEGER DEFAULT 0 CHECK (total_offers_published >= 0),
    total_quantity_saved_kg NUMERIC(8, 2) DEFAULT 0.0 CHECK (total_quantity_saved_kg >= 0.0),
    total_co2_avoided_kg NUMERIC(8, 2) DEFAULT 0.0 CHECK (total_co2_avoided_kg >= 0.0),
    recovery_rate_pct NUMERIC(5, 2) DEFAULT 0.00 CHECK (recovery_rate_pct BETWEEN 0.00 AND 100.00),
    revenues_generated_dzd NUMERIC(10, 2) DEFAULT 0.00 CHECK (revenues_generated_dzd >= 0.00),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- I. DAILY ANALYTICS TABLE (Time-series aggregations)
CREATE TABLE IF NOT EXISTS daily_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    total_listings INTEGER DEFAULT 0,
    total_reservations INTEGER DEFAULT 0,
    total_kg_saved NUMERIC(8, 2) DEFAULT 0.0,
    total_co2_saved NUMERIC(8, 2) DEFAULT 0.0,
    total_water_saved INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- J. AI WASTE PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    predicted_date DATE NOT NULL,
    dish_name VARCHAR(255) NOT NULL,
    predicted_waste_kg DOUBLE PRECISION NOT NULL CHECK (predicted_waste_kg >= 0.0),
    confidence_score DOUBLE PRECISION NOT NULL CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    risk_level VARCHAR(15) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (restaurant_id, predicted_date, dish_name)
);

-- K. PIPELINE INGESTION TELEMETRY LOGS (System Health Audit)
CREATE TABLE IF NOT EXISTS pipeline_metrics (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    latency_ms INT NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('success', 'error')),
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================================
-- VIEWS FOR CORE BUSINESS & DECISION METRICS
-- ===========================================================================

-- A. Executive Impact View
CREATE OR REPLACE VIEW v_executive_impact AS
SELECT 
    ROUND(SUM(r.quantity)) AS meals_saved,
    ROUND(SUM(e.kg_saved), 1) AS food_saved_kg,
    ROUND(SUM(e.co2_saved_kg), 1) AS co2_prevented_kg,
    ROUND(SUM(e.water_saved_liters)) AS water_saved_liters,
    ROUND(SUM(r.quantity * (o.original_price - o.current_price)), 2) AS economic_value,
    (SELECT COUNT(*) FROM restaurants) AS active_donors,
    (SELECT COUNT(*) FROM users WHERE role = 'consumer') AS active_charities,
    COUNT(r.id) AS successful_reservations
FROM reservations r
JOIN offers o ON r.offer_id = o.id
JOIN environmental_metrics e ON e.reservation_id = r.id
WHERE r.status = 'confirmed';

-- B. Waste Intelligence Trends View
CREATE OR REPLACE VIEW v_waste_intelligence_by_category AS
SELECT 
    o.category,
    ROUND(SUM(o.original_quantity_kg), 1) AS total_surplus_kg,
    ROUND(SUM(COALESCE(e.kg_saved, 0.0)), 1) AS total_saved_kg,
    ROUND(SUM(COALESCE(e.kg_saved, 0.0)) / SUM(o.original_quantity_kg) * 100, 1) AS recovery_rate_pct
FROM offers o
LEFT JOIN reservations r ON r.offer_id = o.id AND r.status = 'confirmed'
LEFT JOIN environmental_metrics e ON e.reservation_id = r.id
GROUP BY o.category;

-- ===========================================================================
-- INDEXES FOR RETRIEVAL OPTIMIZATION
-- ===========================================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_coords ON restaurants (lat, lng);
CREATE INDEX IF NOT EXISTS idx_offers_active_feed ON offers (status, expires_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_reservations_offer ON reservations (offer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_consumer ON reservations (consumer_id);
CREATE INDEX IF NOT EXISTS idx_impact_logs_reservation ON environmental_metrics (reservation_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_lookup ON ai_predictions (restaurant_id, predicted_date);
CREATE INDEX IF NOT EXISTS idx_pipeline_timestamp ON pipeline_metrics (timestamp DESC);
