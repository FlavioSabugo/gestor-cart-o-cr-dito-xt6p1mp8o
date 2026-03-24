-- Setup RLS Policies to allow anonymous public access (since the app currently operates without Auth)
-- This ensures cards and other data are successfully read and written without permission blocks.

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_cards" ON public.cards;
CREATE POLICY "allow_all_cards" ON public.cards FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_transactions" ON public.transactions;
CREATE POLICY "allow_all_transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_rules" ON public.rules;
CREATE POLICY "allow_all_rules" ON public.rules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_uploads" ON public.uploads;
CREATE POLICY "allow_all_uploads" ON public.uploads FOR ALL USING (true) WITH CHECK (true);
