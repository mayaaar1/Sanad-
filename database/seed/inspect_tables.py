import psycopg2

def inspect_table(cur, table_name):
    print(f"\nStructure of '{table_name}':")
    cur.execute(f"""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = '{table_name}'
        ORDER BY ordinal_position;
    """)
    for col, type_, nullable, default in cur.fetchall():
        print(f"  - {col} ({type_}) | Nullable: {nullable} | Default: {default}")

def main():
    DATABASE_URL = 'postgresql://postgres.bokxmvrzqxbmjetczxzy:_gfTYWD#&P2z.Tb@aws-0-eu-west-3.pooler.supabase.com:6543/postgres'
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    tables = ['users', 'restaurants', 'offers', 'reservations', 'waste_predictions']
    for t in tables:
        inspect_table(cur, t)
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
