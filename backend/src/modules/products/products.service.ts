import slugify from 'slugify';
import { prisma } from '../../config/database';
import { getPaginationParams, buildPaginationMeta } from '../../utils/response.utils';
import { CreateProductInput, UpdateProductInput } from './products.schema';

export class ProductsService {
  async getAllProducts(query: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    featured?: string;
    newArrival?: string;
    bestSeller?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    league?: string;
    team?: string;
  }) {
    const { page, limit, skip } = getPaginationParams(query);

    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = 'ACTIVE';
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { team: { contains: query.search, mode: 'insensitive' } },
        { league: { contains: query.search, mode: 'insensitive' } },
        { tags: { has: query.search.toLowerCase() } },
      ];
    }

    if (query.category) {
      where.categoryId = query.category;
    }

    if (query.featured === 'true') where.isFeatured = true;
    if (query.newArrival === 'true') where.isNewArrival = true;
    if (query.bestSeller === 'true') where.isBestSeller = true;
    if (query.league) where.league = { contains: query.league, mode: 'insensitive' };
    if (query.team) where.team = { contains: query.team, mode: 'insensitive' };

    if (query.minPrice || query.maxPrice) {
      where.price = {
        ...(query.minPrice && { gte: parseFloat(query.minPrice) }),
        ...(query.maxPrice && { lte: parseFloat(query.maxPrice) }),
      };
    }

    const orderBy: Record<string, string> = {};
    switch (query.sort) {
      case 'price_asc': orderBy.price = 'asc'; break;
      case 'price_desc': orderBy.price = 'desc'; break;
      case 'name_asc': orderBy.name = 'asc'; break;
      case 'newest': orderBy.createdAt = 'desc'; break;
      case 'popular': orderBy.viewCount = 'desc'; break;
      default: orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: { orderBy: { order: 'asc' } },
          variants: true,
          category: { select: { id: true, name: true, slug: true } },
          reviews: {
            select: { rating: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;
      const { reviews, ...rest } = p;
      return { ...rest, averageRating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length };
    });

    return { products: productsWithRating, meta: buildPaginationMeta(total, page, limit) };
  }

  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) throw { statusCode: 404, message: 'Product not found' };

    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
      },
    });

    if (!product) throw { statusCode: 404, message: 'Product not found' };
    return product;
  }

  async createProduct(data: CreateProductInput) {
    const slug = await this.generateUniqueSlug(data.name);

    const { variants, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,
        slug,
        tags: data.tags || [],
        variants: {
          create: variants,
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw { statusCode: 404, message: 'Product not found' };

    const { variants, ...productData } = data;

    if (productData.name && productData.name !== existing.name) {
      (productData as Record<string, unknown>).slug = await this.generateUniqueSlug(productData.name, id);
    }

    const product = await prisma.product.update({
      where: { id },
      data: productData,
      include: { images: true, variants: true, category: true },
    });

    if (variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: variants.map((v) => ({ ...v, productId: id })),
      });
    }

    return product;
  }

  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw { statusCode: 404, message: 'Product not found' };

    await prisma.product.delete({ where: { id } });
  }

  async addProductImage(productId: string, imageData: {
    url: string;
    publicId?: string;
    alt?: string;
    isPrimary?: boolean;
  }) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw { statusCode: 404, message: 'Product not found' };

    if (imageData.isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const count = await prisma.productImage.count({ where: { productId } });

    return prisma.productImage.create({
      data: {
        ...imageData,
        productId,
        order: count + 1,
        isPrimary: count === 0 ? true : (imageData.isPrimary ?? false),
      },
    });
  }

  async deleteProductImage(imageId: string) {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) throw { statusCode: 404, message: 'Image not found' };

    await prisma.productImage.delete({ where: { id: imageId } });
  }

  async getRelatedProducts(productId: string, limit = 8) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, league: true, team: true },
    });

    if (!product) return [];

    return prisma.product.findMany({
      where: {
        id: { not: productId },
        status: 'ACTIVE',
        OR: [
          { categoryId: product.categoryId ?? undefined },
          { league: product.league ?? undefined },
        ],
      },
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: true,
      },
    });
  }

  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.product.findUnique({
        where: { slug },
      });

      if (!existing || existing.id === excludeId) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
