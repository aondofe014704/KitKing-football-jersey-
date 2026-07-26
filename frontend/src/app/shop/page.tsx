'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { productsApi, categoriesApi } from '@/lib/api';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const LEAGUES = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'AFCON', 'World Cup'];
const PRICE_RANGES = [
  { label: 'Under ₦10,000', min: '0', max: '10000' },
  { label: '₦10,000 – ₦20,000', min: '10000', max: '20000' },
  { label: '₦20,000 – ₦30,000', min: '20000', max: '30000' },
  { label: '₦30,000 – ₦50,000', min: '30000', max: '50000' },
  { label: 'Over ₦50,000', min: '50000', max: '' },
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name A-Z' },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const params = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    league: searchParams.get('league') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    featured: searchParams.get('featured') || '',
    newArrival: searchParams.get('newArrival') || '',
    bestSeller: searchParams.get('bestSeller') || '',
    page: String(page),
    limit: '20',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: () =>
      productsApi.getAll(params).then((r) => r.data.data),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.data),
  });

  const updateParam = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (value) sp.set(key, value);
      else sp.delete(key);
      setPage(1);
      router.push(`/shop?${sp.toString()}`);
    },
    [searchParams, router]
  );

  const clearFilters = () => {
    router.push('/shop');
    setPage(1);
  };

  const hasFilters = !!(params.search || params.category || params.league || params.minPrice || params.maxPrice);

  const products = data?.products || [];
  const meta = data?.meta;

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-brand-green-dark to-brand-green py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-white/60 text-sm mb-3">
            <span>Home</span> <span className="mx-2">/</span> <span className="text-white">Shop</span>
          </nav>
          <h1 className="text-4xl font-display text-white">
            All <span className="text-brand-gold">Jerseys</span>
          </h1>
          {meta && (
            <p className="text-white/70 text-sm mt-1">{meta.total} jerseys available</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              defaultValue={params.search}
              placeholder="Search jerseys..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green bg-white"
            />
          </div>

          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-brand-green hover:text-brand-green bg-white transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
          </button>

          <div className="flex-1" />

          {/* Sort */}
          <div className="w-48">
            <Select
              options={SORT_OPTIONS}
              value={params.sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="py-2.5"
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`w-64 shrink-0 hidden lg:block`}
          >
            <FilterSidebar
              params={params}
              categories={categoriesData || []}
              onUpdate={updateParam}
            />
          </aside>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setFiltersOpen(false)}
              >
                <div className="absolute inset-0 bg-black/40" />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30 }}
                  className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-bold text-brand-black">Filters</h2>
                    <button onClick={() => setFiltersOpen(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar
                      params={params}
                      categories={categoriesData || []}
                      onUpdate={(k, v) => {
                        updateParam(k, v);
                        setFiltersOpen(false);
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} isLoading={isLoading} columns={3} />

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
                      p === page
                        ? 'bg-brand-green text-white'
                        : 'border hover:border-brand-green hover:text-brand-green'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// ─── Filter Sidebar Component ─────────────────────────────────────────────────
interface FilterSidebarProps {
  params: Record<string, string>;
  categories: { id: string; name: string; slug: string }[];
  onUpdate: (key: string, value: string) => void;
}

function FilterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-bold text-brand-black mb-3"
      >
        {title}
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function FilterSidebar({ params, categories, onUpdate }: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card sticky top-24">
      <h3 className="font-bold text-brand-black mb-5 text-base">Filter Jerseys</h3>

      {/* Categories */}
      <FilterAccordion title="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={params.category === cat.id}
                onChange={(e) => onUpdate('category', e.target.value)}
                className="accent-brand-green"
              />
              <span className="text-sm text-gray-600 group-hover:text-brand-green transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
          {params.category && (
            <button
              onClick={() => onUpdate('category', '')}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
      </FilterAccordion>

      {/* League */}
      <FilterAccordion title="League / Competition">
        <div className="space-y-2">
          {LEAGUES.map((league) => (
            <label key={league} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="league"
                value={league}
                checked={params.league === league}
                onChange={(e) => onUpdate('league', e.target.value)}
                className="accent-brand-green"
              />
              <span className="text-sm text-gray-600 group-hover:text-brand-green transition-colors">
                {league}
              </span>
            </label>
          ))}
          {params.league && (
            <button
              onClick={() => onUpdate('league', '')}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
      </FilterAccordion>

      {/* Price */}
      <FilterAccordion title="Price Range">
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={params.minPrice === range.min && params.maxPrice === range.max}
                onChange={() => {
                  onUpdate('minPrice', range.min);
                  onUpdate('maxPrice', range.max);
                }}
                className="accent-brand-green"
              />
              <span className="text-sm text-gray-600 group-hover:text-brand-green transition-colors">
                {range.label}
              </span>
            </label>
          ))}
          {(params.minPrice || params.maxPrice) && (
            <button
              onClick={() => { onUpdate('minPrice', ''); onUpdate('maxPrice', ''); }}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
      </FilterAccordion>

      {/* Availability */}
      <FilterAccordion title="Availability">
        <div className="space-y-2">
          {['In Stock', 'On Sale', 'New Arrivals'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="accent-brand-green" />
              <span className="text-sm text-gray-600 group-hover:text-brand-green transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <Button variant="outline" size="sm" fullWidth onClick={() => onUpdate('', '')}>
        Clear All Filters
      </Button>
    </div>
  );
}
