// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      cards: {
        Row: {
          brand: string
          closingDate: number
          color: string
          created_at: string
          dueDate: number
          id: string
          last4: string
          limit: number
          name: string
        }
        Insert: {
          brand: string
          closingDate: number
          color: string
          created_at?: string
          dueDate: number
          id?: string
          last4: string
          limit: number
          name: string
        }
        Update: {
          brand?: string
          closingDate?: number
          color?: string
          created_at?: string
          dueDate?: number
          id?: string
          last4?: string
          limit?: number
          name?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          category: string
          created_at: string
          id: string
          keyword: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          keyword: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          keyword?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          billingMonth: string | null
          billingYear: string | null
          cardId: string | null
          category: string
          created_at: string
          date: string
          description: string
          id: string
        }
        Insert: {
          amount: number
          billingMonth?: string | null
          billingYear?: string | null
          cardId?: string | null
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
        }
        Update: {
          amount?: number
          billingMonth?: string | null
          billingYear?: string | null
          cardId?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_cardId_fkey"
            columns: ["cardId"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          billingMonth: string | null
          billingYear: string | null
          cardId: string | null
          created_at: string
          filename: string
          id: string
          transactionCount: number
          uploadDate: string
        }
        Insert: {
          billingMonth?: string | null
          billingYear?: string | null
          cardId?: string | null
          created_at?: string
          filename: string
          id?: string
          transactionCount: number
          uploadDate: string
        }
        Update: {
          billingMonth?: string | null
          billingYear?: string | null
          cardId?: string | null
          created_at?: string
          filename?: string
          id?: string
          transactionCount?: number
          uploadDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_cardId_fkey"
            columns: ["cardId"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: cards
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   brand: text (not null)
//   limit: numeric (not null)
//   closingDate: integer (not null)
//   dueDate: integer (not null)
//   color: text (not null)
//   last4: text (not null)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: rules
//   id: uuid (not null, default: gen_random_uuid())
//   keyword: text (not null)
//   category: text (not null)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: transactions
//   id: uuid (not null, default: gen_random_uuid())
//   date: text (not null)
//   description: text (not null)
//   amount: numeric (not null)
//   category: text (not null)
//   cardId: uuid (nullable)
//   billingMonth: text (nullable)
//   billingYear: text (nullable)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: uploads
//   id: uuid (not null, default: gen_random_uuid())
//   filename: text (not null)
//   uploadDate: text (not null)
//   cardId: uuid (nullable)
//   transactionCount: integer (not null)
//   billingMonth: text (nullable)
//   billingYear: text (nullable)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))

// --- CONSTRAINTS ---
// Table: cards
//   PRIMARY KEY cards_pkey: PRIMARY KEY (id)
// Table: rules
//   PRIMARY KEY rules_pkey: PRIMARY KEY (id)
// Table: transactions
//   FOREIGN KEY transactions_cardId_fkey: FOREIGN KEY ("cardId") REFERENCES cards(id) ON DELETE CASCADE
//   PRIMARY KEY transactions_pkey: PRIMARY KEY (id)
// Table: uploads
//   FOREIGN KEY uploads_cardId_fkey: FOREIGN KEY ("cardId") REFERENCES cards(id) ON DELETE CASCADE
//   PRIMARY KEY uploads_pkey: PRIMARY KEY (id)

// --- WARNING: TABLES WITH RLS ENABLED BUT NO POLICIES ---
// These tables have Row Level Security enabled but NO policies defined.
// This means ALL queries (SELECT, INSERT, UPDATE, DELETE) will return ZERO rows
// for non-superuser roles (including the anon and authenticated roles used by the app).
// You MUST create RLS policies for these tables to allow data access.
//   - cards

