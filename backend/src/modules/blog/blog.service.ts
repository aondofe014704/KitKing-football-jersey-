import slugify from 'slugify';
import { prisma } from '../../config/database';
import { getPaginationParams, buildPaginationMeta } from '../../utils/response.utils';

export class BlogService {
  async getAllPosts(query: { page?: string; limit?: string; search?: string; published?: string }) {
    const { page, limit, skip } = getPaginationParams(query);

    const where: Record<string, unknown> = {};
    if (query.published !== undefined) {
      where.isPublished = query.published === 'true';
    } else {
      where.isPublished = true;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { firstName: true, lastName: true, avatar: true } },
        },
        omit: { content: true },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { posts, meta: buildPaginationMeta(total, page, limit) };
  }

  async getPostBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });

    if (!post || !post.isPublished) throw { statusCode: 404, message: 'Post not found' };

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async createPost(authorId: string, data: {
    title: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
  }) {
    const slug = await this.generateUniqueSlug(data.title);

    return prisma.blogPost.create({
      data: {
        ...data,
        slug,
        authorId,
        publishedAt: data.isPublished ? new Date() : undefined,
        tags: data.tags || [],
      },
    });
  }

  async updatePost(id: string, data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    isPublished: boolean;
    isFeatured: boolean;
    tags: string[];
  }>) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw { statusCode: 404, message: 'Post not found' };

    if (data.title && data.title !== post.title) {
      (data as Record<string, unknown>).slug = await this.generateUniqueSlug(data.title, id);
    }

    if (data.isPublished && !post.isPublished) {
      (data as Record<string, unknown>).publishedAt = new Date();
    }

    return prisma.blogPost.update({ where: { id }, data });
  }

  async deletePost(id: string) {
    await prisma.blogPost.delete({ where: { id } });
  }

  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.blogPost.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
