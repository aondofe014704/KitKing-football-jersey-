'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Store, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

type SettingsForm = {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  paystackPublicKey: string;
  flutterwavePublicKey: string;
  freeShippingThreshold: string;
  defaultShippingFee: string;
  whatsappNumber: string;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
};

function AdminField({ label, icon: Icon, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string; icon?: React.ElementType; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />}
        <input
          className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-green/50 ${Icon ? 'pl-9' : ''} ${error ? 'border-red-500/50' : 'border-white/10'}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset } = useForm<SettingsForm>();

  const { data: settings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminApi.getSettings().then((r) => r.data.data),
  });

  useEffect(() => {
    if (settings) {
      const s: Record<string, string> = {};
      (settings as { key: string; value: string }[]).forEach(({ key, value }) => { s[key] = value; });
      reset(s as SettingsForm);
    }
  }, [settings, reset]);

  const saveSettings = useMutation({
    mutationFn: (data: object) => adminApi.updateSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings saved!');
    },
    onError: () => toast.error('Failed to save settings'),
  });

  const sections = [
    {
      title: 'Business Information',
      icon: Store,
      fields: [
        { name: 'businessName' as const, label: 'Business Name', icon: Store, placeholder: 'KitKing Nigeria' },
        { name: 'businessEmail' as const, label: 'Business Email', icon: Mail, placeholder: 'hello@kitking.ng', type: 'email' },
        { name: 'businessPhone' as const, label: 'Phone Number', icon: Phone, placeholder: '+234 800 000 0000' },
        { name: 'whatsappNumber' as const, label: 'WhatsApp Number', icon: Phone, placeholder: '+234 800 000 0000' },
        { name: 'businessAddress' as const, label: 'Street Address', icon: MapPin, placeholder: '123 Sports Avenue' },
        { name: 'businessCity' as const, label: 'City', icon: MapPin, placeholder: 'Lagos Island' },
      ],
    },
    {
      title: 'Payment Settings',
      icon: Globe,
      fields: [
        { name: 'paystackPublicKey' as const, label: 'Paystack Public Key', placeholder: 'pk_live_...' },
        { name: 'flutterwavePublicKey' as const, label: 'Flutterwave Public Key', placeholder: 'FLWPUBK_...' },
      ],
    },
    {
      title: 'Shipping Settings',
      icon: Globe,
      fields: [
        { name: 'freeShippingThreshold' as const, label: 'Free Shipping Threshold (₦)', placeholder: '50000', type: 'number' },
        { name: 'defaultShippingFee' as const, label: 'Default Shipping Fee (₦)', placeholder: '2500', type: 'number' },
      ],
    },
    {
      title: 'Social Media',
      icon: Globe,
      fields: [
        { name: 'instagramUrl' as const, label: 'Instagram URL', placeholder: 'https://instagram.com/kitking' },
        { name: 'twitterUrl' as const, label: 'Twitter/X URL', placeholder: 'https://x.com/kitking' },
        { name: 'facebookUrl' as const, label: 'Facebook URL', placeholder: 'https://facebook.com/kitking' },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit((data) => saveSettings.mutate(data))} className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button type="submit" isLoading={saveSettings.isPending} leftIcon={<Save size={14} />}>
          Save All Settings
        </Button>
      </div>

      {sections.map(({ title, fields }) => (
        <div key={title} className="bg-[#1C2128] rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold text-white/80 mb-5">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ name, label, icon, placeholder, type }) => (
              <AdminField
                key={name}
                label={label}
                icon={icon}
                placeholder={placeholder}
                type={type || 'text'}
                {...register(name)}
              />
            ))}
          </div>
        </div>
      ))}
    </form>
  );
}
