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
      departments: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_assignments: {
        Row: {
          created_at: string | null
          department_id: string
          employee_id: string
          id: string
          is_primary: boolean | null
          organization_id: string
          remuneration_level_id: string
          role_id: string
          sub_department_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id: string
          employee_id: string
          id?: string
          is_primary?: boolean | null
          organization_id: string
          remuneration_level_id: string
          role_id: string
          sub_department_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string
          employee_id?: string
          id?: string
          is_primary?: boolean | null
          organization_id?: string
          remuneration_level_id?: string
          role_id?: string
          sub_department_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_assignments_remuneration_level_id_fkey"
            columns: ["remuneration_level_id"]
            isOneToOne: false
            referencedRelation: "remuneration_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_assignments_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_bids: {
        Row: {
          bid_status: string | null
          bid_time: string | null
          comments: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          open_bid_id: string | null
          updated_at: string | null
        }
        Insert: {
          bid_status?: string | null
          bid_time?: string | null
          comments?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          open_bid_id?: string | null
          updated_at?: string | null
        }
        Update: {
          bid_status?: string | null
          bid_time?: string | null
          comments?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          open_bid_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_bids_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_bids_open_bid_id_fkey"
            columns: ["open_bid_id"]
            isOneToOne: false
            referencedRelation: "open_bids"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_skills: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          skill_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          skill_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          skill_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_skills_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          availability: Json | null
          created_at: string | null
          email: string
          employee_id: string
          employment_type: string | null
          first_name: string
          id: string
          last_name: string
          middle_name: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          created_at?: string | null
          email: string
          employee_id: string
          employment_type?: string | null
          first_name: string
          id?: string
          last_name: string
          middle_name?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          created_at?: string | null
          email?: string
          employee_id?: string
          employment_type?: string | null
          first_name?: string
          id?: string
          last_name?: string
          middle_name?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      open_bids: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          shift_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          shift_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          shift_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "open_bids_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      remuneration_levels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          department_id: string | null
          id: string
          name: string
          remuneration_level_id: string | null
          sub_department_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          name: string
          remuneration_level_id?: string | null
          sub_department_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          id?: string
          name?: string
          remuneration_level_id?: string | null
          sub_department_id?: string | null
          updated_at?: string | null
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
            foreignKeyName: "roles_remuneration_level_id_fkey"
            columns: ["remuneration_level_id"]
            isOneToOne: false
            referencedRelation: "remuneration_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      rosters: {
        Row: {
          created_at: string | null
          created_by: string | null
          department_id: string
          finalized_at: string | null
          finalized_by: string | null
          id: string
          shift_date: string
          shift_template_id: string | null
          status: string | null
          sub_department_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department_id: string
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          shift_date: string
          shift_template_id?: string | null
          status?: string | null
          sub_department_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department_id?: string
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          shift_date?: string
          shift_template_id?: string | null
          status?: string | null
          sub_department_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rosters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_finalized_by_fkey"
            columns: ["finalized_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_shift_template_id_fkey"
            columns: ["shift_template_id"]
            isOneToOne: false
            referencedRelation: "shift_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_groups: {
        Row: {
          created_at: string | null
          id: string
          is_draft: boolean | null
          name: string
          template_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          name: string
          template_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          name?: string
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_groups_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "shift_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_notifications: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          notification_message: string
          shift_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          notification_message: string
          shift_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          notification_message?: string
          shift_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_notifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_notifications_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_skills: {
        Row: {
          created_at: string | null
          id: string
          shift_id: string
          skill_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          shift_id: string
          skill_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          shift_id?: string
          skill_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_skills_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_subgroups: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          is_draft: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          is_draft?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          is_draft?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_subgroups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "shift_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_swap_approvals: {
        Row: {
          approval_date: string | null
          approval_status: string | null
          approver_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          swap_request_id: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approval_status?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          swap_request_id?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approval_status?: string | null
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          swap_request_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_swap_approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_approvals_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "shift_swap_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_swap_requests: {
        Row: {
          approving_manager_id: string | null
          created_at: string | null
          employee_id: string | null
          employee_to_swap_with_id: string | null
          final_decision_date: string | null
          id: string
          notification_status: string | null
          original_shift_id: string | null
          reason: string | null
          request_date: string | null
          requested_shift_id: string | null
          status: string | null
          swap_status_change_history: Json | null
          swap_time_limit: string | null
          swap_type: string | null
          updated_at: string | null
        }
        Insert: {
          approving_manager_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          employee_to_swap_with_id?: string | null
          final_decision_date?: string | null
          id?: string
          notification_status?: string | null
          original_shift_id?: string | null
          reason?: string | null
          request_date?: string | null
          requested_shift_id?: string | null
          status?: string | null
          swap_status_change_history?: Json | null
          swap_time_limit?: string | null
          swap_type?: string | null
          updated_at?: string | null
        }
        Update: {
          approving_manager_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          employee_to_swap_with_id?: string | null
          final_decision_date?: string | null
          id?: string
          notification_status?: string | null
          original_shift_id?: string | null
          reason?: string | null
          request_date?: string | null
          requested_shift_id?: string | null
          status?: string | null
          swap_status_change_history?: Json | null
          swap_time_limit?: string | null
          swap_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_swap_requests_approving_manager_id_fkey"
            columns: ["approving_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_requests_employee_to_swap_with_id_fkey"
            columns: ["employee_to_swap_with_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_requests_original_shift_id_fkey"
            columns: ["original_shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_swap_requests_requested_shift_id_fkey"
            columns: ["requested_shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_templates: {
        Row: {
          created_at: string | null
          department_id: string
          end_date: string
          id: string
          is_draft: boolean | null
          name: string
          start_date: string
          sub_department_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id: string
          end_date: string
          id?: string
          is_draft?: boolean | null
          name: string
          start_date: string
          sub_department_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string
          end_date?: string
          id?: string
          is_draft?: boolean | null
          name?: string
          start_date?: string
          sub_department_id?: string
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
          assigned_employee_id: string | null
          created_at: string | null
          department_id: string
          end_time: string
          id: string
          is_draft: boolean | null
          length: number | null
          net_length: number | null
          paid_break_duration: number | null
          remuneration_level_id: string | null
          role_id: string | null
          shift_date: string
          shift_group_id: string | null
          shift_subgroup_id: string | null
          shift_template_id: string | null
          start_time: string
          status: string | null
          sub_department_id: string
          unpaid_break_duration: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_employee_id?: string | null
          created_at?: string | null
          department_id: string
          end_time: string
          id?: string
          is_draft?: boolean | null
          length?: number | null
          net_length?: number | null
          paid_break_duration?: number | null
          remuneration_level_id?: string | null
          role_id?: string | null
          shift_date: string
          shift_group_id?: string | null
          shift_subgroup_id?: string | null
          shift_template_id?: string | null
          start_time: string
          status?: string | null
          sub_department_id: string
          unpaid_break_duration?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_employee_id?: string | null
          created_at?: string | null
          department_id?: string
          end_time?: string
          id?: string
          is_draft?: boolean | null
          length?: number | null
          net_length?: number | null
          paid_break_duration?: number | null
          remuneration_level_id?: string | null
          role_id?: string | null
          shift_date?: string
          shift_group_id?: string | null
          shift_subgroup_id?: string | null
          shift_template_id?: string | null
          start_time?: string
          status?: string | null
          sub_department_id?: string
          unpaid_break_duration?: number | null
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
          {
            foreignKeyName: "shifts_remuneration_level_id_fkey"
            columns: ["remuneration_level_id"]
            isOneToOne: false
            referencedRelation: "remuneration_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_shift_group_id_fkey"
            columns: ["shift_group_id"]
            isOneToOne: false
            referencedRelation: "shift_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_shift_subgroup_id_fkey"
            columns: ["shift_subgroup_id"]
            isOneToOne: false
            referencedRelation: "shift_subgroups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_shift_template_id_fkey"
            columns: ["shift_template_id"]
            isOneToOne: false
            referencedRelation: "shift_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sub_departments: {
        Row: {
          created_at: string | null
          department_id: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      timecards: {
        Row: {
          break_duration: number | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          overtime_duration: number | null
          shift_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          break_duration?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          overtime_duration?: number | null
          shift_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          break_duration?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          overtime_duration?: number | null
          shift_id?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
