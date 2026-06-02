-- Sanad Triggers & Functions (Real-time Impact & Inventory Management)
-- Author: Data Engineer
-- Date: 2026-06-01

-- =========================================================================
-- 1. FUNCTION: UPDATE OFFER INVENTORY ON NEW RESERVATION
-- =========================================================================
CREATE OR REPLACE FUNCTION trg_handle_new_reservation()
RETURNS TRIGGER AS $$
DECLARE
    v_qty_remaining INTEGER;
BEGIN
    -- Get current remaining quantity
    SELECT quantity_remaining INTO v_qty_remaining
    FROM offers
    WHERE id = NEW.offer_id;

    -- Check if there is enough quantity available
    IF v_qty_remaining < NEW.quantity THEN
        RAISE EXCEPTION 'Not enough items remaining for this offer (Requested: %, Available: %)', 
            NEW.quantity, v_qty_remaining;
    END IF;

    -- Decrement quantity remaining
    UPDATE offers
    SET quantity_remaining = quantity_remaining - NEW.quantity,
        status = CASE 
            WHEN (quantity_remaining - NEW.quantity) = 0 THEN 'reserved'::varchar
            ELSE status 
        END
    WHERE id = NEW.offer_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_on_new_reservation
    BEFORE INSERT ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION trg_handle_new_reservation();


-- =========================================================================
-- 2. FUNCTION: HANDLE RESERVATION STATE CHANGES (CONFIRMED / CANCELLED)
-- =========================================================================
CREATE OR REPLACE FUNCTION trg_handle_reservation_update()
RETURNS TRIGGER AS $$
DECLARE
    v_orig_price NUMERIC(10, 2);
    v_curr_price NUMERIC(10, 2);
    v_financial_saved DOUBLE PRECISION;
    v_kg_saved DOUBLE PRECISION;
    v_co2_saved_g DOUBLE PRECISION;
    v_meals_count DOUBLE PRECISION;
    v_water_saved_liters DOUBLE PRECISION;
BEGIN
    -- 1. CASE: CANCELLED RESERVATION (Restore inventory)
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE offers
        SET quantity_remaining = quantity_remaining + OLD.quantity,
            status = CASE 
                WHEN status = 'reserved' THEN 'active'::varchar
                ELSE status 
            END
        WHERE id = NEW.offer_id;
        
        -- If it was previously confirmed, revert the impact
        IF OLD.status = 'confirmed' THEN
            SELECT original_price, current_price INTO v_orig_price, v_curr_price
            FROM offers WHERE id = NEW.offer_id;
            
            v_kg_saved := OLD.quantity * 0.5;
            v_co2_saved_g := v_kg_saved * 2500.0;
            v_meals_count := OLD.quantity;
            v_water_saved_liters := v_kg_saved * 1000.0;
            v_financial_saved := OLD.quantity * (v_orig_price - v_curr_price);

            DELETE FROM impact_logs WHERE reservation_id = OLD.id;

            -- Update summary table
            UPDATE impact_summary SET value = GREATEST(0.0, value - v_meals_count) WHERE key = 'total_meals_saved';
            UPDATE impact_summary SET value = GREATEST(0.0, value - v_co2_saved_g) WHERE key = 'total_co2_saved_g';
            UPDATE impact_summary SET value = GREATEST(0.0, value - v_water_saved_liters) WHERE key = 'total_water_saved_liters';
            UPDATE impact_summary SET value = GREATEST(0.0, value - v_financial_saved) WHERE key = 'total_financial_saved';
        END IF;
    END IF;

    -- 2. CASE: CONFIRMED RESERVATION (Calculate & Log Environmental/Economic Impact)
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        SELECT original_price, current_price INTO v_orig_price, v_curr_price
        FROM offers
        WHERE id = NEW.offer_id;

        -- Formules ADEME / official multipliers:
        -- 1 meal = 0.5 kg of food saved
        -- 1 kg of food saved = 2.5 kg CO2 = 2500 grams CO2
        -- 1 kg of food saved = 1000 Liters of Water
        v_kg_saved := NEW.quantity * 0.5;
        v_co2_saved_g := v_kg_saved * 2500.0;
        v_meals_count := NEW.quantity;
        v_water_saved_liters := v_kg_saved * 1000.0;
        v_financial_saved := NEW.quantity * (v_orig_price - v_curr_price);

        -- Insert into impact_logs
        INSERT INTO impact_logs (offer_id, reservation_id, kg_saved, co2_saved_g, meals_count, water_saved_liters)
        VALUES (NEW.offer_id, NEW.id, v_kg_saved, v_co2_saved_g, v_meals_count, v_water_saved_liters)
        ON CONFLICT (reservation_id) DO NOTHING;

        -- Update Offer Status to 'saved' if no items remain and all reservations are confirmed/handled
        UPDATE offers
        SET status = CASE 
            WHEN quantity_remaining = 0 THEN 'saved'::varchar
            ELSE status 
        END
        WHERE id = NEW.offer_id;

        -- Aggregation: Update summary table instantly
        UPDATE impact_summary SET value = value + v_meals_count, updated_at = CURRENT_TIMESTAMP WHERE key = 'total_meals_saved';
        UPDATE impact_summary SET value = value + v_co2_saved_g, updated_at = CURRENT_TIMESTAMP WHERE key = 'total_co2_saved_g';
        UPDATE impact_summary SET value = value + v_water_saved_liters, updated_at = CURRENT_TIMESTAMP WHERE key = 'total_water_saved_liters';
        UPDATE impact_summary SET value = value + v_financial_saved, updated_at = CURRENT_TIMESTAMP WHERE key = 'total_financial_saved';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_on_reservation_update
    AFTER UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION trg_handle_reservation_update();
