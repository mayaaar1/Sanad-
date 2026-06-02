import psycopg2

def main():
    print("Applying simplified database migration...")
    DATABASE_URL = 'postgresql://postgres.bokxmvrzqxbmjetczxzy:_gfTYWD#&P2z.Tb@aws-0-eu-west-3.pooler.supabase.com:6543/postgres'
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    sql = """
    -- =========================================================================
    -- 1. GESTION DES BÉNÉFICIAIRES & ROLES SOCIAUX (Table 'users' & 'reservations')
    -- =========================================================================

    -- Mise à jour du rôle utilisateur pour inclure les associations ('charity')
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('consumer', 'restaurant', 'admin', 'charity'));

    -- Ajout de la réduction directe (ex: 80 pour 80% de réduction) sur les utilisateurs
    ALTER TABLE users ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (discount_percentage BETWEEN 0 AND 100);

    -- Ajout des champs optionnels pour le nom du bénéficiaire indirect et le prix payé
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS beneficiary_name VARCHAR(255);
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS price_paid NUMERIC(10,2) DEFAULT 0.00;

    -- =========================================================================
    -- 2. CHAMPS D'ENTRÉE DU MODÈLE IA (Table 'restaurants')
    -- =========================================================================
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS storage_facility_quality INT DEFAULT 5 CHECK (storage_facility_quality BETWEEN 1 AND 10);
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS staff_training_level INT DEFAULT 5 CHECK (staff_training_level BETWEEN 1 AND 10);
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS waste_segregation_score NUMERIC(5,2) DEFAULT 50.0 CHECK (waste_segregation_score BETWEEN 0 AND 100);
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS recycling_rate_percent NUMERIC(5,2) DEFAULT 25.0 CHECK (recycling_rate_percent BETWEEN 0 AND 100);
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS city_zone VARCHAR(50);
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS establishment_type VARCHAR(50);
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS composting_available BOOLEAN DEFAULT FALSE;
    ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS donation_programs BOOLEAN DEFAULT FALSE;

    -- =========================================================================
    -- 3. TABLES DE PRÉDICTION IA (Traduites pour PostgreSQL & Supabase)
    -- =========================================================================

    -- Table historique d'entraînement du modèle
    CREATE TABLE IF NOT EXISTS daily_waste_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        record_date TIMESTAMP NOT NULL,
        food_waste_kg NUMERIC(8,2) NOT NULL,
        avg_temperature NUMERIC(5,2),
        humidity_percent NUMERIC(5,2),
        population_density INT,
        waste_cause_primary VARCHAR(100),
        food_type_wasted VARCHAR(100),
        meal_period VARCHAR(50),
        solution_implemented VARCHAR(100),
        solution_effectiveness_score NUMERIC(5,2),
        
        -- Génération automatique des time features (PostgreSQL)
        hour INTEGER GENERATED ALWAYS AS (EXTRACT(HOUR FROM record_date)::INTEGER) STORED,
        day_of_week_int INTEGER GENERATED ALWAYS AS (EXTRACT(ISODOW FROM record_date)::INTEGER) STORED,
        month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM record_date)::INTEGER) STORED,
        season VARCHAR(20) GENERATED ALWAYS AS (
            CASE
                WHEN EXTRACT(MONTH FROM record_date) IN (12,1,2) THEN 'Winter'
                WHEN EXTRACT(MONTH FROM record_date) IN (3,4,5) THEN 'Spring'
                WHEN EXTRACT(MONTH FROM record_date) IN (6,7,8) THEN 'Summer'
                ELSE 'Autumn'
            END
        ) STORED,
        is_weekend BOOLEAN GENERATED ALWAYS AS (EXTRACT(ISODOW FROM record_date) IN (6,7)) STORED,
        is_rush_hour BOOLEAN GENERATED ALWAYS AS (EXTRACT(HOUR FROM record_date) BETWEEN 17 AND 20) STORED
    );

    -- Extension de la table predictions avec les calculs écologiques
    ALTER TABLE waste_predictions ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH'));
    ALTER TABLE waste_predictions ADD COLUMN IF NOT EXISTS recommendation TEXT;
    ALTER TABLE waste_predictions ADD COLUMN IF NOT EXISTS action_taken BOOLEAN DEFAULT FALSE;
    ALTER TABLE waste_predictions ADD COLUMN IF NOT EXISTS actual_waste_kg DOUBLE PRECISION;
    ALTER TABLE waste_predictions ADD COLUMN IF NOT EXISTS co2_saved_kg DOUBLE PRECISION GENERATED ALWAYS AS (predicted_waste_kg * 2.5) STORED;
    ALTER TABLE waste_predictions ADD COLUMN IF NOT EXISTS water_saved_liters DOUBLE PRECISION GENERATED ALWAYS AS (predicted_waste_kg * 1000.0) STORED;
    ALTER TABLE waste_predictions ADD COLUMN IF NOT EXISTS meals_saved DOUBLE PRECISION GENERATED ALWAYS AS (predicted_waste_kg / 0.5) STORED;

    -- Table de feedback du modèle
    CREATE TABLE IF NOT EXISTS model_feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        prediction_id UUID NOT NULL REFERENCES waste_predictions(id) ON DELETE CASCADE,
        actual_waste_kg DOUBLE PRECISION NOT NULL,
        was_accurate BOOLEAN,
        feedback_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- =========================================================================
    -- 4. VUE DE PRIORISATION SOCIALE POUR L'INTERFACE RESTAURANT
    -- =========================================================================
    CREATE OR REPLACE VIEW view_pending_reservations_prioritized AS
    SELECT 
        r.id AS reservation_id,
        r.offer_id,
        r.quantity,
        r.status AS reservation_status,
        r.created_at AS reserved_at,
        r.price_paid,
        r.beneficiary_name,
        u.email AS consumer_email,
        u.role AS consumer_role,
        u.beneficiary_type,
        u.discount_percentage,
        CASE 
            WHEN u.role = 'charity' THEN 5                 -- Réservé par une asso (Priorité Max)
            WHEN u.beneficiary_type = 'homeless' THEN 5      -- Client direct SDF (Priorité Max)
            WHEN u.beneficiary_type = 'underprivileged_family' THEN 4
            WHEN u.beneficiary_type = 'student' THEN 3
            ELSE 1 -- Consommateur régulier
        END AS social_priority_level
    FROM reservations r
    JOIN users u ON r.consumer_id = u.id
    WHERE r.status = 'pending'
    ORDER BY social_priority_level DESC, r.created_at ASC;
    """
    
    try:
        cur.execute(sql)
        conn.commit()
        print("Migration applied successfully!")
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
