import slugify from 'slugify';
import { prisma } from '../../config/database';

export class CategoriesService {
  async getAllCategories(includeCount = true) {
    const categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        ...(includeCount && {
          _count: { select: { products: true } },
        }),
      },
    });
    return categories;
  }

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        parent: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) throw { statusCode: 404, message: 'Category not found' };
    return category;
  }

  async createCategory(data: {
    name: string;
    description?: string;
    image?: string;
    parentId?: string;
    sortOrder?: number;
  }) {
    const slug = await this.generateUniqueSlug(data.name);
    return prisma.category.create({
      data: { ...data, slug },
    });
  }

  async updateCategory(id: string, data: Partial<{
    name: string;
    description: string;
    image: string;
    parentId: string;
    sortOrder: number;
    isActive: boolean;
  }>) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw { statusCode: 404, message: 'Category not found' };

    if (data.name && data.name !== category.name) {
      (data as Record<string, unknown>).slug = await this.generateUniqueSlug(data.name, id);
    }

    return prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw { statusCode: 400, message: `Cannot delete category with ${productCount} products. Reassign products first.` };
    }

    await prisma.category.delete({ where: { id } });
  }

  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
