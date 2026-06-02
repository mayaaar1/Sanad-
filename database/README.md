# 🗄️ SavePlate - Data Engineering Module (Desktop Workspace)

Welcome to the data engineering module of **SavePlate**.

---

## 🗺️ 12-Hour Data Engineering Roadmap

*   **H3 - H5 (15h22 - 17h00) | Setup & Verification:**
    *   Deploy `schema.sql` and `triggers.sql` on your local PostgreSQL database.
*   **H5 - H7 (17h00 - 19h00) | Seeding & Validation:**
    *   Run `seed/seed.py` to populate your local database with Algiers-based mock data.
*   **H7 - H9 (19h00 - 21h00) | Core Integration:**
    *   Provide the database credentials and the schema structure to the Full-Stack Developer and Cybersecurity Engineer.
*   **H9 - H11 (21h00 - 23h00) | Aggregations:**
    *   Set up database views from `queries.sql`.
*   **H11 - H12 (23h00 - 00h00) | Hand-off:**
    *   Review calculations and prepare slides.

---

## 🛠️ Setup Instructions

### 1. Database Initialization
Execute the SQL files in PostgreSQL:
```bash
psql -U postgres -d saveplate -f schema.sql
psql -U postgres -d saveplate -f triggers.sql
```

### 2. Run the Seed Script
```bash
cd seed
pip install -r requirements.txt
python seed.py
```
*Make sure `DATABASE_URL` is set: `export DATABASE_URL="postgresql://postgres:password@localhost:5432/saveplate"`*

---

## 🚀 Priority Commits to Push Now to Unblock the Team
1.  **`database/schema.sql` (HIGH PRIORITY)**: Unblocks backend modeling and RBAC rules.
2.  **`database/seed/seed.py` (HIGH PRIORITY)**: Unblocks AI training and frontend screen views.
3.  **`database/triggers.sql` (MEDIUM PRIORITY)**: Frees developers from writing impact logic in JavaScript.
