'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

const posts = [
  {
    id: '1',
    title: 'Premier League 2024/25 Kits: Every Club\'s Home & Away Jersey Ranked',
    excerpt: 'We take a deep dive into all 20 Premier League clubs\' new kits for the upcoming season.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0d?w=400&q=80',
    category: 'New Kits',
    date: 'Jan 15, 2025',
    slug: 'pl-2024-25-kits-ranked',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Super Eagles AFCON 2025 Jersey: Everything You Need to Know',
    excerpt: 'Nigeria\'s new AFCON 2025 kit is here. We break down the design, technology, and where to buy.',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80',
    category: 'National Teams',
    date: 'Jan 10, 2025',
    slug: 'super-eagles-afcon-2025-jersey',
    readTime: '4 min read',
  },
  {
    id: '3',
    title: 'The 10 Most Iconic Retro Jerseys in Football History',
    excerpt: 'From the 1970 Brazil World Cup kit to Italy\'s 1982 classic — the retro jerseys that defined eras.',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80',
    category: 'Retro',
    date: 'Jan 5, 2025',
    slug: '10-most-iconic-retro-jerseys',
    readTime: '7 min read',
  },
];

const categoryColors: Record<string, string> = {
  'New Kits': 'bg-brand-green text-white',
  'National Teams': 'bg-brand-gold text-white',
  'Retro': 'bg-purple-500 text-white',
};

export function LatestNews() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">Jersey News</span>
            <h2 className="text-3xl lg:text-4xl font-display text-brand-black mt-1">
              Latest <span className="text-brand-green">Articles</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-dark group"
          >
            All Articles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative overflow-hidden rounded-2xl aspect-video mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${categoryColors[post.category] || 'bg-gray-500 text-white'}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-brand-black text-base leading-tight group-hover:text-brand-green transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
