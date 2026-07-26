'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { User, Mail, Phone, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth.store';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  phone: z.string().min(10, 'Valid phone required').optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await usersApi.updateProfile(data);
      setUser(res.data.data);
      toast.success('Profile updated successfully!', { style: { borderRadius: '12px', background: '#0A4A2F', color: '#fff' } });
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="text-xl font-bold text-brand-black mb-6 flex items-center gap-2">
        <User size={20} className="text-brand-green" /> Profile Settings
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-brand-gray rounded-2xl">
        <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div>
          <p className="font-bold text-brand-black">{user?.firstName} {user?.lastName}</p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            <Mail size={13} /> {user?.email}
          </p>
          <p className="text-xs text-gray-400 mt-1">Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" leftIcon={<User size={15} />} error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input
          label="Email Address"
          type="email"
          value={user?.email}
          leftIcon={<Mail size={15} />}
          disabled
          hint="Email cannot be changed"
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+234 800 000 0000"
          leftIcon={<Phone size={15} />}
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Save size={15} />}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
