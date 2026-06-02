#!/usr/bin/env python3
"""
SavePlate / SANAS Database Seeding Script (Production Ready for Hackathon)
Generates realistic, coherent mock data for a 48-hour hackathon demo.
Includes:
- Donors: Restaurants, Hotels, Bakeries, Coffee shops (with quality metrics for AI model)
- Beneficiaries: Students (70% off), Underprivileged families (80% off), Homeless (100% free), Others
- Charities: NGO accounts that place proxy reservations for homeless beneficiaries
- AI Prediction tables: daily_waste_records, waste_predictions, model_feedback
"""

import os
import sys
import random
from datetime import datetime, timedelta
import pytz
import psycopg2
from faker import Faker

# Initialize Faker
fake = Faker(['fr_FR'])

# Get database connection string from environment
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres.bokxmvrzqxbmjetczxzy:_gfTYWD#&P2z.Tb@aws-0-eu-west-3.pooler.supabase.com:6543/postgres"
)

# Constants for Algiers coordinate bounding box
ALGIERS_CENTER_LAT = 36.7538
ALGIERS_CENTER_LNG = 3.0588
LAT_OFFSET = 0.04
LNG_OFFSET = 0.05

CUISINE_TYPES = [
    'Boulangerie', 'Traditionnel Algérien', 'Fast Food', 
    'Pizzeria', 'Cafétéria', 'Sushi Bar', 'Traiteur', 'Supermarché'
]

DISH_NAMES = {
    'Boulangerie': ['Panier Viennoiseries', 'Pain Artisanal & Baguettes', 'Tartes aux fruits', 'Croissants Choc'],
    'Traditionnel Algérien': ['Portion Bourek & Chorba', 'Couscous Poulet', 'Tajine Zitoun', 'Rechta Poulet'],
    'Fast Food': ['Menu Tacos XL', 'Burger Double Fromage', 'Panini Poulet Frites', 'Sandwich Chawarma'],
    'Pizzeria': ['Pizza Margherita Duo', 'Pizza Quatre Fromages', 'Pizza Royale', 'Calzone Poulet'],
    'Cafétéria': ['Panier Donuts & Muffins', 'Cheesecake Citron', 'Gâteau au Chocolat Portion', 'Sandwich Club'],
    'Sushi Bar': ['Plateau Maki Varié 12pcs', 'Box Sushi Saumon', 'California Roll 10pcs', 'Nouilles Sautées Poulet'],
    'Traiteur': ['Plat du Jour Viande', 'Salade Composée Buffet', 'Brochettes Poulet Grillé', 'Gratin Dauphinois'],
    'Supermarché': ['Panier Laitiers Proche DLC', 'Fruits et Légumes Moches', 'Assortiment Biscuits', 'Jus de fruits frais']
}

# Standard password hash for 'password123' (bcrypt)
DEFAULT_PASSWORD_HASH = "$2b$12$eImiTXuWVxfM37uY4bDfVexX.tZ3e83n0.Z4N7O4m9t/64/S2F24W"

def get_algiers_coords():
    """Generates random coordinates within Algiers metropolitan area."""
    lat = random.uniform(ALGIERS_CENTER_LAT - LAT_OFFSET, ALGIERS_CENTER_LAT + LAT_OFFSET)
    lng = random.uniform(ALGIERS_CENTER_LNG - LNG_OFFSET, ALGIERS_CENTER_LNG + LNG_OFFSET)
    return lat, lng

def main():
    print("Connecting to PostgreSQL...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = False
        cur = conn.cursor()
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

    print("Successfully connected to database.")

    try:
        # 1. Truncate existing data to start clean
        print("Cleaning old records...")
        cur.execute("TRUNCATE TABLE users, restaurants, offers, reservations, impact_logs, waste_predictions, impact_summary, daily_waste_records, model_feedback CASCADE;")
        
        # Re-initialize summary table
        cur.execute("""
            INSERT INTO impact_summary (key, value) VALUES
            ('total_meals_saved', 0.0),
            ('total_co2_saved_g', 0.0),
            ('total_water_saved_liters', 0.0),
            ('total_financial_saved', 0.0)
            ON CONFLICT (key) DO NOTHING;
        """)

        # 2. Generate Admin User
        print("Generating Admin...")
        cur.execute(
            "INSERT INTO users (email, password_hash, role, lat, lng) VALUES (%s, %s, %s, %s, %s) RETURNING id;",
            ("admin@saveplate.dz", DEFAULT_PASSWORD_HASH, "admin", ALGIERS_CENTER_LAT, ALGIERS_CENTER_LNG)
        )

        # 3. Generate Donors (Restaurants, Hotels, Bakeries, Cafés)
        print("Generating Donors...")
        restaurant_ids = [] # Holds tuple (id, cuisine_type, lat, lng, name)
        
        donor_configs = [
            # 4 Restaurants
            ('restaurant', 'Traditionnel Algérien', 'Le Palmier d\'Alger'),
            ('restaurant', 'Fast Food', 'Crousty Burger'),
            ('restaurant', 'Pizzeria', 'Pizzeria Bella Ciao'),
            ('restaurant', 'Sushi Bar', 'Wasabi Sushi'),
            # 4 Hôtels
            ('hotel', 'Traiteur', 'Hôtel El Djazair'),
            ('hotel', 'Traiteur', 'Hôtel Sofitel Algiers'),
            ('hotel', 'Traditionnel Algérien', 'Hôtel El Aurassi'),
            ('hotel', 'Traiteur', 'Hôtel Mercure Aéroport'),
            # 2 Cafés
            ('coffee_shop', 'Cafétéria', 'Espresso Café'),
            ('coffee_shop', 'Cafétéria', 'Café Crème Port d\'Alger'),
            # 2 Boulangeries
            ('bakery', 'Boulangerie', 'La Parisienne Baguette'),
            ('bakery', 'Boulangerie', 'Boulangerie de l\'Étoile')
        ]
        
        for idx, (est_type, cuisine, name) in enumerate(donor_configs):
            email = f"donor{idx+1}@saveplate.dz"
            lat, lng = get_algiers_coords()
            
            # Create user
            cur.execute(
                "INSERT INTO users (email, password_hash, role, lat, lng) VALUES (%s, %s, %s, %s, %s) RETURNING id;",
                (email, DEFAULT_PASSWORD_HASH, "restaurant", lat, lng)
            )
            user_id = cur.fetchone()[0]
            
            # Create restaurant metadata (with AI fields)
            address = f"{random.randint(1, 150)} Rue de la Palestine, Alger"
            avg_waste = random.uniform(10.0, 45.0)
            
            # AI quality parameters
            quality = random.randint(6, 10)
            training = random.randint(5, 9)
            segregation = random.uniform(60.0, 95.0)
            recycling = random.uniform(15.0, 45.0)
            city_zone = random.choice(['Alger Centre', 'Hydra', 'Bab El Oued', 'El Biar'])
            composting = random.choice([True, False])
            donations = True # Since they use our app!
            
            cur.execute("""
                INSERT INTO restaurants (
                    user_id, name, address, lat, lng, cuisine_type, avg_waste_kg, donor_type,
                    storage_facility_quality, staff_training_level, waste_segregation_score,
                    recycling_rate_percent, city_zone, establishment_type, composting_available, donation_programs
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
            """, (
                user_id, name, address, lat, lng, cuisine, avg_waste, est_type,
                quality, training, segregation, recycling, city_zone, est_type, composting, donations
            ))
            rest_id = cur.fetchone()[0]
            restaurant_ids.append((rest_id, cuisine, lat, lng, name))

        # 4. Generate Consumers (Students, Underprivileged Families, Homeless, Regulars)
        print("Generating Consumers...")
        consumer_users = [] # Holds tuple (id, type, discount)
        
        # 10 Students (70% off)
        for i in range(10):
            email = f"student{i+1}@saveplate.dz"
            lat, lng = get_algiers_coords()
            cur.execute(
                "INSERT INTO users (email, password_hash, role, lat, lng, beneficiary_type, discount_percentage) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;",
                (email, DEFAULT_PASSWORD_HASH, "consumer", lat, lng, "student", 70.00)
            )
            consumer_users.append((cur.fetchone()[0], "student", 70.00))

        # 10 Underprivileged Families (80% off)
        for i in range(10):
            email = f"family{i+1}@saveplate.dz"
            lat, lng = get_algiers_coords()
            cur.execute(
                "INSERT INTO users (email, password_hash, role, lat, lng, beneficiary_type, discount_percentage) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;",
                (email, DEFAULT_PASSWORD_HASH, "consumer", lat, lng, "underprivileged_family", 80.00)
            )
            consumer_users.append((cur.fetchone()[0], "underprivileged_family", 80.00))

        # 10 Homeless (100% off)
        for i in range(10):
            email = f"homeless{i+1}@saveplate.dz"
            lat, lng = get_algiers_coords()
            cur.execute(
                "INSERT INTO users (email, password_hash, role, lat, lng, beneficiary_type, discount_percentage) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;",
                (email, DEFAULT_PASSWORD_HASH, "consumer", lat, lng, "homeless", 100.00)
            )
            consumer_users.append((cur.fetchone()[0], "homeless", 100.00))

        # 10 Regular users (0% discount)
        for i in range(10):
            email = f"regular{i+1}@saveplate.dz"
            lat, lng = get_algiers_coords()
            cur.execute(
                "INSERT INTO users (email, password_hash, role, lat, lng, beneficiary_type, discount_percentage) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;",
                (email, DEFAULT_PASSWORD_HASH, "consumer", lat, lng, "other", 0.00)
            )
            consumer_users.append((cur.fetchone()[0], "other", 0.00))

        # 5. Generate Charities (Associations)
        print("Generating Charities...")
        charity_users = []
        charity_names = [
            "Croissant Rouge Algérien",
            "Association Ness El Khir",
            "Association El Baraka"
        ]
        for name in charity_names:
            email = f"contact@{name.lower().replace(' ', '')}.org"
            lat, lng = get_algiers_coords()
            cur.execute(
                "INSERT INTO users (email, password_hash, role, lat, lng) VALUES (%s, %s, %s, %s, %s) RETURNING id;",
                (email, DEFAULT_PASSWORD_HASH, "charity", lat, lng)
            )
            charity_users.append(cur.fetchone()[0])

        # 6. Generate ML Training Data (daily_waste_records) for last 30 days
        print("Generating ML training history...")
        now = datetime.now(pytz.utc)
        
        for day_idx in range(-30, 1):
            target_date = now + timedelta(days=day_idx)
            for rest_id, _, _, _, _ in restaurant_ids:
                # Generate realistic daily food waste record
                waste = random.uniform(8.0, 38.0)
                temp = random.uniform(15.0, 32.0)
                humidity = random.uniform(50.0, 80.0)
                density = random.randint(8000, 15000)
                cause = random.choice(['Overproduction', 'Spoilage', 'Plate waste', 'Expiration'])
                food_type = random.choice(['Repas préparés', 'Boulangerie', 'Légumes/Fruits'])
                period = random.choice(['Lunch', 'Dinner', 'Breakfast'])
                solution = random.choice(['Portion Control', 'Discounting', 'Better refrigeration'])
                effectiveness = random.uniform(50.0, 95.0)
                
                cur.execute("""
                    INSERT INTO daily_waste_records (
                        restaurant_id, record_date, food_waste_kg, avg_temperature, humidity_percent,
                        population_density, waste_cause_primary, food_type_wasted, meal_period,
                        solution_implemented, solution_effectiveness_score
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, (
                    rest_id, target_date.replace(hour=21, minute=0, second=0), waste, temp, humidity,
                    density, cause, food_type, period, solution, effectiveness
                ))

        # 7. Generate Offers, AI Predictions, and Reservations
        print("Generating Offers and Reservations...")
        
        for day_idx in range(-30, 2):
            target_date = now + timedelta(days=day_idx)
            
            # Predict for each day (AI Predictions)
            for rest_id, cuisine, r_lat, r_lng, rest_name in restaurant_ids:
                predicted_waste = random.uniform(4.0, 18.0)
                confidence = random.uniform(0.70, 0.96)
                risk = 'HIGH' if predicted_waste > 12.0 else ('MEDIUM' if predicted_waste > 7.0 else 'LOW')
                reco = f"Activate flash sales for {cuisine} dishes 2 hours before expiration."
                
                cur.execute("""
                    INSERT INTO waste_predictions (restaurant_id, predicted_date, dish_name, predicted_waste_kg, confidence_score, risk_level, recommendation)
                    VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;
                """, (
                    rest_id, target_date.date(), DISH_NAMES[cuisine][0], predicted_waste, confidence, risk, reco
                ))
                pred_id = cur.fetchone()[0]

                # 80% chance of publishing an offer
                if random.random() > 0.8:
                    continue
                
                num_offers = random.randint(1, 2)
                for _ in range(num_offers):
                    title = random.choice(DISH_NAMES[cuisine])
                    description = f"Surplus frais préparé aujourd'hui chez {rest_name}. Soutenez notre action solidaire !"
                    original_price = random.choice([400, 600, 800, 1000, 1200])
                    current_price = original_price * 0.4 # 60% discount standard
                    qty_total = random.randint(2, 6)
                    
                    # Status logic based on date
                    if day_idx < 0:
                        qty_remaining = 0 if random.random() < 0.85 else random.randint(1, qty_total)
                        status = 'saved' if qty_remaining == 0 else 'expired'
                    elif day_idx == 0:
                        qty_remaining = random.randint(0, qty_total)
                        status = 'active' if qty_remaining > 0 else 'saved'
                    else:
                        qty_remaining = qty_total
                        status = 'active'
                        
                    created_time = target_date.replace(hour=random.randint(10, 18), minute=random.randint(0, 59))
                    expires_time = created_time + timedelta(hours=random.randint(2, 5))
                    
                    # Insert offer
                    cur.execute("""
                        INSERT INTO offers (restaurant_id, title, description, original_price, current_price, quantity_total, quantity_remaining, expires_at, created_at, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
                    """, (rest_id, title, description, original_price, current_price, qty_total, qty_total, expires_time, created_time, status))
                    offer_id = cur.fetchone()[0]
                    
                    # Log actual waste feedback for predictions in the past
                    if day_idx < 0:
                        actual_waste = qty_remaining * 0.5 # 1 unit = 0.5 kg
                        was_accurate = abs(predicted_waste - actual_waste) < 3.0
                        cur.execute("""
                            INSERT INTO model_feedback (prediction_id, actual_waste_kg, was_accurate)
                            VALUES (%s, %s, %s);
                        """, (pred_id, actual_waste, was_accurate))
                        
                        # Update prediction with actual waste
                        cur.execute("""
                            UPDATE waste_predictions SET actual_waste_kg = %s, action_taken = TRUE WHERE id = %s;
                        """, (actual_waste, pred_id))

                    # Generate reservations for past/present offers
                    if day_idx <= 0:
                        qty_reserved = qty_total - qty_remaining
                        claimed = 0
                        while claimed < qty_reserved:
                            qty_user = random.randint(1, min(2, qty_reserved - claimed))
                            res_created = created_time + timedelta(minutes=random.randint(10, 90))
                            res_confirmed = res_created + timedelta(minutes=random.randint(15, 60))
                            
                            # Decide booking mode: 40% chance of Charity booking for a homeless beneficiary
                            is_charity_booking = random.random() < 0.4
                            
                            if is_charity_booking:
                                # Booked by a charity
                                charity_id = random.choice(charity_users)
                                beneficiary_name = f"Sans-abri Alger Centre ({fake.first_name()})"
                                price_paid = 0.00 # 100% Free
                                
                                cur.execute("""
                                    INSERT INTO reservations (offer_id, consumer_id, quantity, status, created_at, beneficiary_name, price_paid)
                                    VALUES (%s, %s, %s, 'pending', %s, %s, %s) RETURNING id;
                                """, (offer_id, charity_id, qty_user, res_created, beneficiary_name, price_paid))
                            else:
                                # Booked directly by a consumer
                                user_id, user_type, discount = random.choice(consumer_users)
                                beneficiary_name = None
                                price_paid = current_price * (1.0 - (discount / 100.0))
                                
                                cur.execute("""
                                    INSERT INTO reservations (offer_id, consumer_id, quantity, status, created_at, beneficiary_name, price_paid)
                                    VALUES (%s, %s, %s, 'pending', %s, %s, %s) RETURNING id;
                                """, (offer_id, user_id, qty_user, res_created, beneficiary_name, price_paid))
                            
                            res_id = cur.fetchone()[0]
                            
                            # Now confirm it (fires trigger to calculate environmental impact)
                            if day_idx < 0 or (day_idx == 0 and random.random() < 0.9):
                                cur.execute("""
                                    UPDATE reservations 
                                    SET status = 'confirmed', confirmed_at = %s 
                                    WHERE id = %s;
                                """, (res_confirmed, res_id))
                            else:
                                if random.random() < 0.2:
                                    cur.execute("""
                                        UPDATE reservations 
                                        SET status = 'cancelled' 
                                        WHERE id = %s;
                                    """, (res_id,))
                            
                            claimed += qty_user

        conn.commit()
        print("Data seeding completed successfully!")
        
        # 8. Print statistics
        cur.execute("SELECT COUNT(*) FROM users;")
        print(f"Seeded Users: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM restaurants;")
        print(f"Seeded Establishments (Restaurants/Hotels/Bakeries): {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM offers;")
        print(f"Seeded Offers: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM reservations;")
        print(f"Seeded Reservations: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM daily_waste_records;")
        print(f"Seeded ML Daily Waste Records: {cur.fetchone()[0]}")
        cur.execute("SELECT COUNT(*) FROM waste_predictions;")
        print(f"Seeded AI Waste Predictions: {cur.fetchone()[0]}")
        
        print("\n--- Live Global Counters via Triggers ---")
        cur.execute("SELECT key, value FROM impact_summary;")
        for row in cur.fetchall():
            print(f"- {row[0]}: {row[1]:,.2f}")

    except Exception as e:
        conn.rollback()
        print(f"Error during seeding: {e}")
        sys.exit(1)
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
