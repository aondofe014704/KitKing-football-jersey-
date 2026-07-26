'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Trash2, Star, Search } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', filter],
    queryFn: () =>
      adminApi.getReviews({ approved: filter === 'ALL' ? '' : filter === 'APPROVED' ? 'true' : 'false' })
        .then((r) => r.data.data),
  });

  const approveReview = useMutation({
    mutationFn: (id: string) => adminApi.updateReview(id, { isApproved: true }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review approved'); },
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) => adminApi.updateReview(id, { deleted: true }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review deleted'); },
  });

  const reviews = data?.reviews || data || [];

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'APPROVED'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === f ? 'bg-brand-green text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-[#1C2128] border border-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="bg-[#1C2128] rounded-2xl p-12 text-center text-white/30">No reviews found</div>
          ) : (
            reviews.map((review: {
              id: string; rating: number; title: string; body: string;
              isApproved: boolean; createdAt: string;
              user?: { firstName: string; lastName: string };
              product?: { name: string };
            }) => (
              <div key={review.id} className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-semibold text-sm">
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < review.rating ? 'fill-brand-gold text-brand-gold' : 'fill-white/20 text-white/20'} />
                        ))}
                      </div>
                      {!review.isApproved && (
                        <span className="text-xs bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full">Pending</span>
                      )}
                      {review.isApproved && (
                        <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">Approved</span>
                      )}
                    </div>
                    {review.product?.name && (
                      <p className="text-white/40 text-xs mb-2">Product: {review.product.name}</p>
                    )}
                    <p className="text-white font-medium text-sm mb-1">{review.title}</p>
                    <p className="text-white/60 text-sm">{review.body}</p>
                    <p className="text-white/30 text-xs mt-2">{formatDate(review.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!review.isApproved && (
                      <button onClick={() => approveReview.mutate(review.id)}
                        className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors">
                        <CheckCircle size={15} />
                      </button>
                    )}
                    <button onClick={() => confirm('Delete this review?') && deleteReview.mutate(review.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
