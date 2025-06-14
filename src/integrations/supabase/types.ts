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
      bids: {
        Row: {
          bid_time: string | null
          created_at: string | null
          employee_id: number | null
          id: number
          notes: string | null
          shift_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bid_time?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          notes?: string | null
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bid_time?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          notes?: string | null
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_group_members: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          is_admin: boolean
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          is_admin?: boolean
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          is_admin?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "broadcast_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_groups: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      broadcast_notifications: {
        Row: {
          broadcast_id: string
          created_at: string | null
          id: string
          read: boolean
          user_id: string
        }
        Insert: {
          broadcast_id: string
          created_at?: string | null
          id?: string
          read?: boolean
          user_id: string
        }
        Update: {
          broadcast_id?: string
          created_at?: string | null
          id?: string
          read?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_notifications_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "broadcast_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcasts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          department: string | null
          id: number
        }
        Insert: {
          department?: string | null
          id: number
        }
        Update: {
          department?: string | null
          id?: number
        }
        Relationships: []
      }
      employee_certifications: {
        Row: {
          certification_name: string
          created_at: string | null
          employee_id: number | null
          expiry_date: string | null
          id: number
          issued_date: string | null
          updated_at: string | null
        }
        Insert: {
          certification_name: string
          created_at?: string | null
          employee_id?: number | null
          expiry_date?: string | null
          id?: number
          issued_date?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_name?: string
          created_at?: string | null
          employee_id?: number | null
          expiry_date?: string | null
          id?: number
          issued_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_metrics: {
        Row: {
          acceptance_ratio: number | null
          cancellation_ratio: number | null
          employee_id: number
          fatigue_factor: number | null
          late_cancellation_1hr_ratio: number | null
          late_cancellation_24hr_ratio: number | null
          late_cancellation_4hr_ratio: number | null
          no_show_ratio: number | null
          rejection_ratio: number | null
          shift_assigned_30: number | null
          shift_suitability_score: number | null
        }
        Insert: {
          acceptance_ratio?: number | null
          cancellation_ratio?: number | null
          employee_id: number
          fatigue_factor?: number | null
          late_cancellation_1hr_ratio?: number | null
          late_cancellation_24hr_ratio?: number | null
          late_cancellation_4hr_ratio?: number | null
          no_show_ratio?: number | null
          rejection_ratio?: number | null
          shift_assigned_30?: number | null
          shift_suitability_score?: number | null
        }
        Update: {
          acceptance_ratio?: number | null
          cancellation_ratio?: number | null
          employee_id?: number
          fatigue_factor?: number | null
          late_cancellation_1hr_ratio?: number | null
          late_cancellation_24hr_ratio?: number | null
          late_cancellation_4hr_ratio?: number | null
          no_show_ratio?: number | null
          rejection_ratio?: number | null
          shift_assigned_30?: number | null
          shift_suitability_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_metrics_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          acceptance_ratio: number | null
          availability: Json | null
          cancellation_ratio: number | null
          created_at: string | null
          department_id: number | null
          email: string
          employee_id: string
          first_name: string
          id: number
          last_name: string
          late_cancellation_ratio: number | null
          phone: string | null
          remuneration_level: number | null
          role_id: number | null
          status: string | null
          sub_department_id: number | null
          swap_ratio: number | null
          tier: number | null
          updated_at: string | null
        }
        Insert: {
          acceptance_ratio?: number | null
          availability?: Json | null
          cancellation_ratio?: number | null
          created_at?: string | null
          department_id?: number | null
          email: string
          employee_id: string
          first_name: string
          id?: number
          last_name: string
          late_cancellation_ratio?: number | null
          phone?: string | null
          remuneration_level?: number | null
          role_id?: number | null
          status?: string | null
          sub_department_id?: number | null
          swap_ratio?: number | null
          tier?: number | null
          updated_at?: string | null
        }
        Update: {
          acceptance_ratio?: number | null
          availability?: Json | null
          cancellation_ratio?: number | null
          created_at?: string | null
          department_id?: number | null
          email?: string
          employee_id?: string
          first_name?: string
          id?: number
          last_name?: string
          late_cancellation_ratio?: number | null
          phone?: string | null
          remuneration_level?: number | null
          role_id?: number | null
          status?: string | null
          sub_department_id?: number | null
          swap_ratio?: number | null
          tier?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      forecasting_logs: {
        Row: {
          actual_labor_used: number | null
          created_at: string | null
          department_id: number | null
          forecast_date: string
          id: number
          predicted_labor_demand: number | null
        }
        Insert: {
          actual_labor_used?: number | null
          created_at?: string | null
          department_id?: number | null
          forecast_date: string
          id?: number
          predicted_labor_demand?: number | null
        }
        Update: {
          actual_labor_used?: number | null
          created_at?: string | null
          department_id?: number | null
          forecast_date?: string
          id?: number
          predicted_labor_demand?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forecasting_logs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          color: string
          created_at: string | null
          group_id: number
          name: string
          template_id: number
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          group_id?: never
          name: string
          template_id: number
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          group_id?: never
          name?: string
          template_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["template_id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          created_at: string | null
          description: string
          employee_id: number | null
          id: number
          incident_type: string
          reported_at: string | null
          resolution: string | null
          resolved_at: string | null
          shift_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          employee_id?: number | null
          id?: number
          incident_type: string
          reported_at?: string | null
          resolution?: string | null
          resolved_at?: string | null
          shift_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          employee_id?: number | null
          id?: number
          incident_type?: string
          reported_at?: string | null
          resolution?: string | null
          resolved_at?: string | null
          shift_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_reports_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string | null
          employee_id: number | null
          end_date: string
          id: number
          leave_type: string
          reason: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: number | null
          end_date: string
          id?: number
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: number | null
          end_date?: string
          id?: number
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      messaging: {
        Row: {
          created_at: string | null
          id: number
          message: string
          read_status: boolean | null
          receiver_id: number | null
          sender_id: number | null
          sent_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
          read_status?: boolean | null
          receiver_id?: number | null
          sender_id?: number | null
          sent_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
          read_status?: boolean | null
          receiver_id?: number | null
          sender_id?: number | null
          sent_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messaging_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messaging_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          employee_id: number | null
          id: number
          message: string
          read_status: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          employee_id?: number | null
          id?: number
          message: string
          read_status?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          employee_id?: number | null
          id?: number
          message?: string
          read_status?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      overtime_requests: {
        Row: {
          approved_overtime: unknown | null
          created_at: string | null
          employee_id: number | null
          id: number
          requested_overtime: unknown
          shift_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_overtime?: unknown | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          requested_overtime: unknown
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_overtime?: unknown | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          requested_overtime?: unknown
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "overtime_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "overtime_requests_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          amount: number
          bonuses: number | null
          created_at: string | null
          deductions: number | null
          employee_id: number | null
          id: number
          net_pay: number
          pay_date: string
          shift_id: number | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          bonuses?: number | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: number | null
          id?: number
          net_pay: number
          pay_date: string
          shift_id?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bonuses?: number | null
          created_at?: string | null
          deductions?: number | null
          employee_id?: number | null
          id?: number
          net_pay?: number
          pay_date?: string
          shift_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          comments: string | null
          created_at: string | null
          employee_id: number | null
          id: number
          rating: number | null
          review_date: string
          reviewer_id: number | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          rating?: number | null
          review_date: string
          reviewer_id?: number | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          rating?: number | null
          review_date?: string
          reviewer_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      role_history: {
        Row: {
          change_date: string
          changed_by: number | null
          created_at: string | null
          employee_id: number | null
          id: number
          new_role_id: number | null
          old_role_id: number | null
          reason: string | null
          updated_at: string | null
        }
        Insert: {
          change_date: string
          changed_by?: number | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          new_role_id?: number | null
          old_role_id?: number | null
          reason?: string | null
          updated_at?: string | null
        }
        Update: {
          change_date?: string
          changed_by?: number | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          new_role_id?: number | null
          old_role_id?: number | null
          reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_history_new_role_id_fkey"
            columns: ["new_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_history_old_role_id_fkey"
            columns: ["old_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          department_id: number | null
          id: number
          "Renumeration Level": number | null
          Role: string | null
          "sub-department_id": number | null
        }
        Insert: {
          department_id?: number | null
          id: number
          "Renumeration Level"?: number | null
          Role?: string | null
          "sub-department_id"?: number | null
        }
        Update: {
          department_id?: number | null
          id?: number
          "Renumeration Level"?: number | null
          Role?: string | null
          "sub-department_id"?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_sub-department_id_fkey"
            columns: ["sub-department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_requests: {
        Row: {
          created_at: string | null
          details: Json | null
          employee_id: number | null
          id: number
          request_time: string | null
          request_type: string
          shift_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          employee_id?: number | null
          id?: number
          request_time?: string | null
          request_type: string
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          employee_id?: number | null
          id?: number
          request_time?: string | null
          request_type?: string
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_requests_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_skeletons: {
        Row: {
          approximate_pay: number
          break_duration: unknown
          created_at: string | null
          net_shift_length: unknown
          remuneration_level: number
          role_id: number
          shift_end_time: string
          shift_length: unknown
          shift_skeleton_id: number
          shift_start_time: string
          sub_group_id: number
          updated_at: string | null
        }
        Insert: {
          approximate_pay: number
          break_duration: unknown
          created_at?: string | null
          net_shift_length: unknown
          remuneration_level: number
          role_id: number
          shift_end_time: string
          shift_length: unknown
          shift_skeleton_id?: never
          shift_start_time: string
          sub_group_id: number
          updated_at?: string | null
        }
        Update: {
          approximate_pay?: number
          break_duration?: unknown
          created_at?: string | null
          net_shift_length?: unknown
          remuneration_level?: number
          role_id?: number
          shift_end_time?: string
          shift_length?: unknown
          shift_skeleton_id?: never
          shift_start_time?: string
          sub_group_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sub_group"
            columns: ["sub_group_id"]
            isOneToOne: false
            referencedRelation: "sub_groups"
            referencedColumns: ["sub_group_id"]
          },
        ]
      }
      shift_swap_logs: {
        Row: {
          approving_employee_id: number | null
          created_at: string | null
          id: number
          new_shift_id: number | null
          original_shift_id: number | null
          requesting_employee_id: number | null
          status: string | null
          swap_approval_time: string | null
          swap_request_time: string | null
          updated_at: string | null
        }
        Insert: {
          approving_employee_id?: number | null
          created_at?: string | null
          id?: number
          new_shift_id?: number | null
          original_shift_id?: number | null
          requesting_employee_id?: number | null
          status?: string | null
          swap_approval_time?: string | null
          swap_request_time?: string | null
          updated_at?: string | null
        }
        Update: {
          approving_employee_id?: number | null
          created_at?: string | null
          id?: number
          new_shift_id?: number | null
          original_shift_id?: number | null
          requesting_employee_id?: number | null
          status?: string | null
          swap_approval_time?: string | null
          swap_request_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_swap_logs_approving_employee_id_fkey"
            columns: ["approving_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_logs_new_shift_id_fkey"
            columns: ["new_shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_logs_original_shift_id_fkey"
            columns: ["original_shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_logs_requesting_employee_id_fkey"
            columns: ["requesting_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_templates: {
        Row: {
          created_at: string | null
          day_of_week: string
          department_id: number | null
          end_time: string
          id: number
          name: string
          role_id: number | null
          start_time: string
          sub_department_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: string
          department_id?: number | null
          end_time: string
          id?: number
          name: string
          role_id?: number | null
          start_time: string
          sub_department_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: string
          department_id?: number | null
          end_time?: string
          id?: number
          name?: string
          role_id?: number | null
          start_time?: string
          sub_department_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_templates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_templates_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_templates_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          assigned_employee_id: number | null
          created_at: string | null
          department_id: number | null
          id: number
          shift_date: string
          shift_time: string
          status: string | null
          sub_departments_id: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_employee_id?: number | null
          created_at?: string | null
          department_id?: number | null
          id?: number
          shift_date: string
          shift_time: string
          status?: string | null
          sub_departments_id?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_employee_id?: number | null
          created_at?: string | null
          department_id?: number | null
          id?: number
          shift_date?: string
          shift_time?: string
          status?: string | null
          sub_departments_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_departments: {
        Row: {
          department_id: number | null
          id: number
          "sub-department": string | null
        }
        Insert: {
          department_id?: number | null
          id: number
          "sub-department"?: string | null
        }
        Update: {
          department_id?: number | null
          id?: number
          "sub-department"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub-departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_groups: {
        Row: {
          created_at: string | null
          group_id: number
          name: string
          sub_group_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_id: number
          name: string
          sub_group_id?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: number
          name?: string
          sub_group_id?: never
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          setting_name: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_name: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_name?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string | null
          department_id: number
          end_date: string
          name: string
          start_date: string
          sub_department_id: number
          template_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id: number
          end_date: string
          name: string
          start_date: string
          sub_department_id: number
          template_id?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: number
          end_date?: string
          name?: string
          start_date?: string
          sub_department_id?: number
          template_id?: never
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      timecards: {
        Row: {
          break_duration: unknown | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          employee_id: number | null
          id: number
          overtime_duration: unknown | null
          shift_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          break_duration?: unknown | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          overtime_duration?: unknown | null
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          break_duration?: unknown | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          overtime_duration?: unknown | null
          shift_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timecards_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timecards_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      training_records: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          employee_id: number | null
          id: number
          trainer: string | null
          training_date: string
          training_name: string
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          trainer?: string | null
          training_date: string
          training_name: string
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          employee_id?: number | null
          id?: number
          trainer?: string | null
          training_date?: string
          training_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          employee_id: number | null
          id: number
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: number | null
          id?: number
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: number | null
          id?: number
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      auth_users_view: {
        Row: {
          department: string | null
          email: string | null
          id: string | null
          name: string | null
          role: string | null
        }
        Insert: {
          department?: never
          email?: string | null
          id?: string | null
          name?: never
          role?: never
        }
        Update: {
          department?: never
          email?: string | null
          id?: string | null
          name?: never
          role?: never
        }
        Relationships: []
      }
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
