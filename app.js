// ===========================================================================
// SANAD - FRONTEND SYSTEM & SIMULATION ENGINE
// ===========================================================================

// 1. IN-MEMORY DATABASE STATE (Simulating PostgreSQL/Supabase Tables)
const users = [
    { id: 'u1', username: 'Mokhtar (SDF)', role: 'consumer', beneficiary_type: 'Homeless' },
    { id: 'u2', username: 'Amine (Étudiant)', role: 'consumer', beneficiary_type: 'Student' },
    { id: 'u3', username: 'Nour (Faible revenu)', role: 'consumer', beneficiary_type: 'Low Income' },
    { id: 'u4', username: 'Kenzi (Autre)', role: 'consumer', beneficiary_type: 'Other' },
    { id: 'u5', username: 'Yasmine (Retraitée)', role: 'consumer', beneficiary_type: 'Elderly' },
    { id: 'u6', username: 'Samir (Chômeur)', role: 'consumer', beneficiary_type: 'Homeless' },
    { id: 'u7', username: 'Lina (Étudiante)', role: 'consumer', beneficiary_type: 'Student' },
    { id: 'u8', username: 'Rachid (Invalide)', role: 'consumer', beneficiary_type: 'Low Income' }
];

const partners = [
    { id: 'p1', name: 'La Boulangerie du Coin', type: 'Bakery', district: 'El-Hamri', lat: 35.6948, lng: -0.6312, declared_beneficiaries: 120, avg_waste_kg: 8.5 },
    { id: 'p2', name: 'Supermarché Express', type: 'Supermarket', district: 'Maraval', lat: 35.6892, lng: -0.6455, declared_beneficiaries: 350, avg_waste_kg: 24.0 },
    { id: 'p3', name: 'Le Bistro Gourmand', type: 'Restaurant', district: 'Oran Center', lat: 35.7001, lng: -0.6391, declared_beneficiaries: 80, avg_waste_kg: 14.5 },
    { id: 'p4', name: 'Saveurs d\'Asie', type: 'Restaurant', district: 'Front de Mer', lat: 35.7082, lng: -0.6275, declared_beneficiaries: 95, avg_waste_kg: 11.0 },
    { id: 'p5', name: 'La Table Verte', type: 'Restaurant', district: 'Courbet', lat: 35.7015, lng: -0.6189, declared_beneficiaries: 110, avg_waste_kg: 9.8 },
    { id: 'p6', name: 'Chez Mama Fatima', type: 'Restaurant', district: 'Sidi El Houari', lat: 35.7125, lng: -0.6420, declared_beneficiaries: 200, avg_waste_kg: 18.2 },
    { id: 'p7', name: 'Patisserie El Amel', type: 'Bakery', district: 'Les Amandiers', lat: 35.6830, lng: -0.6310, declared_beneficiaries: 75, avg_waste_kg: 6.4 },
    { id: 'p8', name: 'Marché Bio Oran', type: 'Market', district: 'USTO', lat: 35.6960, lng: -0.6500, declared_beneficiaries: 420, avg_waste_kg: 32.0 },
    { id: 'p9', name: 'Grill Palace Salam', type: 'Restaurant', district: 'Bir El Djir', lat: 35.6780, lng: -0.6200, declared_beneficiaries: 65, avg_waste_kg: 12.5 },
    { id: 'p10', name: 'Cafétéria Université', type: 'Cafeteria', district: 'Es Senia', lat: 35.6700, lng: -0.6310, declared_beneficiaries: 550, avg_waste_kg: 41.0 }
];

let listings = [
    { id: 'l1', partner_id: 'p1', title: 'Box of Fresh Baguettes', category: 'Bakery & Bread', original_quantity_kg: 8.0, original_price: 240, current_price: 80, quantity_total: 5, quantity_remaining: 3, status: 'active', expires_at: new Date(Date.now() + 3600000 * 2), created_at: new Date(Date.now() - 3600000 * 3) },
    { id: 'l2', partner_id: 'p2', title: 'Produce Mix Basket', category: 'Produce', original_quantity_kg: 15.0, original_price: 600, current_price: 150, quantity_total: 3, quantity_remaining: 1, status: 'active', expires_at: new Date(Date.now() + 3600000 * 4), created_at: new Date(Date.now() - 3600000 * 1) },
    { id: 'l3', partner_id: 'p3', title: 'Beef Stew Portions', category: 'Prepared Meals', original_quantity_kg: 10.0, original_price: 1200, current_price: 400, quantity_total: 4, quantity_remaining: 0, status: 'reserved', expires_at: new Date(Date.now() - 10000), created_at: new Date(Date.now() - 3600000 * 5) },
    { id: 'l4', partner_id: 'p4', title: 'Sushi Selection Tray', category: 'Prepared Meals', original_quantity_kg: 6.0, original_price: 1500, current_price: 500, quantity_total: 2, quantity_remaining: 2, status: 'active', expires_at: new Date(Date.now() + 3600000 * 1), created_at: new Date(Date.now() - 1800000) },
    { id: 'l5', partner_id: 'p5', title: 'Dairy & Cheese Cups', category: 'Dairy & Eggs', original_quantity_kg: 12.0, original_price: 450, current_price: 100, quantity_total: 6, quantity_remaining: 6, status: 'active', expires_at: new Date(Date.now() + 3600000 * 5), created_at: new Date(Date.now() - 600000) },
    { id: 'l6', partner_id: 'p6', title: 'Tajine de Poulet Familial', category: 'Prepared Meals', original_quantity_kg: 18.0, original_price: 2400, current_price: 700, quantity_total: 6, quantity_remaining: 4, status: 'active', expires_at: new Date(Date.now() + 3600000 * 3), created_at: new Date(Date.now() - 3600000 * 2) },
    { id: 'l7', partner_id: 'p7', title: 'Assortiment Gâteaux Orientaux', category: 'Bakery & Bread', original_quantity_kg: 5.0, original_price: 800, current_price: 280, quantity_total: 8, quantity_remaining: 5, status: 'active', expires_at: new Date(Date.now() + 3600000 * 4), created_at: new Date(Date.now() - 3600000 * 1) },
    { id: 'l8', partner_id: 'p8', title: 'Corbeille Légumes Frais', category: 'Produce', original_quantity_kg: 22.0, original_price: 900, current_price: 250, quantity_total: 5, quantity_remaining: 3, status: 'active', expires_at: new Date(Date.now() + 3600000 * 6), created_at: new Date(Date.now() - 7200000) },
    { id: 'l9', partner_id: 'p9', title: 'Merguez & Brochettes Grillées', category: 'Meat & Fish', original_quantity_kg: 9.0, original_price: 1800, current_price: 600, quantity_total: 4, quantity_remaining: 2, status: 'active', expires_at: new Date(Date.now() + 3600000 * 2), created_at: new Date(Date.now() - 1800000) },
    { id: 'l10', partner_id: 'p10', title: 'Menu Étudiant Complet', category: 'Prepared Meals', original_quantity_kg: 30.0, original_price: 3000, current_price: 800, quantity_total: 10, quantity_remaining: 7, status: 'active', expires_at: new Date(Date.now() + 3600000 * 5), created_at: new Date(Date.now() - 3600000 * 3) },
    { id: 'l11', partner_id: 'p1', title: 'Croissants & Viennoiseries', category: 'Bakery & Bread', original_quantity_kg: 4.0, original_price: 320, current_price: 100, quantity_total: 10, quantity_remaining: 6, status: 'active', expires_at: new Date(Date.now() + 3600000 * 1.5), created_at: new Date(Date.now() - 3600000 * 0.5) },
    { id: 'l12', partner_id: 'p2', title: 'Fromages & Yaourts Mix', category: 'Dairy & Eggs', original_quantity_kg: 8.0, original_price: 650, current_price: 200, quantity_total: 4, quantity_remaining: 2, status: 'active', expires_at: new Date(Date.now() + 3600000 * 7), created_at: new Date(Date.now() - 3600000 * 2) },
    { id: 'l13', partner_id: 'p3', title: 'Couscous Traditionnel', category: 'Prepared Meals', original_quantity_kg: 14.0, original_price: 1600, current_price: 500, quantity_total: 5, quantity_remaining: 0, status: 'saved', expires_at: new Date(Date.now() - 3600000 * 1), created_at: new Date(Date.now() - 3600000 * 6) }
];

let reservations = [
    { id: 'r1', listing_id: 'l3', consumer_id: 'u1', quantity: 4, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 4) },
    { id: 'r2', listing_id: 'l1', consumer_id: 'u2', quantity: 2, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 2) },
    { id: 'r3', listing_id: 'l2', consumer_id: 'u3', quantity: 2, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 1) },
    { id: 'r4', listing_id: 'l6', consumer_id: 'u1', quantity: 2, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 1.5) },
    { id: 'r5', listing_id: 'l7', consumer_id: 'u5', quantity: 3, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 0.8) },
    { id: 'r6', listing_id: 'l8', consumer_id: 'u6', quantity: 2, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 2.5) },
    { id: 'r7', listing_id: 'l10', consumer_id: 'u7', quantity: 3, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 3) },
    { id: 'r8', listing_id: 'l13', consumer_id: 'u8', quantity: 5, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 5) },
    { id: 'r9', listing_id: 'l9', consumer_id: 'u3', quantity: 2, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 1) },
    { id: 'r10', listing_id: 'l11', consumer_id: 'u4', quantity: 4, status: 'confirmed', created_at: new Date(Date.now() - 3600000 * 0.5) }
];

let predictions = [
    { id: 'pr1', partner_id: 'p1', dish_name: 'Traditional Sourdough Loaf', predicted_waste_kg: 6.5, risk_level: 'high', confidence_score: 0.92, predicted_date: new Date(Date.now() + 86400000).toLocaleDateString('fr') },
    { id: 'pr2', partner_id: 'p2', dish_name: 'Mixed Fresh Salads', predicted_waste_kg: 12.0, risk_level: 'high', confidence_score: 0.88, predicted_date: new Date(Date.now() + 86400000).toLocaleDateString('fr') },
    { id: 'pr3', partner_id: 'p3', dish_name: 'Lamb Tajine Portions', predicted_waste_kg: 5.2, risk_level: 'medium', confidence_score: 0.74, predicted_date: new Date(Date.now() + 86400000 * 2).toLocaleDateString('fr') },
    { id: 'pr4', partner_id: 'p4', dish_name: 'California Maki Sets', predicted_waste_kg: 4.8, risk_level: 'low', confidence_score: 0.65, predicted_date: new Date(Date.now() + 86400000).toLocaleDateString('fr') },
    { id: 'pr5', partner_id: 'p5', dish_name: 'Veggie Soup Platters', predicted_waste_kg: 3.5, risk_level: 'low', confidence_score: 0.61, predicted_date: new Date(Date.now() + 86400000 * 2).toLocaleDateString('fr') },
    { id: 'pr6', partner_id: 'p6', dish_name: 'Tajine Agneau & Pruneaux', predicted_waste_kg: 14.8, risk_level: 'high', confidence_score: 0.91, predicted_date: new Date(Date.now() + 86400000).toLocaleDateString('fr') },
    { id: 'pr7', partner_id: 'p7', dish_name: 'Makroud & Baklawa Mix', predicted_waste_kg: 4.2, risk_level: 'medium', confidence_score: 0.78, predicted_date: new Date(Date.now() + 86400000).toLocaleDateString('fr') },
    { id: 'pr8', partner_id: 'p8', dish_name: 'Légumes de Saison Surplus', predicted_waste_kg: 28.5, risk_level: 'high', confidence_score: 0.95, predicted_date: new Date(Date.now() + 86400000).toLocaleDateString('fr') },
    { id: 'pr9', partner_id: 'p9', dish_name: 'Kefta & Viandes Grillées', predicted_waste_kg: 8.3, risk_level: 'medium', confidence_score: 0.82, predicted_date: new Date(Date.now() + 86400000 * 2).toLocaleDateString('fr') },
    { id: 'pr10', partner_id: 'p10', dish_name: 'Plats Chauds Cafétéria', predicted_waste_kg: 35.0, risk_level: 'high', confidence_score: 0.97, predicted_date: new Date(Date.now() + 86400000).toLocaleDateString('fr') }
];

// Telemetry & Pipeline State variables
let pipelineMetrics = {
    totalEvents: 1420,
    successCount: 1420,
    errorsCount: 0,
    latencyHistory: [42, 38, 45, 41, 50, 43, 39, 44, 40, 42],
    activeConnections: 14
};

let dbStats = {
    dbSizeMB: 14.2,
    indexSizeMB: 2.8,
    dailyGrowthRecords: 124
};

let dataQuality = {
    missingValues: 0,
    duplicatesDetected: 0,
    orphanedRecords: 0,
    totalChecked: 2150
};

// SQL schemas & query definitions for SQL Inspector
const sqlInspectorData = {
    pipeline_telemetry: {
        title: "Pipeline Telemetry Diagnostics",
        subtitle: "Analyzing API gateway webhook ingestion speeds & health metrics",
        schema: `CREATE TABLE pipeline_metrics (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- e.g. 'listing_create', 'claim_submit'
    latency_ms INT NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('success', 'error')),
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pipeline_timestamp ON pipeline_metrics (timestamp DESC);`,
        query: `-- Aggregates event throughput, average latency, and success rates for today's ingestion streams.
SELECT 
    COUNT(*) AS events_ingested_today,
    ROUND(AVG(latency_ms), 1) AS avg_latency_ms,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'success')::numeric / COUNT(*)) * 100, 
        2
    ) AS ingestion_success_rate_pct
FROM pipeline_metrics
WHERE timestamp >= CURRENT_DATE;`,
        explanation: "This query tracks the integrity and performance of the ingestion pipeline in real-time. Ingested events represent data pushed by external donor apps. Average latency tracks write latency into Supabase. High latency (> 200ms) triggers alerts for indexing optimizations."
    },
    database_analytics: {
        title: "Database Sizing & Catalog Analytics",
        subtitle: "Querying physical table sizing and database constraints statistics",
        schema: `-- PostgreSQL schema metadata catalog.
-- Displays table row counts and physical volume storage.`,
        query: `-- Custom query extracting physical disk metrics from PostgreSQL system tables.
SELECT 
    relname AS table_name,
    n_live_tup AS estimated_rows,
    pg_size_pretty(pg_relation_size(relid)) AS table_data_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;`,
        explanation: "This query reads the PostgreSQL schema metadata catalog \`pg_stat_user_tables\`. As Data Engineers, we monitor physical sizes to determine partition strategies, clean up orphaned rows, and evaluate table storage structures."
    },
    data_quality: {
        title: "Data Quality & Integrity Guardrails",
        subtitle: "Extracting null rates, logical constraints check metrics, and orphaned references",
        schema: `-- Schema-level check constraints enforce basic business rules:
ALTER TABLE offers ADD CONSTRAINT chk_qty CHECK (quantity_total > 0);
ALTER TABLE offers ADD CONSTRAINT chk_price CHECK (current_price <= original_price);
ALTER TABLE reservations ADD CONSTRAINT fk_reservation_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE;`,
        query: `-- Scans tables for structural errors, missing references, and nulls.
SELECT 
    (SELECT COUNT(*) FROM offers WHERE title IS NULL OR category IS NULL) AS missing_metadata_nulls,
    (SELECT COUNT(*) FROM offers WHERE quantity_total <= 0) AS invalid_quantity_violations,
    (SELECT COUNT(*) FROM offers l LEFT JOIN restaurants p ON l.restaurant_id = p.id WHERE p.id IS NULL) AS orphaned_listing_relations,
    ROUND(
        (1.0 - (
            (SELECT COUNT(*) FROM offers WHERE title IS NULL OR quantity_total <= 0)::numeric / 
            (SELECT COUNT(*) + 1 FROM offers)
        )) * 100, 
        2
    ) AS data_integrity_score_pct;`,
        explanation: "A key Data Engineering task is maintaining a clean analytical store. This query tracks schema constraint anomalies. A quality score below 98% automatically halts downstream feature exports to the AI prediction models."
    }
};

// Global variables for active selections and UI references
let activeRole = 'admin';
let activeMerchantId = 'p1';
let activeConsumerId = 'u1';
let currentSection = 'overview';

// Maps and Charts objects
let adminMap = null;
let userMap = null;
let charts = {};
let simulationInterval = null;

// ===========================================================================
// INITIALIZATION
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Populate select lists
    populateSelectors();
    
    // Set UI to initial state
    handleRoleChange();
    
    // Start simulation stream
    startDemoSimulation();

    // Logger pings
    logTerminal('SUCCESS', 'Sanad analytical framework initialized. Ingestion webhook listening.');
    logTerminal('INFO', 'Unified database schema connected. Row-Level Security policies validated.');
});

// Helper to fill role secondary selectors
function populateSelectors() {
    const mSelector = document.getElementById('merchant-selector');
    mSelector.innerHTML = partners.map(p => `<option value="${p.id}">${p.name} (${p.type})</option>`).join('');
    
    // Set initial
    activeMerchantId = partners[0].id;
}

// ===========================================================================
// PAGE SWITCHER — showPage('home') / showPage('dashboard')
// The two pages (#page-home, #page-dashboard) are completely separate DOM
// containers. Switching between them never overlaps content.
// ===========================================================================

function showPage(page) {
    const pageHome      = document.getElementById('page-home');
    const pageDashboard = document.getElementById('page-dashboard');

    if (page === 'dashboard') {
        // Hide public landing, reveal full admin system
        pageHome.style.display      = 'none';
        pageDashboard.style.display = 'flex';
        // Sync the toggle to checked state
        const toggle = document.getElementById('admin-panel-toggle');
        if (toggle) toggle.checked = true;
        // Re-initialise dashboard UI
        updateUI();
        logTerminal('INFO', 'Switched to Admin Dashboard view.');
    } else {
        // Hide admin system, show public landing full-screen
        pageDashboard.style.display = 'none';
        pageHome.style.display      = 'block';
        // Sync the toggle to unchecked state
        const toggle = document.getElementById('admin-panel-toggle');
        if (toggle) toggle.checked = false;
        logTerminal('INFO', 'Switched to Public Landing Page view.');
    }
}

// ===========================================================================
// ADMIN PANEL TOGGLE — wired to #admin-panel-toggle inside #page-dashboard
// Delegates entirely to showPage() so both pages are never visible together.
// ===========================================================================

function handleAdminPanelToggle() {
    const toggle = document.getElementById('admin-panel-toggle');
    showPage(toggle.checked ? 'dashboard' : 'home');
}

// ===========================================================================
// TOGGLE ADMIN SIDEBAR — Bound to id="demo-toggle" onchange="toggleAdminSidebar(this)"
// Only controls sidebar visibility WITHIN page-dashboard. Does NOT switch pages.
// Toggle ON  (checked): sidebar visible — flex layout gives main panel its space
// Toggle OFF (unchecked): sidebar hidden — main panel expands to fill full width
// ===========================================================================

function toggleAdminSidebar(checkbox) {
    const sidebar       = document.getElementById('dashboard-sidebar');
    const liveIndicator = document.getElementById('live-indicator');
    const statusLabel   = document.getElementById('status-label');
    const actionsGroup  = document.getElementById('sim-actions-group');

    if (checkbox.checked) {
        // Sidebar ON — show it, flex layout pushes main content right automatically
        if (sidebar) sidebar.style.display = 'flex';
        if (liveIndicator) liveIndicator.className = 'status-indicator live';
        if (statusLabel)   statusLabel.textContent  = 'Sim Streaming';
        if (actionsGroup)  actionsGroup.classList.remove('disabled');
    } else {
        // Sidebar OFF — hide it, main content auto-fills remaining width
        if (sidebar) sidebar.style.display = 'none';
        if (liveIndicator) liveIndicator.className = 'status-indicator live';
        if (statusLabel)   statusLabel.textContent  = 'Sim Active';
    }
}

// ===========================================================================
// NAVIGATION & VIEW MANAGER
// ===========================================================================

function handleRoleChange() {
    activeRole = document.getElementById('role-selector').value;
    
    // Toggle selector indicators
    document.getElementById('merchant-selector-container').style.display = activeRole === 'business' ? 'flex' : 'none';
    document.getElementById('beneficiary-selector-container').style.display = activeRole === 'user' ? 'flex' : 'none';
    
    // Hide all menus and sections
    document.getElementById('sidebar-menu-admin').style.display = activeRole === 'admin' ? 'block' : 'none';
    document.getElementById('sidebar-menu-business').style.display = activeRole === 'business' ? 'block' : 'none';
    document.getElementById('sidebar-menu-user').style.display = activeRole === 'user' ? 'block' : 'none';
    
    // Update footer info
    const footerAvatar = document.getElementById('sidebar-role-avatar');
    const footerName = document.getElementById('sidebar-profile-name');
    const footerRole = document.getElementById('sidebar-profile-role');

    if (activeRole === 'admin') {
        footerAvatar.textContent = 'AD';
        footerName.textContent = 'Admin Account';
        footerRole.textContent = 'Platform Manager';
        switchSection('admin-overview');
    } else if (activeRole === 'business') {
        footerAvatar.textContent = 'ME';
        handleMerchantChange(); // sets active merchant name & calls switchSection
    } else if (activeRole === 'user') {
        footerAvatar.textContent = 'BE';
        handleBeneficiaryChange(); // sets active consumer name & calls switchSection
    }
}

function handleMerchantChange() {
    activeMerchantId = document.getElementById('merchant-selector').value;
    const store = partners.find(p => p.id === activeMerchantId);
    
    const footerName = document.getElementById('sidebar-profile-name');
    const footerRole = document.getElementById('sidebar-profile-role');
    footerName.textContent = store.name;
    footerRole.textContent = `Propriétaire (${store.type})`;
    
    switchSection('business-impact');
    logTerminal('INFO', `Switched view context to store: "${store.name}". Row-level security limits data.`);
}

function handleBeneficiaryChange() {
    activeConsumerId = document.getElementById('beneficiary-selector').value;
    const usr = users.find(u => u.id === activeConsumerId);
    
    const footerName = document.getElementById('sidebar-profile-name');
    const footerRole = document.getElementById('sidebar-profile-role');
    footerName.textContent = usr.username;
    footerRole.textContent = `Bénéficiaire (${usr.beneficiary_type})`;
    
    // Update avatar text
    document.getElementById('user-avatar-text').textContent = usr.username.charAt(0);
    document.getElementById('user-name-text').textContent = usr.username.split(' ')[0];
    document.getElementById('user-category-select').value = usr.beneficiary_type;

    switchSection('user-profile');
    logTerminal('INFO', `Switched beneficiary context to: "${usr.username}".`);
}

function handleUserCategoryChange() {
    const selectVal = document.getElementById('user-category-select').value;
    const usr = users.find(u => u.id === activeConsumerId);
    usr.beneficiary_type = selectVal;
    
    const footerRole = document.getElementById('sidebar-profile-role');
    footerRole.textContent = `Bénéficiaire (${usr.beneficiary_type})`;
    
    // Redraw charts
    updateUI();
    toast('Profil mis à jour !', 'success');
}

function switchSection(sectionKey) {
    currentSection = sectionKey;
    
    // Remove active styles on all sidebar list items
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    
    // Find item matching data-section
    const activeLi = document.querySelector(`.sidebar-menu li[data-section="${sectionKey}"]`);
    if (activeLi) activeLi.classList.add('active');
    
    // Hide all main section containers
    document.querySelectorAll('.main-content .grid-section').forEach(sec => sec.style.display = 'none');
    
    // Show selected container
    const activeSectionContainer = document.getElementById(`section-${sectionKey}`);
    if (activeSectionContainer) {
        activeSectionContainer.style.display = 'flex';
    }
    
    // Update headers
    const titleEl = document.getElementById('page-title');
    const subEl = document.getElementById('page-subtitle');
    
    if (sectionKey.startsWith('admin')) {
        titleEl.textContent = "Sanad Admin Dashboard";
        subEl.textContent = "Vue d'ensemble globale de toute la plateforme en temps réel";
        
        if (sectionKey === 'admin-heatmap') {
            setTimeout(() => renderMap('admin'), 100);
        }
    } else if (sectionKey.startsWith('business')) {
        const store = partners.find(p => p.id === activeMerchantId);
        titleEl.textContent = `Merchant Portal — ${store.name}`;
        subEl.textContent = `Manage inventory, analytics and IA recommendations for your specific branch.`;
    } else if (sectionKey.startsWith('user')) {
        const usr = users.find(u => u.id === activeConsumerId);
        titleEl.textContent = `Sanad — Beneficiary Portal`;
        subEl.textContent = `Claim surplus food, trace your ecological impact and collect badges.`;
        
        if (sectionKey === 'user-map') {
            setTimeout(() => renderMap('user'), 100);
        }
    }

    // Refresh everything
    updateUI();
}

// ===========================================================================
// CALCULATION LOGIC & VIEW UPDATER
// ===========================================================================

function updateUI() {
    // 1. COMPUTE GLOBAL STATS FOR ADMIN
    let totalKgSaved = 0.0;
    let totalValueRecovered = 0;
    let totalMealsSaved = 0;
    let totalOriginalValue = 0;

    // Calculate active claims
    reservations.forEach(r => {
        if (r.status === 'confirmed') {
            totalMealsSaved += r.quantity;
            const listing = listings.find(l => l.id === r.listing_id);
            if (listing) {
                // Formula: 1 unit claimed = original_qty/quantity_total
                const unitWeight = listing.original_quantity_kg / listing.quantity_total;
                const weightSaved = r.quantity * unitWeight;
                totalKgSaved += weightSaved;
                
                // Economic calculation
                const originalValuePerUnit = listing.original_price / listing.quantity_total;
                const saleValuePerUnit = listing.current_price / listing.quantity_total;
                totalValueRecovered += (originalValuePerUnit - saleValuePerUnit) * r.quantity;
            }
        }
    });

    const co2SavedKg = Math.round(totalKgSaved * 2.5); 
    const waterSavedLiters = Math.round(totalKgSaved * 1000);
    const activeOffersCount = listings.filter(l => l.status === 'active' && l.quantity_remaining > 0).length;
    
    // Rescue rate Calculation
    let totalSurplusCreatedKg = listings.reduce((sum, l) => sum + l.original_quantity_kg, 0);
    const globalRescueRate = totalSurplusCreatedKg > 0 ? (totalKgSaved / totalSurplusCreatedKg * 100) : 0;

    // Set Admin KPI Displays
    if (currentSection === 'admin-overview') {
        document.getElementById('admin-kpi-meals').textContent = totalMealsSaved.toLocaleString();
        document.getElementById('admin-kpi-co2').textContent = `${co2SavedKg.toFixed(1)} kg`;
        document.getElementById('admin-kpi-water').textContent = `${waterSavedLiters.toLocaleString()} L`;
        document.getElementById('admin-kpi-economy').textContent = `${totalValueRecovered.toLocaleString()} DZD`;
        document.getElementById('admin-kpi-merchants').textContent = partners.length;
        document.getElementById('admin-kpi-consumers').textContent = users.length;
        document.getElementById('admin-kpi-offers').textContent = activeOffersCount;
        document.getElementById('admin-kpi-rescuerate').textContent = `${globalRescueRate.toFixed(1)}%`;
        
        const rateTrend = document.getElementById('admin-kpi-rate-trend');
        if (globalRescueRate > 60) {
            rateTrend.textContent = '▲ Excellent';
            rateTrend.className = 'kpi-trend trend-up';
        } else {
            rateTrend.textContent = '▼ Moderate';
            rateTrend.className = 'kpi-trend trend-down';
        }
    }

    // 2. COMPUTE BUSINESS KPIs (Isolated)
    const storeListings = listings.filter(l => l.partner_id === activeMerchantId);
    let storeKgSaved = 0.0;
    let storeMealsSaved = 0;
    let storeDiscountsSaved = 0;
    let storeInitialValue = 0;
    let storeRecoveredCapital = 0;

    storeListings.forEach(l => {
        storeInitialValue += l.original_price;
        
        // Sum claims
        const storeClaims = reservations.filter(r => r.listing_id === l.id && r.status === 'confirmed');
        let claimedQty = 0;
        storeClaims.forEach(rc => {
            claimedQty += rc.quantity;
        });

        const unitWeight = l.original_quantity_kg / l.quantity_total;
        storeKgSaved += claimedQty * unitWeight;
        storeMealsSaved += claimedQty;
        
        const origVal = (l.original_price / l.quantity_total) * claimedQty;
        const saleVal = (l.current_price / l.quantity_total) * claimedQty;
        storeDiscountsSaved += (origVal - saleVal);
        storeRecoveredCapital += saleVal;
    });

    const storeCo2Saved = Math.round(storeKgSaved * 2.5);
    const storeWaterSaved = Math.round(storeKgSaved * 1000);
    const storeAvoidedDisposal = Math.round(storeKgSaved * 10); // landfill tax equivalent (10DZD/kg)

    if (activeRole === 'business') {
        if (currentSection === 'business-impact') {
            document.getElementById('business-kpi-meals').textContent = storeMealsSaved;
            document.getElementById('business-kpi-co2').textContent = `${storeCo2Saved.toFixed(1)} kg`;
            document.getElementById('business-kpi-water').textContent = `${storeWaterSaved.toLocaleString()} L`;
            document.getElementById('business-kpi-value').textContent = `${storeDiscountsSaved.toLocaleString()} DZD`;
            
            // Equivalents
            document.getElementById('business-equiv-car').textContent = `${Math.round(storeCo2Saved / 0.21)} km`;
            document.getElementById('business-equiv-showers').textContent = `${Math.round(storeWaterSaved / 60)} cycles`;
        } else if (currentSection === 'business-offers') {
            renderBusinessOffersTable(storeListings);
        } else if (currentSection === 'business-reservations') {
            renderBusinessReservationsTable(storeListings);
        } else if (currentSection === 'business-revenue') {
            document.getElementById('business-rev-initial').textContent = `${storeInitialValue.toLocaleString()} DZD`;
            document.getElementById('business-rev-recovered').textContent = `${storeRecoveredCapital.toLocaleString()} DZD`;
            document.getElementById('business-rev-avoided').textContent = `${storeAvoidedDisposal.toLocaleString()} DZD`;
        } else if (currentSection === 'business-recom') {
            // Suggest product based on waste peaks
            const mainRiskPred = predictions.filter(p => p.partner_id === activeMerchantId).sort((a,b) => b.predicted_waste_kg - a.predicted_waste_kg)[0];
            const riskName = mainRiskPred ? mainRiskPred.dish_name : 'Prepared dishes';
            document.getElementById('recom-item-name').textContent = riskName;
        }
    }

    // 3. COMPUTE USER KPIs (Personal record & Gamification)
    const personalClaims = reservations.filter(r => r.consumer_id === activeConsumerId && r.status === 'confirmed');
    let personalMeals = 0;
    let personalKg = 0.0;
    let personalSavings = 0;

    personalClaims.forEach(rc => {
        personalMeals += rc.quantity;
        const listing = listings.find(l => l.id === rc.listing_id);
        if (listing) {
            const unitWeight = listing.original_quantity_kg / listing.quantity_total;
            personalKg += rc.quantity * unitWeight;

            const unitOrig = listing.original_price / listing.quantity_total;
            const unitSale = listing.current_price / listing.quantity_total;
            personalSavings += (unitOrig - unitSale) * rc.quantity;
        }
    });

    const personalCo2 = personalKg * 2.5;

    if (activeRole === 'user') {
        if (currentSection === 'user-profile') {
            document.getElementById('user-kpi-meals').textContent = personalMeals;
            document.getElementById('user-kpi-savings').textContent = `${personalSavings.toLocaleString()} DZD`;
            document.getElementById('user-kpi-co2').textContent = `${personalCo2.toFixed(1)} kg`;
            
            // Gamification Levels
            let levelTitle = "Eco Beginner";
            let reqs = 5;
            let ratioText = `${personalMeals} / ${reqs} Claims`;
            let barPct = Math.min((personalMeals / reqs) * 100, 100);

            if (personalMeals >= 20) {
                levelTitle = "Zero Waste Legend 👑";
                ratioText = `${personalMeals} Claims Rescued`;
                barPct = 100;
            } else if (personalMeals >= 10) {
                levelTitle = "Green Champion 🌳";
                reqs = 20;
                ratioText = `${personalMeals} / ${reqs} Claims`;
                barPct = ((personalMeals - 10) / (reqs - 10)) * 100;
            } else if (personalMeals >= 5) {
                levelTitle = "Meal Rescuer 🍽️";
                reqs = 10;
                ratioText = `${personalMeals} / ${reqs} Claims`;
                barPct = ((personalMeals - 5) / (reqs - 5)) * 100;
            }

            document.getElementById('user-badge-level').textContent = `Rank: ${levelTitle}`;
            document.getElementById('user-badge-ratio').textContent = ratioText;
            document.getElementById('user-badge-progress').style.width = `${barPct}%`;

            // Style Achievements Badges
            updateBadgesUI(personalMeals);
            
            // Render user history table
            renderUserReservationsTable(personalClaims);
        } else if (currentSection === 'user-feed') {
            renderUserFeedGrid();
        }
    }

    // 4. TELEMETRY DIAGNOSTICS & SYSTEM WIDGETS
    if (activeRole === 'admin' && currentSection === 'admin-telemetry') {
        document.getElementById('tel-events').textContent = pipelineMetrics.totalEvents;
        const successRate = (pipelineMetrics.successCount / pipelineMetrics.totalEvents) * 100;
        document.getElementById('tel-success').textContent = `${successRate.toFixed(2)}%`;
        
        const avgLatency = Math.round(pipelineMetrics.latencyHistory.reduce((a, b) => a + b, 0) / pipelineMetrics.latencyHistory.length);
        document.getElementById('tel-latency').textContent = `${avgLatency} ms`;
        document.getElementById('tel-connections').textContent = `${pipelineMetrics.activeConnections} / 50`;

        // DB Counts
        document.getElementById('db-users-rows').textContent = `${users.length} rows`;
        document.getElementById('db-restaurants-rows').textContent = `${partners.length} rows`;
        document.getElementById('db-offers-rows').textContent = `${listings.length} rows`;
        document.getElementById('db-reservations-rows').textContent = `${reservations.length} rows`;
        document.getElementById('db-impact-rows').textContent = `${reservations.filter(r=>r.status==='confirmed').length} rows`;

        const computedSize = 14.2 + (listings.length * 0.002) + (reservations.length * 0.0015);
        document.getElementById('db-size').textContent = `${computedSize.toFixed(2)} MB`;

        // Data Quality score
        document.getElementById('dq-nulls').textContent = dataQuality.missingValues;
        document.getElementById('dq-duplicates').textContent = dataQuality.duplicatesDetected;
        document.getElementById('dq-orphans').textContent = dataQuality.orphanedRecords;

        const totalDQIssues = dataQuality.missingValues + dataQuality.duplicatesDetected + dataQuality.orphanedRecords;
        const dqScoreVal = document.getElementById('dq-score');
        const dqBar = document.getElementById('dq-bar-fill');
        const dqLabel = document.getElementById('dq-score-label');

        if (totalDQIssues === 0) {
            dqScoreVal.textContent = '100%';
            dqScoreVal.className = 'qs-value text-success';
            dqBar.style.width = '100%';
            dqBar.className = 'qs-bar-fill';
            dqLabel.textContent = 'All constraint assertions passed';
            dqLabel.className = 'qs-desc text-success';
        } else {
            const errorPct = (totalDQIssues / listings.length) * 100;
            const finalScore = Math.max(0, 100 - errorPct);
            dqScoreVal.textContent = `${finalScore.toFixed(1)}%`;
            dqScoreVal.className = 'qs-value text-orange';
            dqBar.style.width = `${finalScore}%`;
            dqBar.className = 'qs-bar-fill error';
            dqLabel.textContent = `${totalDQIssues} pipeline anomalies caught!`;
            dqLabel.className = 'qs-desc text-red';
        }
    }

    // 5. RENDERING TABLES & VIEWS
    if (activeRole === 'admin') {
        if (currentSection === 'admin-business') {
            renderAdminBusinessTable();
            renderAdminLeaderboard();
        } else if (currentSection === 'admin-predictions') {
            renderAdminPredictionsList();
        }
    } else if (activeRole === 'user' && currentSection === 'user-leaderboard') {
        renderUserLeaderboard();
    }

    // 6. UPDATE VISUAL CHARTS
    updateCharts();
}

// Table Renderers
function renderBusinessOffersTable(storeListings) {
    const body = document.getElementById('business-offers-table-body');
    body.innerHTML = '';

    if (storeListings.length === 0) {
        body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No surplus listings published.</td></tr>';
        return;
    }

    storeListings.forEach(l => {
        const row = document.createElement('tr');
        const remainsPct = l.quantity_remaining / l.quantity_total;
        let pillClass = 'available';
        if (l.quantity_remaining === 0) pillClass = 'out_of_stock';
        else if (remainsPct < 0.3) pillClass = 'critical';

        const expMins = Math.max(0, Math.round((l.expires_at - Date.now()) / 60000));
        const expText = expMins > 60 ? `${Math.floor(expMins/60)}h remaining` : `${expMins}m remaining`;

        row.innerHTML = `
            <td><strong>${escapeHtml(l.title)}</strong></td>
            <td><span class="badge badge-secondary">${escapeHtml(l.category)}</span></td>
            <td>${l.original_price} DZD</td>
            <td><strong>${l.current_price} DZD</strong></td>
            <td><strong>${l.quantity_remaining} / ${l.quantity_total} units</strong></td>
            <td><span class="status-pill ${pillClass}">${l.status}</span></td>
            <td style="font-size: 0.82rem; color: var(--text-secondary);">${expMins <= 0 ? 'Expired' : expText}</td>
        `;
        body.appendChild(row);
    });
}

function renderBusinessReservationsTable(storeListings) {
    const body = document.getElementById('business-reservations-table-body');
    body.innerHTML = '';

    const storeOffersIds = storeListings.map(l => l.id);
    const storeClaims = reservations.filter(r => storeOffersIds.includes(r.listing_id)).sort((a,b)=>b.created_at - a.created_at);

    if (storeClaims.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No claims received yet.</td></tr>';
        return;
    }

    storeClaims.forEach(r => {
        const row = document.createElement('tr');
        const listing = listings.find(l => l.id === r.listing_id);
        const usr = users.find(u => u.id === r.consumer_id) || { username: 'Anonyme', beneficiary_type: 'Other' };
        
        row.innerHTML = `
            <td><strong>${escapeHtml(usr.username)}</strong><br><span style="font-size:0.75rem;color:var(--text-secondary);">${usr.beneficiary_type}</span></td>
            <td>${escapeHtml(listing.title)}</td>
            <td><strong>${r.quantity} units</strong></td>
            <td><span class="status-pill saved">${r.status}</span></td>
            <td style="font-size: 0.82rem; color: var(--text-secondary);">${new Date(r.created_at).toLocaleString('fr')}</td>
        `;
        body.appendChild(row);
    });
}

function renderUserReservationsTable(personalClaims) {
    const body = document.getElementById('user-reservations-table-body');
    body.innerHTML = '';

    if (personalClaims.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No meals reserved yet. Go check the active feed!</td></tr>';
        return;
    }

    personalClaims.forEach(r => {
        const row = document.createElement('tr');
        const listing = listings.find(l => l.id === r.listing_id) || { title: 'Unknown dish', partner_id: 'unknown' };
        const provider = partners.find(p => p.id === listing.partner_id) || { name: 'Store Partner' };

        row.innerHTML = `
            <td><strong>${escapeHtml(listing.title)}</strong></td>
            <td>${escapeHtml(provider.name)}</td>
            <td><strong>${r.quantity} units</strong></td>
            <td><span class="status-pill saved">${r.status}</span></td>
            <td style="font-size: 0.82rem; color: var(--text-secondary);">${new Date(r.created_at).toLocaleDateString('fr')}</td>
        `;
        body.appendChild(row);
    });
}

function renderAdminBusinessTable() {
    const body = document.getElementById('admin-business-table-body');
    body.innerHTML = '';

    const categories = ['Prepared Meals', 'Bakery & Bread', 'Produce', 'Dairy & Eggs', 'Meat & Fish'];
    
    categories.forEach(cat => {
        const catOffers = listings.filter(l => l.category === cat);
        let activeCount = 0;
        let savedKg = 0.0;
        let co2Kg = 0;
        let revenue = 0;
        let totalCreated = 0;

        catOffers.forEach(l => {
            totalCreated += l.original_quantity_kg;
            if (l.status === 'active') activeCount++;
            
            const claims = reservations.filter(r => r.listing_id === l.id && r.status === 'confirmed');
            let claimedQty = 0;
            claims.forEach(rc => {
                claimedQty += rc.quantity;
                revenue += (l.current_price / l.quantity_total) * rc.quantity;
            });

            const ratio = claimedQty / l.quantity_total;
            savedKg += ratio * l.original_quantity_kg;
        });

        co2Kg = savedKg * 2.5;
        const rescueRate = totalCreated > 0 ? (savedKg / totalCreated * 100) : 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${cat}</strong></td>
            <td>${activeCount} active</td>
            <td>${savedKg.toFixed(1)} kg</td>
            <td>${co2Kg.toFixed(1)} kg</td>
            <td><strong>${Math.round(revenue).toLocaleString()} DZD</strong></td>
            <td><span class="status-pill available">${rescueRate.toFixed(1)}%</span></td>
        `;
        body.appendChild(row);
    });
}

function renderAdminLeaderboard() {
    const container = document.getElementById('admin-leaderboard-list');
    container.innerHTML = '';

    // Calculate impact per partner
    const scores = partners.map(p => {
        let meals = 0;
        let kg = 0.0;
        const storeOffers = listings.filter(l => l.partner_id === p.id);
        
        storeOffers.forEach(l => {
            const claims = reservations.filter(r => r.listing_id === l.id && r.status === 'confirmed');
            claims.forEach(rc => {
                meals += rc.quantity;
                kg += rc.quantity * (l.original_quantity_kg / l.quantity_total);
            });
        });

        return { partner: p, meals, kg };
    }).sort((a,b) => b.meals - a.meals);

    scores.forEach((s, idx) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-row-item';
        
        let rankClass = `rank-${idx + 1}`;
        
        item.innerHTML = `
            <div class="leaderboard-rank-badge ${rankClass}">${idx + 1}</div>
            <div class="leaderboard-details">
                <div class="leaderboard-title-name">${escapeHtml(s.partner.name)}</div>
                <div class="leaderboard-subtitle-tag">${s.partner.type} · ${s.partner.district}</div>
            </div>
            <div class="leaderboard-impact-values">
                <div class="leaderboard-saved-counter">${s.meals} meals saved</div>
                <div class="leaderboard-saved-kg">${s.kg.toFixed(1)} kg redirected</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderUserLeaderboard() {
    const container = document.getElementById('user-leaderboard-list');
    container.innerHTML = '';

    // Re-use admin ranking function logic but smaller render template
    const scores = partners.map(p => {
        let meals = 0;
        let kg = 0.0;
        const storeOffers = listings.filter(l => l.partner_id === p.id);
        
        storeOffers.forEach(l => {
            const claims = reservations.filter(r => r.listing_id === l.id && r.status === 'confirmed');
            claims.forEach(rc => {
                meals += rc.quantity;
                kg += rc.quantity * (l.original_quantity_kg / l.quantity_total);
            });
        });

        return { partner: p, meals, kg };
    }).sort((a,b) => b.meals - a.meals).slice(0, 5);

    scores.forEach((s, idx) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-row-item';
        
        let rankClass = `rank-${idx + 1}`;
        
        item.innerHTML = `
            <div class="leaderboard-rank-badge ${rankClass}">${idx + 1}</div>
            <div class="leaderboard-details">
                <div class="leaderboard-title-name">${escapeHtml(s.partner.name)}</div>
                <div class="leaderboard-subtitle-tag">${s.partner.type} · ${s.partner.cuisine_type || 'Eco-Partner'}</div>
            </div>
            <div class="leaderboard-impact-values">
                <div class="leaderboard-saved-counter">${s.meals} meals saved</div>
                <div class="leaderboard-saved-kg">${s.kg.toFixed(1)} kg saved</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderAdminPredictionsList() {
    const container = document.getElementById('admin-predictions-list');
    container.innerHTML = '';

    predictions.forEach(p => {
        const partner = partners.find(pt => pt.id === p.partner_id) || { name: 'Merchant Partner' };
        const card = document.createElement('div');
        card.className = 'prediction-card-item';

        card.innerHTML = `
            <div>
                <div class="prediction-dish-title">${escapeHtml(p.dish_name)}</div>
                <div class="prediction-date-sub">Merchant: <strong>${escapeHtml(partner.name)}</strong> · Forecast Date: ${p.predicted_date}</div>
            </div>
            <div class="prediction-stats-middle">
                <div class="prediction-qty-kg">${p.predicted_waste_kg} kg</div>
                <div class="prediction-label-sub">predicted surplus risk</div>
            </div>
            <div class="prediction-right-badge">
                <span class="risk-level-badge ${p.risk_level}">${p.risk_level} risk</span>
                <div class="prediction-confidence">confidence: ${Math.round(p.confidence_score * 100)}%</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// User active offers feed grid
let feedActiveFilter = 'All';

function renderUserFeedGrid() {
    const grid = document.getElementById('offers-feed-grid');
    grid.innerHTML = '';

    const activeListings = listings.filter(l => l.status === 'active' && l.quantity_remaining > 0);
    
    // Filters
    const categories = ['All', 'Prepared Meals', 'Bakery & Bread', 'Produce', 'Dairy & Eggs', 'Meat & Fish'];
    const filterBar = document.getElementById('category-filter-bar');
    filterBar.innerHTML = categories.map(cat => `
        <button class="filter-tab-btn ${feedActiveFilter === cat ? 'active' : ''}" onclick="applyFeedFilter('${cat}')">
            ${cat === 'All' ? '🥗 Tout' : cat}
        </button>
    `).join('');

    const filtered = feedActiveFilter === 'All' ? activeListings : activeListings.filter(l => l.category === feedActiveFilter);
    
    document.getElementById('user-feed-badge').textContent = `${filtered.length} offers active`;

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary);">Aucun surplus disponible dans cette catégorie. Ré-essayez plus tard !</div>';
        return;
    }

    filtered.forEach(o => {
        const store = partners.find(p => p.id === o.partner_id) || { name: 'Restaurateur' };
        const card = document.createElement('div');
        card.className = 'offer-card';
        card.onclick = () => openClaimModal(o.id);
        
        const discPct = Math.round((o.original_price - o.current_price) / o.original_price * 100);
        const expMins = Math.max(0, Math.round((o.expires_at - Date.now()) / 60000));
        const expText = expMins > 60 ? `${Math.floor(expMins/60)}h remaining` : `${expMins}m remaining`;

        card.innerHTML = `
            <div class="offer-card-visual">
                <span>${getCategoryEmoji(o.category)}</span>
                <div class="discount-tag">-${discPct}%</div>
                <div class="time-left-tag">⏰ ${expText}</div>
            </div>
            <div class="offer-card-content">
                <div class="offer-title">${escapeHtml(o.title)}</div>
                <div class="offer-restaurant">🏪 ${escapeHtml(store.name)} · ${store.district}</div>
                <div class="offer-card-footer">
                    <div class="price-stack">
                        <span class="current-price">${o.current_price} DZD</span>
                        <span class="original-price">${o.original_price} DZD</span>
                    </div>
                    <span class="qty-remaining">${o.quantity_remaining} left</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function applyFeedFilter(cat) {
    feedActiveFilter = cat;
    renderUserFeedGrid();
}

function getCategoryEmoji(cat) {
    const map = {
        'Prepared Meals': '🍲',
        'Bakery & Bread': '🥖',
        'Produce': '🍌',
        'Dairy & Eggs': '🥚',
        'Meat & Fish': '🥩'
    };
    return map[cat] || '🍽️';
}

function updateBadgesUI(mealsCount) {
    const badgeRookie = document.getElementById('badge-rookie');
    const badgeSaver = document.getElementById('badge-saver');
    const badgeChampion = document.getElementById('badge-champion');
    const badgeLegend = document.getElementById('badge-legend');

    badgeRookie.classList.remove('unlocked');
    badgeSaver.classList.remove('unlocked');
    badgeChampion.classList.remove('unlocked');
    badgeLegend.classList.remove('unlocked');

    if (mealsCount >= 1) badgeRookie.classList.add('unlocked');
    if (mealsCount >= 5) badgeSaver.classList.add('unlocked');
    if (mealsCount >= 10) badgeChampion.classList.add('unlocked');
    if (mealsCount >= 20) badgeLegend.classList.add('unlocked');
}

// Helper to escape HTML tags for safety
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Helper to log in the virtual terminal window
function logTerminal(type, message) {
    const logBody = document.getElementById('log-body');
    if (!logBody) return;

    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = 'log-line';

    if (type === 'SUCCESS') {
        line.innerHTML = `<span class="text-success">[SUCCESS]</span> ${timestamp} - ${message}`;
    } else if (type === 'ERROR') {
        line.innerHTML = `<span class="text-red">[ERROR]</span> ${timestamp} - ${message}`;
    } else if (type === 'WARN') {
        line.innerHTML = `<span class="text-warn">[WARNING]</span> ${timestamp} - ${message}`;
    } else {
        line.innerHTML = `<span class="text-muted">[INFO]</span> ${timestamp} - ${message}`;
    }

    logBody.appendChild(line);
    
    // Auto-scroll to bottom
    logBody.scrollTop = logBody.scrollHeight;

    // Prune logs if too many
    while (logBody.children.length > 50) {
        logBody.removeChild(logBody.firstChild);
    }
}

// ===========================================================================
// MAP INTEGRATION & HEATMAPS
// ===========================================================================

function renderMap(mapType) {
    if (mapType === 'admin') {
        const mapDiv = document.getElementById('admin-heatmap-container');
        if (!mapDiv) return;

        if (!adminMap) {
            adminMap = L.map('admin-heatmap-container').setView([35.6976, -0.6337], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© SavePlate Maps'
            }).addTo(adminMap);
        }
        
        // Clear layers
        adminMap.eachLayer(l => { if (l instanceof L.Circle || l instanceof L.Marker) adminMap.removeLayer(l); });
        
        // Add active offers markers
        listings.filter(o => o.status === 'active' && o.quantity_remaining > 0).forEach(o => {
            const store = partners.find(p => p.id === o.partner_id);
            if (store) {
                const mark = L.circleMarker([store.lat, store.lng], {
                    radius: 8,
                    fillColor: '#23c96e',
                    color: '#0d1a13',
                    weight: 2,
                    fillOpacity: 0.9
                }).addTo(adminMap);
                mark.bindPopup(`<strong>${escapeHtml(o.title)}</strong><br><span style="color:#23c96e">${escapeHtml(store.name)}</span><br>${o.quantity_remaining} left`);
            }
        });

        // Add waste zones highlights (Admin analytics Heatmap)
        partners.forEach(p => {
            const circleColor = p.avg_waste_kg > 15.0 ? '#e84d4d' : '#f57c2b';
            const radius = p.avg_waste_kg * 12;
            L.circle([p.lat, p.lng], {
                color: circleColor,
                fillColor: circleColor,
                fillOpacity: 0.15,
                radius: radius,
                weight: 1
            }).addTo(adminMap);
        });

        adminMap.invalidateSize();
    } else if (mapType === 'user') {
        const mapDiv = document.getElementById('user-map-container');
        if (!mapDiv) return;

        if (!userMap) {
            userMap = L.map('user-map-container').setView([35.6976, -0.6337], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© SavePlate Maps'
            }).addTo(userMap);
        }

        userMap.eachLayer(l => { if (l instanceof L.Circle || l instanceof L.Marker) userMap.removeLayer(l); });

        // Add active offers markers
        listings.filter(o => o.status === 'active' && o.quantity_remaining > 0).forEach(o => {
            const store = partners.find(p => p.id === o.partner_id);
            if (store) {
                const mark = L.circleMarker([store.lat, store.lng], {
                    radius: 9,
                    fillColor: '#23c96e',
                    color: '#0d1a13',
                    weight: 2,
                    fillOpacity: 0.95
                }).addTo(userMap);
                
                mark.bindPopup(`
                    <div style="font-family:'DM Sans', sans-serif;">
                        <strong>${escapeHtml(o.title)}</strong><br>
                        <span style="color:#23c96e">${escapeHtml(store.name)}</span><br>
                        <strong>Price: ${o.current_price} DZD</strong> · ${o.quantity_remaining} items left<br>
                        <button onclick="openClaimModal('${o.id}')" style="margin-top:8px; width:100%; border:none; background:#23c96e; color:#060b09; padding:5px; border-radius:4px; font-weight:700; cursor:pointer;">Claim Item</button>
                    </div>
                `);
            }
        });

        userMap.invalidateSize();
    }
}

// ===========================================================================
// CHARTS DEFINITION (Chart.js)
// ===========================================================================

function updateCharts() {
    // 1. ADMIN SOCIAL: PIE CHART
    // Accumulate total reservations per beneficiary demographic
    let claimShare = { Homeless: 0, Student: 0, 'Low Income': 0, Other: 0 };
    reservations.filter(r => r.status === 'confirmed').forEach(r => {
        const usr = users.find(u => u.id === r.consumer_id);
        if (usr && claimShare[usr.beneficiary_type] !== undefined) {
            claimShare[usr.beneficiary_type] += r.quantity;
        }
    });

    const ctxSocialPie = document.getElementById('admin-chart-social-pie');
    if (ctxSocialPie) {
        if (charts.socialPie) charts.socialPie.destroy();
        charts.socialPie = new Chart(ctxSocialPie, {
            type: 'pie',
            data: {
                labels: ['Homeless / SDF', 'Students', 'Low Income', 'Others'],
                datasets: [{
                    data: [claimShare.Homeless, claimShare.Student, claimShare['Low Income'], claimShare.Other],
                    backgroundColor: ['#e84d4d', '#818cf8', '#23c96e', '#f5c842'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#8aa594', font: { family: 'DM Sans' } } }
                }
            }
        });
    }

    // 2. ADMIN SOCIAL: BAR CHART (Demo values for hackathon)
    const ctxSocialBar = document.getElementById('admin-chart-social-bar');
    if (ctxSocialBar) {
        if (charts.socialBar) charts.socialBar.destroy();
        charts.socialBar = new Chart(ctxSocialBar, {
            type: 'bar',
            data: {
                labels: ['Homeless', 'Students', 'Low Income', 'Others'],
                datasets: [{
                    label: 'Recovery success rate (%)',
                    data: [100, 70, 80, 40],
                    backgroundColor: ['#e84d4d', '#818cf8', '#23c96e', '#f5c842'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#8aa594', font: { family: 'DM Sans' } } },
                    y: { max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8aa594' } }
                }
            }
        });
    }

    // 3. ADMIN SOCIAL: TIMELINE (Temporal evolution line chart)
    const ctxSocialTime = document.getElementById('admin-chart-social-timeline');
    if (ctxSocialTime) {
        if (charts.socialTime) charts.socialTime.destroy();
        charts.socialTime = new Chart(ctxSocialTime, {
            type: 'line',
            data: {
                labels: ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today'],
                datasets: [
                    {
                        label: 'Food Surplus Created (kg)',
                        data: [120, 145, 130, 165, 150, 190, listings.reduce((s,l)=>s+l.original_quantity_kg, 0)],
                        borderColor: '#818cf8',
                        backgroundColor: 'rgba(129, 140, 248, 0.05)',
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Food Surplus Claimed (kg)',
                        data: [85, 110, 95, 130, 115, 145, reservations.filter(r=>r.status==='confirmed').reduce((s,r) => {
                            const l = listings.find(ls => ls.id === r.listing_id);
                            const w = l ? (l.original_quantity_kg / l.quantity_total) * r.quantity : 0;
                            return s + w;
                        }, 0)],
                        borderColor: '#23c96e',
                        backgroundColor: 'rgba(35, 201, 110, 0.05)',
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#8aa594', font: { family: 'DM Sans' } } }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#8aa594' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8aa594' } }
                }
            }
        });
    }

    // 4. BUSINESS: WASTE DAYS
    const ctxWasteDay = document.getElementById('business-chart-waste-day');
    if (ctxWasteDay) {
        if (charts.wasteDay) charts.wasteDay.destroy();
        charts.wasteDay = new Chart(ctxWasteDay, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Waste Volume (kg)',
                    data: activeMerchantId === 'p1' ? [3.2, 4.5, 8.5, 3.8, 5.2, 2.1, 1.5] : [8.5, 12.0, 15.0, 10.2, 14.5, 6.4, 4.0],
                    backgroundColor: '#f57c2b',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#8aa594' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8aa594' } }
                }
            }
        });
    }

    // 5. BUSINESS: WASTE HOURS
    const ctxWasteHour = document.getElementById('business-chart-waste-hour');
    if (ctxWasteHour) {
        if (charts.wasteHour) charts.wasteHour.destroy();
        charts.wasteHour = new Chart(ctxWasteHour, {
            type: 'line',
            data: {
                labels: ['08:00', '12:00', '15:00', '18:00', '21:00'],
                datasets: [{
                    label: 'Surplus Releases Count',
                    data: activeMerchantId === 'p1' ? [1, 4, 2, 8, 3] : [2, 7, 4, 12, 6],
                    borderColor: '#23c96e',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#8aa594' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8aa594' } }
                }
            }
        });
    }

    // 6. BUSINESS: WASTE PRODUCTS
    const ctxWasteProds = document.getElementById('business-chart-waste-products');
    if (ctxWasteProds) {
        if (charts.wasteProds) charts.wasteProds.destroy();
        
        let pLabels = activeMerchantId === 'p1' ? ['Baguettes', 'Croissants', 'Sourdough', 'Sandwiches', 'Other'] : ['Meals', 'Sides', 'Breads', 'Desserts', 'Other'];
        let pData = activeMerchantId === 'p1' ? [35, 25, 20, 15, 5] : [45, 20, 15, 10, 10];

        charts.wasteProds = new Chart(ctxWasteProds, {
            type: 'doughnut',
            data: {
                labels: pLabels,
                datasets: [{
                    data: pData,
                    backgroundColor: ['#f57c2b', '#23c96e', '#818cf8', '#f5c842', '#e84d4d'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#8aa594', font: { family: 'DM Sans' } } }
                },
                cutout: '60%'
            }
        });
    }
}

// ===========================================================================
// MODALS MANAGEMENT & OPERATIONS
// ===========================================================================

function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// Merchant: Publish Offer Form Submission
function openPublishModal() {
    // Clear inputs
    document.getElementById('form-publish-title').value = '';
    document.getElementById('form-publish-desc').value = '';
    document.getElementById('form-publish-price-orig').value = '';
    document.getElementById('form-publish-price-sale').value = '';
    document.getElementById('form-publish-qty').value = '5';
    
    openModal('modal-publish-offer');
}

function submitNewOffer() {
    const title = document.getElementById('form-publish-title').value;
    const desc = document.getElementById('form-publish-desc').value;
    const origPrice = parseFloat(document.getElementById('form-publish-price-orig').value);
    const salePrice = parseFloat(document.getElementById('form-publish-price-sale').value);
    const qty = parseInt(document.getElementById('form-publish-qty').value);
    const cat = document.getElementById('form-publish-category').value;
    const expiresHours = parseInt(document.getElementById('form-publish-expires').value);

    // Assertions validation
    if (!title || isNaN(origPrice) || isNaN(salePrice) || isNaN(qty) || qty <= 0) {
        toast('Failed validation: missing inputs or invalid quantities.', 'error');
        logTerminal('ERROR', 'Pipeline listing publication failed: schema chk constraint violated.');
        return;
    }

    if (salePrice > origPrice) {
        toast('Failed validation: reduced price must be lower than original price.', 'error');
        return;
    }

    // Proportional weight estimation
    let weight = qty * 0.8; // default 0.8kg per unit

    const store = partners.find(p => p.id === activeMerchantId);

    const newOffer = {
        id: 'l_' + Date.now(),
        partner_id: activeMerchantId,
        title: title,
        category: cat,
        original_quantity_kg: weight,
        original_price: origPrice,
        current_price: salePrice,
        quantity_total: qty,
        quantity_remaining: qty,
        status: 'active',
        expires_at: new Date(Date.now() + 3600000 * expiresHours),
        created_at: new Date()
    };

    // Inject into listings database
    listings.unshift(newOffer);

    // Log telemetry activity
    pipelineMetrics.totalEvents++;
    pipelineMetrics.successCount++;
    pipelineMetrics.latencyHistory.push(Math.floor(Math.random() * 20) + 30);
    pipelineMetrics.latencyHistory.shift();

    logTerminal('SUCCESS', `Ingested new offer "${title}" from store "${store.name}". RLS filters passed. Rows added to public.offers.`);
    
    closeModal('modal-publish-offer');
    toast('Offre publiée avec succès ! 🎉', 'success');

    // Update charts and visuals
    updateUI();
}

// User: Claim Offer Details Popup
function openClaimModal(offerId) {
    const offer = listings.find(l => l.id === offerId);
    if (!offer) return;

    const store = partners.find(p => p.id === offer.partner_id);
    const discPct = Math.round((offer.original_price - offer.current_price) / offer.original_price * 100);
    const expMins = Math.max(0, Math.round((offer.expires_at - Date.now()) / 60000));
    const expText = expMins > 60 ? `${Math.floor(expMins/60)}h remaining` : `${expMins}m remaining`;

    const body = document.getElementById('claim-modal-body');
    body.innerHTML = `
        <div style="background:var(--bg-secondary);border:1.5px solid var(--border-color);border-radius:var(--radius-md);padding:18px;margin-bottom:14px; text-align:center;">
            <div style="font-size:3.5rem;margin-bottom:10px;">${getCategoryEmoji(offer.category)}</div>
            <p style="color:var(--text-secondary);font-size:0.92rem;line-height:1.5">${offer.description || 'Surplus frais du jour à prix mini. Contribuez à réduire le gaspillage !'}</p>
        </div>
        <div class="form-row">
            <div class="growth-metric">
                <span class="g-label">Price</span>
                <span class="g-val text-success">${offer.current_price} DZD</span>
            </div>
            <div class="growth-metric">
                <span class="g-label">Savings</span>
                <span class="g-val text-orange">-${discPct}% off</span>
            </div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary); margin-top:10px;">
            <span>Store: <strong>${escapeHtml(store.name)}</strong></span>
            <span>⏰ ${expText}</span>
        </div>
        <div style="background:rgba(35,201,110,0.06); border:1px dashed var(--border-color); border-radius:var(--radius-md); padding:12px; font-size:0.82rem; line-height:1.5; color:var(--text-secondary); margin-top:12px; text-align:center;">
            🌍 En réclamant cette offre, vous sauvez environ <strong style="color:var(--color-emerald)">~${(offer.original_quantity_kg / offer.quantity_total).toFixed(2)} kg</strong> de nourriture, évitez <strong style="color:var(--color-emerald)">~${((offer.original_quantity_kg / offer.quantity_total) * 2.5).toFixed(2)} kg CO₂</strong> et économisez <strong style="color:var(--color-emerald)">~${Math.round((offer.original_quantity_kg / offer.quantity_total) * 1000)} L d'eau</strong> !
        </div>
        <div class="form-group style="margin-top:14px;">
            <label>Quantity to Claim</label>
            <input type="number" id="form-claim-quantity" value="1" min="1" max="${offer.quantity_remaining}" style="width:100%;">
        </div>
        <button class="btn btn-primary" onclick="claimReservationSubmit('${offer.id}')" style="margin-top:12px; padding:10px; width:100%;">
            🍽️ Claim Surplus Item
        </button>
    `;
    
    openModal('modal-claim-offer');
}

function claimReservationSubmit(offerId) {
    const offer = listings.find(l => l.id === offerId);
    if (!offer) return;

    const qty = parseInt(document.getElementById('form-claim-quantity').value);
    
    if (isNaN(qty) || qty <= 0 || qty > offer.quantity_remaining) {
        toast('Quantité invalide ou insuffisante.', 'error');
        return;
    }

    // Decrement inventory stock
    offer.quantity_remaining -= qty;
    if (offer.quantity_remaining <= 0) {
        offer.status = 'saved';
    }

    // Insert reservation row
    const newRes = {
        id: 'r_u_' + Date.now(),
        listing_id: offerId,
        consumer_id: activeConsumerId,
        quantity: qty,
        status: 'confirmed',
        created_at: new Date()
    };
    reservations.push(newRes);

    // Latency Telemetry update
    pipelineMetrics.totalEvents++;
    pipelineMetrics.successCount++;
    pipelineMetrics.latencyHistory.push(Math.floor(Math.random() * 15) + 20);
    pipelineMetrics.latencyHistory.shift();

    const usr = users.find(u => u.id === activeConsumerId);
    const store = partners.find(p => p.id === offer.partner_id);
    const savedWeight = qty * (offer.original_quantity_kg / offer.quantity_total);

    logTerminal('SUCCESS', `Claim reservation processed. Beneficiary "${usr.username}" claimed ${qty} unit(s) of "${offer.title}" from "${store.name}". RLS assertions passed. public.reservations updated.`);
    
    closeModal('modal-claim-offer');
    toast('Réservation confirmée ! 🏆', 'success');

    // Update visuals
    updateUI();
    
    // Invalidate maps sizes to keep rendering correct
    if (adminMap) renderMap('admin');
    if (userMap) renderMap('user');
}

// SQL Inspector Slide-out logic
function openSqlInspector(sectionKey) {
    const data = sqlInspectorData[sectionKey];
    if (!data) return;

    document.getElementById('drawer-title').textContent = data.title;
    document.getElementById('drawer-subtitle').textContent = data.subtitle;
    document.getElementById('drawer-schema').textContent = data.schema;
    document.getElementById('drawer-query').textContent = data.query;
    document.getElementById('drawer-explanation').innerHTML = `<p>${data.explanation}</p>`;

    document.getElementById('sql-drawer').classList.add('active');
    document.getElementById('sql-drawer-backdrop').classList.add('active');

    logTerminal('INFO', `Inspected database architecture properties for table view: "${data.title}".`);
}

function closeSqlDrawer() {
    document.getElementById('sql-drawer').classList.remove('active');
    document.getElementById('sql-drawer-backdrop').classList.remove('active');
}

// Dynamic toast message popup
function toast(msg, type = 'success') {
    const toastsContainer = document.getElementById('toasts');
    if (!toastsContainer) return;

    const t = document.createElement('div');
    t.className = `toast-message ${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${msg}</span>`;
    
    toastsContainer.appendChild(t);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        t.remove();
    }, 4000);
}

// ===========================================================================
// TRAFFIC GENERATOR SIMULATOR
// ===========================================================================

function toggleSimulation() {
    const toggler = document.getElementById('demo-toggle');
    const actionsGroup = document.getElementById('sim-actions-group');
    const liveIndicator = document.getElementById('live-indicator');
    const statusLabel = document.getElementById('status-label');

    if (toggler.checked) {
        startDemoSimulation();
        actionsGroup.classList.remove('disabled');
        liveIndicator.className = 'status-indicator live';
        statusLabel.textContent = 'Sim Streaming';
        logTerminal('INFO', 'Demo simulation started. Automated pipeline traffic active.');
    } else {
        stopDemoSimulation();
        actionsGroup.classList.add('disabled');
        liveIndicator.className = 'status-indicator paused';
        statusLabel.textContent = 'Sim Paused';
        logTerminal('WARN', 'Demo simulation suspended by developer. Telemetry logs frozen.');
    }
}

function startDemoSimulation() {
    if (simulationInterval) clearInterval(simulationInterval);
    simulationInterval = setInterval(() => {
        const rand = Math.random();
        if (rand < 0.35) {
            simulateNewListing();
        } else if (rand < 0.6) {
            simulateAutoReservation();
        } else {
            simulateSyncPulse();
        }
    }, 8000); // Pulse every 8 seconds
}

function stopDemoSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
}

// 1. Auto Listings simulator
function simulateNewListing() {
    const titles = [
        { title: 'Fresh Crusty Croissants Box', cat: 'Bakery & Bread', orig: 450, sale: 150, partnerIdx: 0, weight: 4.5 },
        { title: 'Mixed Greens Salad Bowls', cat: 'Prepared Meals', orig: 800, sale: 200, partnerIdx: 2, weight: 6.0 },
        { title: 'Overripe Tomatoes Bag', cat: 'Produce', orig: 350, sale: 100, partnerIdx: 1, weight: 10.0 },
        { title: 'Assorted Dairy Cup Sets', cat: 'Dairy & Eggs', orig: 600, sale: 150, partnerIdx: 4, weight: 8.0 },
        { title: 'Wok Noodles Portions', cat: 'Prepared Meals', orig: 1000, sale: 300, partnerIdx: 3, weight: 5.5 }
    ];

    const t = titles[Math.floor(Math.random() * titles.length)];
    const store = partners[t.partnerIdx];

    const l = {
        id: 'l_sim_' + Date.now(),
        partner_id: store.id,
        title: t.title,
        category: t.cat,
        original_quantity_kg: t.weight,
        original_price: t.orig,
        current_price: t.sale,
        quantity_total: 4,
        quantity_remaining: 4,
        status: 'active',
        expires_at: new Date(Date.now() + 3600000 * 3),
        created_at: new Date()
    };

    listings.unshift(l);

    // Limit active size to keep demo clean
    if (listings.length > 15) {
        listings.pop();
    }

    pipelineMetrics.totalEvents++;
    pipelineMetrics.successCount++;
    pipelineMetrics.latencyHistory.push(Math.floor(Math.random() * 20) + 30);
    pipelineMetrics.latencyHistory.shift();

    logTerminal('SUCCESS', `Ingested simulated listing "${t.title}" (${t.weight} kg) from "${store.name}". Row added to public.offers.`);
    toast(`✅ +Offre: "${t.title}" ajouté ! Offres actives: ${listings.filter(l=>l.status==='active'&&l.quantity_remaining>0).length}`, 'success');
    
    updateUI();
    if (adminMap) renderMap('admin');
    if (userMap) renderMap('user');
}

// 2. Auto claim simulator
function simulateAutoReservation() {
    const actives = listings.filter(l => l.status === 'active' && l.quantity_remaining > 0);
    if (actives.length === 0) return;

    const o = actives[Math.floor(Math.random() * actives.length)];
    const claimQty = 1;

    o.quantity_remaining -= claimQty;
    if (o.quantity_remaining <= 0) {
        o.status = 'saved';
    }

    const randUser = users[Math.floor(Math.random() * users.length)];

    const r = {
        id: 'r_sim_' + Date.now(),
        listing_id: o.id,
        consumer_id: randUser.id,
        quantity: claimQty,
        status: 'confirmed',
        created_at: new Date()
    };

    reservations.push(r);

    pipelineMetrics.totalEvents++;
    pipelineMetrics.successCount++;
    pipelineMetrics.latencyHistory.push(Math.floor(Math.random() * 15) + 25);
    pipelineMetrics.latencyHistory.shift();

    const store = partners.find(p => p.id === o.partner_id) || { name: 'Store' };
    logTerminal('SUCCESS', `Simulated claim processed. Beneficiary "${randUser.username}" claimed ${claimQty} units of "${o.title}" from "${store.name}". public.reservations updated.`);
    
    updateUI();
    if (adminMap) renderMap('admin');
    if (userMap) renderMap('user');
}

// 3. Normal Telemetry ping
function simulateSyncPulse() {
    pipelineMetrics.totalEvents++;
    pipelineMetrics.successCount++;
    const currentLatency = Math.floor(Math.random() * 12) + 30; // 30-42ms
    pipelineMetrics.latencyHistory.push(currentLatency);
    pipelineMetrics.latencyHistory.shift();

    logTerminal('INFO', `Health Check ping. Webhook Route status: 200 OK. Database write latency: ${currentLatency}ms.`);
    updateUI();
}

// 4. Traffic Spike Trigger button
function simulateSpikeEvent() {
    logTerminal('WARN', 'Simulating high-load web traffic. Webhook event queues rising rapidly.');
    
    for (let i = 0; i < 6; i++) {
        pipelineMetrics.totalEvents++;
        pipelineMetrics.successCount++;
        pipelineMetrics.latencyHistory.push(Math.floor(Math.random() * 60) + 120);
        pipelineMetrics.latencyHistory.shift();
    }
    pipelineMetrics.activeConnections = Math.floor(Math.random() * 10) + 35; // connection load increases

    logTerminal('SUCCESS', 'Spike absorbed successfully. pgBouncer pooled connections scaled up to handle writes.');
    updateUI();
    
    // Auto-scale down connection pool after 5 seconds
    setTimeout(() => {
        pipelineMetrics.activeConnections = 14;
        updateUI();
        logTerminal('INFO', 'Pooled database connections scaled back to standard levels.');
    }, 5000);
}

// 5. Schema Anomaly injection button — toggles red DQ alert state on telemetry
let dqAlertActive = false;

function simulateDataQualityIssue() {
    dqAlertActive = !dqAlertActive;

    // Toggle red alert class on all telemetry cards
    const telCards = document.querySelectorAll('.telemetry-card');
    telCards.forEach(card => {
        if (dqAlertActive) {
            card.classList.add('dq-alert');
        } else {
            card.classList.remove('dq-alert');
        }
    });

    // Toggle DQ alert banner if it exists
    const dqBanner = document.getElementById('dq-alert-banner');
    if (dqBanner) {
        dqBanner.classList.toggle('active', dqAlertActive);
    }

    if (dqAlertActive) {
        logTerminal('ERROR', 'Schema Check violated: Constraint chk_price failed. listing_id l2 reduced price exceeds original price.');
        dataQuality.missingValues += 1;
        dataQuality.duplicatesDetected += 2;
        updateUI();

        setTimeout(() => {
            logTerminal('WARN', 'Data Engineering Pipeline: Isolating anomaly in security quarantine block. Alert dispatched.');
        }, 2000);
    } else {
        logTerminal('SUCCESS', 'Auto-cleanup script completed. Anomaly database rows scrubbed. Data Integrity restored to 100%.');
        dataQuality.missingValues = 0;
        dataQuality.duplicatesDetected = 0;
        updateUI();
    }
}
