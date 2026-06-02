-- SavePlate Analytical Queries for Frontend Dashboards
-- Author: Data Engineer
-- Date: 2026-06-01

-- =========================================================================
-- 1. LIVE COMPTEUR GLOBAL
-- =========================================================================
SELECT 
    key, 
    value, 
    updated_at 
FROM impact_summary;

-- =========================================================================
-- 2. GEOGRAPHIC HEATMAP OF ACTIVE OFFERS
-- =========================================================================
SELECT 
    o.id AS offer_id,
    o.title,
    o.quantity_remaining,
    o.current_price,
    r.name AS restaurant_name,
    r.lat AS restaurant_lat,
    r.lng AS restaurant_lng,
    r.cuisine_type
FROM offers o
JOIN restaurants r ON o.restaurant_id = r.id
WHERE o.status = 'active' 
  AND o.expires_at > CURRENT_TIMESTAMP;

-- =========================================================================
-- 3. BAR CHART: OFFERS CREATED BY HOUR OF DAY
-- =========================================================================
SELECT 
    EXTRACT(HOUR FROM created_at) AS hour_of_day,
    COUNT(*) AS offers_published_count
FROM offers
GROUP BY hour_of_day
ORDER BY hour_of_day;

-- =========================================================================
-- 4. TOP 5 RESTAURANTS LEADERBOARD (Social Proof & Gamification)
-- =========================================================================
SELECT 
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.cuisine_type,
    COUNT(res.id) AS meals_saved_this_week,
    ROUND(SUM(i.co2_saved_g / 1000.0)::numeric, 2) AS co2_saved_kg
FROM restaurants r
JOIN offers o ON o.restaurant_id = r.id
JOIN reservations res ON res.offer_id = o.id
JOIN impact_logs i ON i.reservation_id = res.id
WHERE res.status = 'confirmed'
  AND res.confirmed_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY r.id, r.name, r.cuisine_type
ORDER BY meals_saved_this_week DESC
LIMIT 5;

-- =========================================================================
-- 5. TIME SERIES LINE CHART: EVOLUTION OF REDISTRIBUTION (Last 7 Days)
-- =========================================================================
SELECT 
    DATE(res.confirmed_at) AS date_saved,
    COUNT(res.id) AS daily_meals_saved,
    ROUND(SUM(i.co2_saved_g / 1000.0)::numeric, 2) AS daily_co2_saved_kg,
    ROUND(SUM(i.water_saved_liters)::numeric, 0) AS daily_water_saved_liters
FROM reservations res
JOIN impact_logs i ON i.reservation_id = res.id
WHERE res.status = 'confirmed'
  AND res.confirmed_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY date_saved
ORDER BY date_saved ASC;

-- =========================================================================
-- 6. DURATION DELAY: AVERAGE TIME FROM PUBLICATION TO BOOKING
-- =========================================================================
SELECT 
    AVG(res.created_at - o.created_at) AS avg_time_to_reserve,
    MIN(res.created_at - o.created_at) AS min_time_to_reserve,
    MAX(res.created_at - o.created_at) AS max_time_to_reserve
FROM reservations res
JOIN offers o ON res.offer_id = o.id;

-- =========================================================================
-- 7. GEOSPATIAL DISTANCE ANALYSIS (Average pickup travel distance)
-- =========================================================================
SELECT 
    ROUND(AVG(calculate_distance(u.lat, u.lng, r.lat, r.lng))::numeric, 2) AS avg_travel_distance_km,
    ROUND(MIN(calculate_distance(u.lat, u.lng, r.lat, r.lng))::numeric, 2) AS min_travel_distance_km,
    ROUND(MAX(calculate_distance(u.lat, u.lng, r.lat, r.lng))::numeric, 2) AS max_travel_distance_km
FROM reservations res
JOIN users u ON res.consumer_id = u.id
JOIN offers o ON res.offer_id = o.id
JOIN restaurants r ON o.restaurant_id = r.id
WHERE res.status = 'confirmed';
