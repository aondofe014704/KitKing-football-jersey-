import { PrismaClient, UserRole, ProductStatus, JerseyType, CouponType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KitKing database...');

  // ─── Admin User ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@KitKing2025', 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@kitking.ng' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@kitking.ng',
      password: adminPassword,
      firstName: 'KitKing',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ─── Demo Customer ────────────────────────────────────────────────────────
  const customerPassword = await bcrypt.hash('Customer@123', 12);
  await prisma.user.upsert({
    where: { email: 'customer@kitking.ng' },
    update: {},
    create: {
      email: 'customer@kitking.ng',
      password: customerPassword,
      firstName: 'Test',
      lastName: 'Customer',
      phone: '+234 800 000 0001',
      role: UserRole.CUSTOMER,
      isVerified: true,
    },
  });

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = [
    { name: 'Club Jerseys', slug: 'club-jerseys', description: 'EPL, La Liga, Serie A and more', sortOrder: 1 },
    { name: 'National Teams', slug: 'national-teams', description: 'African and world national team kits', sortOrder: 2 },
    { name: 'Retro Classics', slug: 'retro-jerseys', description: 'Legendary kits from football history', sortOrder: 3 },
    { name: "Player's Version", slug: 'player-version', description: 'Authentic match-grade jerseys', sortOrder: 4 },
    { name: "Fan's Version", slug: 'fan-version', description: 'Great value supporter kits', sortOrder: 5 },
    { name: "Kids' Jerseys", slug: 'kids', description: 'Jerseys for young fans aged 3-14', sortOrder: 6 },
    { name: 'Training Kits', slug: 'training-kits', description: 'Training jerseys and kits', sortOrder: 7 },
    { name: 'Accessories', slug: 'accessories', description: 'Shorts, socks and accessories', sortOrder: 8 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log('✅ Categories seeded');

  // ─── Delivery Zones ───────────────────────────────────────────────────────
  const deliveryZones = [
    {
      name: 'Lagos Same-Day',
      states: ['Lagos'],
      cities: ['Lagos Island', 'Victoria Island', 'Lekki', 'Ikoyi'],
      shippingFee: 1500,
      estimatedDays: 1,
      description: 'Same-day delivery within Lagos (order before 2PM)',
    },
    {
      name: 'Lagos Standard',
      states: ['Lagos'],
      cities: [],
      shippingFee: 2000,
      estimatedDays: 2,
      description: 'Standard delivery across Lagos State',
    },
    {
      name: 'South West',
      states: ['Ogun', 'Oyo', 'Osun', 'Ekiti', 'Ondo'],
      cities: [],
      shippingFee: 2500,
      estimatedDays: 3,
      description: 'South West Nigeria states',
    },
    {
      name: 'South East',
      states: ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'],
      cities: [],
      shippingFee: 3000,
      estimatedDays: 4,
    },
    {
      name: 'South South',
      states: ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'],
      cities: [],
      shippingFee: 3000,
      estimatedDays: 4,
    },
    {
      name: 'North Central',
      states: ['Benue', 'FCT', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau'],
      cities: [],
      shippingFee: 3500,
      estimatedDays: 5,
    },
    {
      name: 'North West',
      states: ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara'],
      cities: [],
      shippingFee: 4000,
      estimatedDays: 5,
    },
    {
      name: 'North East',
      states: ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'],
      cities: [],
      shippingFee: 4000,
      estimatedDays: 6,
    },
  ];

  for (const zone of deliveryZones) {
    await prisma.deliveryZone.create({ data: zone }).catch(() => {});
  }
  console.log('✅ Delivery zones seeded');

  // ─── Products ─────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Arsenal Home Kit 2024/25',
      slug: 'arsenal-home-kit-2024-25',
      description: 'The official Arsenal home jersey for the 2024/25 season. Features Nike Dri-FIT technology for superior moisture management and a modern fit that moves with you. The iconic red and white design with the Arsenal cannon badge.',
      shortDescription: 'Official Arsenal home jersey featuring Nike Dri-FIT technology.',
      price: 18000,
      comparePrice: 22000,
      sku: 'ARS-HOME-2425',
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      team: 'Arsenal FC',
      league: 'Premier League',
      season: '2024/25',
      jerseyType: JerseyType.HOME,
      material: '100% Recycled Polyester Dri-FIT',
      tags: ['arsenal', 'premier-league', 'home-kit', 'nike', '2024-25'],
      categoryId: createdCategories['club-jerseys'],
      images: [
        { url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80', isPrimary: true, order: 0, alt: 'Arsenal Home Kit Front' },
      ],
      variants: [
        { size: 'S', stock: 8 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 12 },
        { size: 'XL', stock: 10 },
        { size: 'XXL', stock: 5 },
      ],
    },
    {
      name: 'Super Eagles AFCON 2025 Home Jersey',
      slug: 'super-eagles-afcon-2025-home',
      description: 'The official Nigeria Super Eagles jersey for AFCON 2025. Show your patriotic pride with this stunning green and white kit. Made with premium breathable fabric for maximum comfort.',
      shortDescription: 'Official Nigeria Super Eagles AFCON 2025 jersey.',
      price: 15000,
      comparePrice: 18000,
      sku: 'NGA-AFCON-2025-HOME',
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      team: 'Super Eagles',
      league: 'AFCON 2025',
      season: '2025',
      jerseyType: JerseyType.HOME,
      material: '100% Polyester',
      tags: ['super-eagles', 'nigeria', 'afcon', 'national-team', '2025'],
      categoryId: createdCategories['national-teams'],
      images: [
        { url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80', isPrimary: true, order: 0, alt: 'Super Eagles AFCON Jersey' },
      ],
      variants: [
        { size: 'S', stock: 20 },
        { size: 'M', stock: 35 },
        { size: 'L', stock: 30 },
        { size: 'XL', stock: 25 },
        { size: 'XXL', stock: 15 },
        { size: '3XL', stock: 8 },
      ],
    },
    {
      name: 'Real Madrid Away Kit 2024/25',
      slug: 'real-madrid-away-kit-2024-25',
      description: 'Official Real Madrid away jersey for the 2024/25 Champions League season. Premium Adidas HEAT.RDY technology. The iconic white with purple accents design.',
      shortDescription: 'Official Real Madrid away jersey — Champions League edition.',
      price: 20000,
      comparePrice: 25000,
      sku: 'RMA-AWAY-2425',
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      team: 'Real Madrid CF',
      league: 'La Liga',
      season: '2024/25',
      jerseyType: JerseyType.AWAY,
      material: 'Adidas HEAT.RDY Recycled Polyester',
      tags: ['real-madrid', 'la-liga', 'away-kit', 'adidas', 'champions-league'],
      categoryId: createdCategories['club-jerseys'],
      images: [
        { url: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?w=600&q=80', isPrimary: true, order: 0, alt: 'Real Madrid Away Kit' },
      ],
      variants: [
        { size: 'S', stock: 5 },
        { size: 'M', stock: 10 },
        { size: 'L', stock: 8 },
        { size: 'XL', stock: 7 },
        { size: 'XXL', stock: 3 },
      ],
    },
    {
      name: 'Brazil 1970 World Cup Retro Jersey',
      slug: 'brazil-1970-world-cup-retro',
      description: 'Celebrate the greatest team in World Cup history with this stunning retro reproduction of Brazil\'s iconic 1970 World Cup jersey. The yellow and green kit worn by Pelé, Jairzinho, and Tostão.',
      shortDescription: 'Iconic Brazil 1970 World Cup retro jersey — the Pelé era.',
      price: 16000,
      comparePrice: 19000,
      sku: 'BRA-1970-WC-RETRO',
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      team: 'Brazil National Team',
      league: 'World Cup 1970',
      season: '1970',
      jerseyType: JerseyType.HOME,
      material: 'Premium Cotton Blend',
      tags: ['brazil', 'retro', 'world-cup', '1970', 'pele', 'classic'],
      categoryId: createdCategories['retro-jerseys'],
      images: [
        { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80', isPrimary: true, order: 0, alt: 'Brazil 1970 Retro Jersey' },
      ],
      variants: [
        { size: 'S', stock: 6 },
        { size: 'M', stock: 12 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 8 },
        { size: 'XXL', stock: 4 },
      ],
    },
    {
      name: 'Manchester City Home Kit 2024/25',
      slug: 'manchester-city-home-kit-2024-25',
      description: 'The official Manchester City home jersey for the 2024/25 Premier League season. Features the iconic sky blue design with Puma technology for elite performance.',
      shortDescription: 'Official Man City home jersey — Premier League 2024/25.',
      price: 18500,
      comparePrice: 23000,
      sku: 'MCI-HOME-2425',
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      team: 'Manchester City FC',
      league: 'Premier League',
      season: '2024/25',
      jerseyType: JerseyType.HOME,
      material: 'Puma Drycell Technology',
      tags: ['man-city', 'premier-league', 'home-kit', 'puma', '2024-25'],
      categoryId: createdCategories['club-jerseys'],
      images: [
        { url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=600&q=80', isPrimary: true, order: 0, alt: 'Manchester City Home Kit' },
      ],
      variants: [
        { size: 'S', stock: 7 },
        { size: 'M', stock: 14 },
        { size: 'L', stock: 11 },
        { size: 'XL', stock: 9 },
        { size: 'XXL', stock: 4 },
      ],
    },
    {
      name: 'Barcelona Home Kit 2024/25',
      slug: 'barcelona-home-kit-2024-25',
      description: 'The iconic Barcelona home jersey for 2024/25. The famous blaugrana stripes with Nike Dri-FIT technology. Worn by the next generation of Barça stars at Camp Nou.',
      shortDescription: 'Official FC Barcelona home jersey 2024/25.',
      price: 19000,
      comparePrice: 24000,
      sku: 'BAR-HOME-2425',
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      team: 'FC Barcelona',
      league: 'La Liga',
      season: '2024/25',
      jerseyType: JerseyType.HOME,
      material: 'Nike Dri-FIT ADV',
      tags: ['barcelona', 'la-liga', 'home-kit', 'nike', 'blaugrana'],
      categoryId: createdCategories['club-jerseys'],
      images: [
        { url: 'https://images.unsplash.com/photo-1559181567-c3190ca9d222?w=600&q=80', isPrimary: true, order: 0, alt: 'Barcelona Home Kit' },
      ],
      variants: [
        { size: 'S', stock: 8 },
        { size: 'M', stock: 16 },
        { size: 'L', stock: 13 },
        { size: 'XL', stock: 10 },
        { size: 'XXL', stock: 5 },
      ],
    },
  ];

  for (const productData of products) {
    const { images, variants, ...data } = productData;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...data,
        images: { create: images },
        variants: { create: variants },
      },
    });
  }
  console.log('✅ Products seeded');

  // ─── Coupons ──────────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: CouponType.PERCENTAGE,
      value: 10,
      description: '10% off your first order',
      minOrderAmount: 10000,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'SAVE2000' },
    update: {},
    create: {
      code: 'SAVE2000',
      type: CouponType.FIXED,
      value: 2000,
      description: '₦2,000 off orders above ₦20,000',
      minOrderAmount: 20000,
      maxUses: 500,
      isActive: true,
    },
  });
  console.log('✅ Coupons seeded');

  // ─── Gallery ──────────────────────────────────────────────────────────────
  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', title: 'Club Collection', sortOrder: 1 },
    { url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80', title: 'Match Day Kits', sortOrder: 2 },
    { url: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?w=800&q=80', title: 'National Team Jerseys', sortOrder: 3 },
    { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', title: 'Retro Classics', sortOrder: 4 },
    { url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&q=80', title: 'Premium Kits', sortOrder: 5 },
    { url: 'https://images.unsplash.com/photo-1559181567-c3190ca9d222?w=800&q=80', title: 'Away Jerseys', sortOrder: 6 },
  ];

  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img }).catch(() => {});
  }
  console.log('✅ Gallery images seeded');

  // ─── Settings ─────────────────────────────────────────────────────────────
  const defaultSettings = [
    { key: 'businessName', value: 'KitKing Nigeria', group: 'general' },
    { key: 'businessEmail', value: 'hello@kitking.ng', group: 'general' },
    { key: 'businessPhone', value: '+234 800 000 0000', group: 'general' },
    { key: 'businessAddress', value: '123 Sports Avenue', group: 'general' },
    { key: 'businessCity', value: 'Lagos Island', group: 'general' },
    { key: 'businessState', value: 'Lagos', group: 'general' },
    { key: 'freeShippingThreshold', value: '50000', group: 'shipping' },
    { key: 'defaultShippingFee', value: '2500', group: 'shipping' },
    { key: 'whatsappNumber', value: '+234 800 000 0000', group: 'contact' },
    { key: 'instagramUrl', value: 'https://instagram.com/kitking', group: 'social' },
    { key: 'twitterUrl', value: 'https://x.com/kitking', group: 'social' },
    { key: 'facebookUrl', value: 'https://facebook.com/kitking', group: 'social' },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Settings seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('─────────────────────────────────');
  console.log('Admin Login:');
  console.log('  Email:', process.env.ADMIN_EMAIL || 'admin@kitking.ng');
  console.log('  Password:', process.env.ADMIN_PASSWORD || 'Admin@KitKing2025');
  console.log('─────────────────────────────────');
  console.log('Demo Customer:');
  console.log('  Email: customer@kitking.ng');
  console.log('  Password: Customer@123');
  console.log('─────────────────────────────────');
  console.log('Coupon Codes: WELCOME10, SAVE2000');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
