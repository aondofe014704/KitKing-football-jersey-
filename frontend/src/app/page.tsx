'use client';

import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { FlashSale } from '@/components/home/FlashSale';
import { GallerySection } from '@/components/home/GallerySection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { LatestNews } from '@/components/home/LatestNews';
import { productsApi } from '@/lib/api';

export default function HomePage() {
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getFeatured().then((r) => r.data.data.products),
  });

  const { data: newArrivalsData, isLoading: loadingNew } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productsApi.getNewArrivals().then((r) => r.data.data.products),
  });

  const { data: bestSellersData, isLoading: loadingBest } = useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => productsApi.getBestSellers().then((r) => r.data.data.products),
  });

  return (
    <MainLayout>
      <HeroBanner />
      <FeaturedCategories />

      {/* Featured Products */}
      <section className="py-14 lg:py-20 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCarousel
            title="Featured"
            highlight="Products"
            badge="⭐ Editor's Pick"
            products={featuredData || []}
            isLoading={loadingFeatured}
            viewAllHref="/shop?featured=true"
          />
        </div>
      </section>

      <FlashSale />

      {/* New Arrivals */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCarousel
            title="New"
            highlight="Arrivals"
            badge="🆕 Just Dropped"
            products={newArrivalsData || []}
            isLoading={loadingNew}
            viewAllHref="/shop?newArrival=true"
          />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-14 lg:py-20 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCarousel
            title="Best"
            highlight="Sellers"
            badge="🔥 Most Popular"
            products={bestSellersData || []}
            isLoading={loadingBest}
            viewAllHref="/shop?bestSeller=true"
          />
        </div>
      </section>

      <GallerySection />
      <WhyChooseUs />
      <Testimonials />
      <LatestNews />
    </MainLayout>
  );
}
