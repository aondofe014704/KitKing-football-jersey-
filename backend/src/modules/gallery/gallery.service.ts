import { prisma } from '../../config/database';

export class GalleryService {
  async getAllImages(activeOnly = true) {
    return prisma.galleryImage.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async addImage(data: { url: string; publicId?: string; title?: string; description?: string }) {
    const count = await prisma.galleryImage.count();
    return prisma.galleryImage.create({
      data: { ...data, sortOrder: count + 1 },
    });
  }

  async updateImage(id: string, data: Partial<{ title: string; description: string; isActive: boolean; sortOrder: number }>) {
    return prisma.galleryImage.update({ where: { id }, data });
  }

  async deleteImage(id: string) {
    await prisma.galleryImage.delete({ where: { id } });
  }

  async reorderImages(imageIds: string[]) {
    await Promise.all(
      imageIds.map((id, index) =>
        prisma.galleryImage.update({
          where: { id },
          data: { sortOrder: index + 1 },
        })
      )
    );
  }
}
