import { prisma } from '../../config/database';

export class DeliveryService {
  async getAllZones(activeOnly = false) {
    return prisma.deliveryZone.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { shippingFee: 'asc' },
    });
  }

  async getZoneById(id: string) {
    const zone = await prisma.deliveryZone.findUnique({ where: { id } });
    if (!zone) throw { statusCode: 404, message: 'Delivery zone not found' };
    return zone;
  }

  async getZoneByState(state: string) {
    const zone = await prisma.deliveryZone.findFirst({
      where: {
        isActive: true,
        states: { has: state },
      },
    });
    return zone;
  }

  async createZone(data: {
    name: string;
    states: string[];
    cities?: string[];
    shippingFee: number;
    estimatedDays?: number;
    description?: string;
  }) {
    return prisma.deliveryZone.create({ data });
  }

  async updateZone(id: string, data: Partial<{
    name: string;
    states: string[];
    cities: string[];
    shippingFee: number;
    estimatedDays: number;
    isActive: boolean;
    description: string;
  }>) {
    return prisma.deliveryZone.update({ where: { id }, data });
  }

  async deleteZone(id: string) {
    await prisma.deliveryZone.delete({ where: { id } });
  }
}
