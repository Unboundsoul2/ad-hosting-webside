export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_username: string
          created_at: string | null
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_username: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_username?: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_username_fkey"
            columns: ["admin_username"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["username"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          managed_sections: string[] | null
          passphrase: string
          recovery_email: string | null
          two_factor_enabled: boolean | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          managed_sections?: string[] | null
          passphrase: string
          recovery_email?: string | null
          two_factor_enabled?: boolean | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          managed_sections?: string[] | null
          passphrase?: string
          recovery_email?: string | null
          two_factor_enabled?: boolean | null
          username?: string
        }
        Relationships: []
      }
      migration_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: number
          package_data: Json
          used: boolean | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: number
          package_data: Json
          used?: boolean | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: number
          package_data?: Json
          used?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      migration_history: {
        Row: {
          id: number
          migration_timestamp: string | null
          source_platform: string
          target_platform: string
          user_id: string | null
          version: string | null
        }
        Insert: {
          id?: number
          migration_timestamp?: string | null
          source_platform: string
          target_platform: string
          user_id?: string | null
          version?: string | null
        }
        Update: {
          id?: number
          migration_timestamp?: string | null
          source_platform?: string
          target_platform?: string
          user_id?: string | null
          version?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          id: number
          metadata: Json | null
          route: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: number
          metadata?: Json | null
          route?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: number
          metadata?: Json | null
          route?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_config_states: {
        Row: {
          config: Json
          id: number
          last_updated: string | null
          user_id: string | null
        }
        Insert: {
          config: Json
          id?: number
          last_updated?: string | null
          user_id?: string | null
        }
        Update: {
          config?: Json
          id?: number
          last_updated?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_project_states: {
        Row: {
          id: number
          imported_from: string | null
          last_updated: string | null
          platform_info: Json | null
          state: Json
          user_id: string | null
        }
        Insert: {
          id?: number
          imported_from?: string | null
          last_updated?: string | null
          platform_info?: Json | null
          state: Json
          user_id?: string | null
        }
        Update: {
          id?: number
          imported_from?: string | null
          last_updated?: string | null
          platform_info?: Json | null
          state?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      website_content: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          section: string
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          section: string
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          section?: string
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
