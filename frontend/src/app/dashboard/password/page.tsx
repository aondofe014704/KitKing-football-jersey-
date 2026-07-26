'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function PasswordPage() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed! Please sign in again.');
      reset();
      clearAuth();
      router.push('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="text-xl font-bold text-brand-black mb-2 flex items-center gap-2">
        <Lock size={20} className="text-brand-green" /> Change Password
      </h2>
      <p className="text-gray-500 text-sm mb-6">Choose a strong password to keep your account secure.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Input
          label="Current Password"
          type={showCurrent ? 'text' : 'password'}
          leftIcon={<Lock size={15} />}
          rightIcon={showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          onRightIconClick={() => setShowCurrent(!showCurrent)}
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <Input
          label="New Password"
          type={showNew ? 'text' : 'password'}
          leftIcon={<Lock size={15} />}
          rightIcon={showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          onRightIconClick={() => setShowNew(!showNew)}
          error={errors.newPassword?.message}
          hint="Minimum 8 characters"
          {...register('newPassword')}
        />
        <Input
          label="Confirm New Password"
          type={showConfirm ? 'text' : 'password'}
          leftIcon={<Lock size={15} />}
          rightIcon={showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          onRightIconClick={() => setShowConfirm(!showConfirm)}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
          ⚠️ Changing your password will sign you out of all devices.
        </div>

        <Button type="submit" isLoading={isSubmitting} leftIcon={<Lock size={15} />}>
          Update Password
        </Button>
      </form>
    </div>
  );
}
