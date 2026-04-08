export interface Company {
  id: string
  name: string
  slug: string
  description: string
  tags: string[]
  timezone: string
  city: string
  currency: string
  address?: string
  logo?: string
  phone?: string
};