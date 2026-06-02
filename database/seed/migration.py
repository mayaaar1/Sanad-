import psycopg2

def main():
    print("Running database migration...")
    DATABASE_URL = 'postgresql://postgres.bokxmvrzqxbmjetczxzy:_gfTYWD#&P2z.Tb@aws-0-eu-west-3.pooler.supabase.com:6543/postgres'
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    try:
        # 1. Add donor_type to restaurants table
        print("Adding donor_type to restaurants...")
        cur.execute("""
            ALTER TABLE restaurants 
            ADD COLUMN IF NOT EXISTS donor_type VARCHAR(50) DEFAULT 'restaurant' 
            CHECK (donor_type IN ('restaurant', 'hotel', 'coffee_shop', 'bakery', 'other'));
        """)
        
        # 2. Add beneficiary_type to users table
        print("Adding beneficiary_type to users...")
        cur.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS beneficiary_type VARCHAR(50) 
            CHECK (beneficiary_type IN ('student', 'homeless', 'underprivileged_family', 'other'));
        """)
        
        # 3. Create view_waste_by_dish
        print("Creating view_waste_by_dish...")
        cur.execute("""
            CREATE OR REPLACE VIEW view_waste_by_dish AS
            SELECT 
                restaurant_id,
                title AS dish_name,
                SUM(quantity_remaining) AS total_wasted_qty,
                SUM(quantity_total - quantity_remaining) AS total_saved_qty,
                ROUND((SUM(quantity_total - quantity_remaining)::numeric / NULLIF(SUM(quantity_total), 0) * 100), 2) AS success_rate_percent
            FROM offers
            WHERE expires_at < CURRENT_TIMESTAMP
            GROUP BY restaurant_id, title;
        """)
        
        conn.commit()
        print("Migration and view creation completed successfully!")
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
