import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(500).optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  sku: z.string().min(1, 'SKU is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DRAFT']).optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  league: z.string().optional(),
  team: z.string().optional(),
  season: z.string().optional(),
  jerseyType: z.enum(['HOME', 'AWAY', 'THIRD', 'GOALKEEPER', 'TRAINING']).optional(),
  material: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categoryId: z.string().optional(),
  variants: z.array(
    z.object({
      size: z.string().min(1, 'Size is required'),
      stock: z.number().int().min(0),
      sku: z.string().optional(),
    })
  ).min(1, 'At least one variant is required'),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
