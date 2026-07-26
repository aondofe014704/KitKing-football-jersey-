'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog', page],
    queryFn: () => adminApi.getBlogPosts({ page, limit: 20 }).then((r) => r.data.data),
  });

  const deletePost = useMutation({
    mutationFn: (id: string) => adminApi.deleteBlogPost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Post deleted');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const posts = data?.posts || data || [];

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
          <Plus size={15} /> New Post
        </Link>
      </div>

      <div className="bg-[#1C2128] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Title', 'Status', 'Views', 'Published', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-white/40 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-8 bg-white/5 rounded animate-pulse" /></td></tr>
                ))
              : posts.map((post: {
                  id: string; title: string; slug: string;
                  isPublished: boolean; viewCount: number; publishedAt?: string; createdAt: string;
                }) => (
                  <tr key={post.id} className="hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText size={14} className="text-white/30 shrink-0" />
                        <span className="text-white text-xs font-medium line-clamp-1 max-w-[280px]">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.isPublished ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{post.viewCount}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Link href={`/blog/${post.slug}`}
                          className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                          <Eye size={12} />
                        </Link>
                        <Link href={`/admin/blog/${post.id}/edit`}
                          className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                          <Edit size={12} />
                        </Link>
                        <button onClick={() => confirm('Delete this post?') && deletePost.mutate(post.id)}
                          className="p-1.5 bg-white/5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!isLoading && posts.length === 0 && (
          <div className="py-16 text-center">
            <FileText size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No blog posts yet</p>
            <Link href="/admin/blog/new" className="text-brand-green text-sm hover:underline mt-2 inline-block">
              Write your first post →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
