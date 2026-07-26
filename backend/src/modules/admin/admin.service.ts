import { prisma } from '../../config/database';

export class AdminService {
  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      totalOrders,
      monthlyOrders,
      totalCustomers,
      newCustomers,
      totalProducts,
      pendingOrders,
      lowStockVariants,
      recentOrders,
    ] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      // Monthly revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),
      // Last month revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { total: true },
      }),
      // Total orders
      prisma.order.count(),
      // Monthly orders
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Total customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      // New customers this month
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } },
      }),
      // Total products
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      // Pending orders
      prisma.order.count({ where: { status: 'PENDING' } }),
      // Low stock
      prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { take: 1 },
        },
      }),
    ]);

    const revenueGrowth = lastMonthRevenue._sum.total
      ? (((monthlyRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) /
          (lastMonthRevenue._sum.total || 1)) *
        100
      : 0;

    return {
      revenue: {
        total: totalRevenue._sum.total || 0,
        monthly: monthlyRevenue._sum.total || 0,
        lastMonthly: lastMonthRevenue._sum.total || 0,
        growth: Math.round(revenueGrowth * 100) / 100,
      },
      orders: {
        total: totalOrders,
        monthly: monthlyOrders,
        pending: pendingOrders,
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockVariants,
      },
      recentOrders,
    };
  }

  async getSalesChart(period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;
    let groupByFormat: string;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupByFormat = 'day';
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupByFormat = 'month';
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupByFormat = 'day';
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: 'PAID',
      },
      select: { total: true, createdAt: true },
    });

    // Group by day/month
    const grouped = orders.reduce((acc, order) => {
      const key =
        groupByFormat === 'month'
          ? `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`
          : `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}-${String(order.createdAt.getDate()).padStart(2, '0')}`;

      if (!acc[key]) acc[key] = { date: key, revenue: 0, orders: 0 };
      acc[key].revenue += order.total;
      acc[key].orders += 1;
      return acc;
    }, {} as Record<string, { date: string; revenue: number; orders: number }>);

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTopProducts(limit = 10) {
    return prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });
  }

  async getSettings() {
    const settings = await prisma.setting.findMany();
    return settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async updateSettings(settings: Record<string, string>) {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    return this.getSettings();
  }
}
