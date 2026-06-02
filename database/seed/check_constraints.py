import psycopg2

def main():
    DATABASE_URL = 'postgresql://postgres.bokxmvrzqxbmjetczxzy:_gfTYWD#&P2z.Tb@aws-0-eu-west-3.pooler.supabase.com:6543/postgres'
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT conname, pg_get_constraintdef(oid) 
        FROM pg_constraint 
        WHERE conrelid = 'users'::regclass AND contype = 'c';
    """)
    print("Users constraints:")
    for con, def_ in cur.fetchall():
        print(f"- {con}: {def_}")
        
    cur.execute("""
        SELECT conname, pg_get_constraintdef(oid) 
        FROM pg_constraint 
        WHERE conrelid = 'reservations'::regclass AND contype = 'c';
    """)
    print("Reservations constraints:")
    for con, def_ in cur.fetchall():
        print(f"- {con}: {def_}")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
