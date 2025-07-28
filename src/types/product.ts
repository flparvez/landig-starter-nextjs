export interface Product {
  id: string
  name: string
  description: string
  price: number
  mprice?: number
  stock: number
  category: string
  brand?: string
  featured: boolean
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export type ProductColumn = {
  id: string
  name: string
  price: number
  stock: number
  featured: boolean
  createdAt: string
}