'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword: _, ...payload } = data;
      const res = await authApi.register(payload);
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome to KitKing, ${user.firstName}! 🎉`, {
        style: { borderRadius: '12px', background: '#0A4A2F', color: '#fff' },
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-green relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_70%,white,transparent)]" />
        <Logo variant="light" size="lg" />
        <div>
          <h1 className="text-5xl font-display text-white leading-tight mb-4">
            Join the<br /><span className="text-brand-gold">KitKing</span><br />Family
          </h1>
          <p className="text-white/70 text-base max-w-xs">
            Create your account and get access to exclusive deals, faster checkout, order tracking, and our premium jersey collection.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: '500+', sub: 'Jersey Styles' },
              { label: '10K+', sub: 'Happy Customers' },
              { label: '2-5', sub: 'Days Delivery' },
              { label: '100%', sub: 'Authentic' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-display text-brand-gold">{s.label}</div>
                <div className="text-white/60 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()} KitKing. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-6"
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <h2 className="text-2xl font-display text-brand-black mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm mb-6">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-green font-semibold hover:underline">Sign in</Link>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  placeholder="John"
                  leftIcon={<User size={15} />}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                leftIcon={<Mail size={15} />}
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+234 800 000 0000"
                leftIcon={<Phone size={15} />}
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                leftIcon={<Lock size={15} />}
                rightIcon={showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                error={errors.password?.message}
                hint="Use a mix of letters, numbers and symbols"
                {...register('password')}
              />
              <Input
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                leftIcon={<Lock size={15} />}
                rightIcon={showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                onRightIconClick={() => setShowConfirm(!showConfirm)}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" required className="accent-brand-green mt-0.5" />
                I agree to the{' '}
                <Link href="/terms" className="text-brand-green hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-brand-green hover:underline">Privacy Policy</Link>
              </label>

              <Button type="submit" isLoading={isSubmitting} fullWidth size="lg" rightIcon={<ArrowRight size={16} />}>
                Create Account
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
