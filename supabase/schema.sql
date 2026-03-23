-- Supabase Schema for Gestor Cartão Crédito

CREATE TABLE IF NOT EXISTS public.cards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  "limit" numeric NOT NULL,
  "closingDate" integer NOT NULL,
  "dueDate" integer NOT NULL,
  color text NOT NULL,
  last4 text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  "cardId" uuid REFERENCES public.cards(id) ON DELETE CASCADE,
  "billingMonth" text,
  "billingYear" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.uploads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  "uploadDate" text NOT NULL,
  "cardId" uuid REFERENCES public.cards(id) ON DELETE CASCADE,
  "transactionCount" integer NOT NULL,
  "billingMonth" text,
  "billingYear" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
