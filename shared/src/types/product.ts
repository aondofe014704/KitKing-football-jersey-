export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DRAFT';

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  sku: string;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  tags: string[];
  league?: string;
  team?: string;
  season?: string;
  jersey_type?: 'HOME' | 'AWAY' | 'THIRD' | 'GOALKEEPER' | 'TRAINING';
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category;
  categoryId?: string;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  productId: string;
  createdAt: string;
}
