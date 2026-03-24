DO $$
BEGIN
  -- Enforce RLS on target tables
  ALTER TABLE IF EXISTS public.cards ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.rules ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.uploads ENABLE ROW LEVEL SECURITY;
END $$;

-- Idempotent setup: Drop existing policies before creating new ones
DROP POLICY IF EXISTS "allow_all_cards" ON public.cards;
DROP POLICY IF EXISTS "allow_all_transactions" ON public.transactions;
DROP POLICY IF EXISTS "allow_all_rules" ON public.rules;
DROP POLICY IF EXISTS "allow_all_uploads" ON public.uploads;

-- Create fully permissive policies to guarantee synchronization without blocking (MVP requirement)
CREATE POLICY "allow_all_cards" ON public.cards
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_transactions" ON public.transactions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_rules" ON public.rules
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_uploads" ON public.uploads
  FOR ALL USING (true) WITH CHECK (true);
