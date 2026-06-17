// lib/types.ts

export type Transport = 'car' | 'train' | 'plane' | 'shuttle' | 'other'

export type DietaryOption =
  | 'vegan'
  | 'vegetarian'
  | 'gluten_free'
  | 'lactose_free'
  | 'nut_allergy'
  | 'shellfish_allergy'
  | 'halal'
  | 'kosher'

export interface Guest {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  attending: boolean | null
  arrival_day: string | null      // ISO date
  departure_day: string | null
  transport: Transport | null
  plus_one: boolean
  plus_one_name: string | null
  dietary_guest: DietaryOption[]
  dietary_plus_one: DietaryOption[]
  notes: string | null
  table_id: string | null
  confirmed: boolean
}

export interface Table {
  id: string
  name: string
  capacity: number
  guests?: Guest[]
}

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'flowers'
  | 'photo_video'
  | 'music'
  | 'attire'
  | 'transport'
  | 'honeymoon'
  | 'stationery'
  | 'other'

export interface BudgetItem {
  id: string
  category: BudgetCategory
  vendor: string
  description: string
  total_cost: number
  deposit_paid: number
  due_date: string | null
  notes: string | null
  paid: boolean
}

export type ChecklistCategory =
  | '12_months'
  | '9_months'
  | '6_months'
  | '3_months'
  | '1_month'
  | '1_week'
  | 'day_of'

export interface ChecklistItem {
  id: string
  task: string
  due_date: string | null
  done: boolean
  category: ChecklistCategory
  priority: 'high' | 'medium' | 'low'
}

export interface RsvpFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  attending: boolean
  arrival_day: string
  departure_day: string
  transport: Transport
  plus_one: boolean
  plus_one_name: string
  dietary_guest: DietaryOption[]
  dietary_plus_one: DietaryOption[]
  notes: string
}
