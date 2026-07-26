'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { usersApi, authApi } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { UserAddress } from '@/types/user';
import toast from 'react-hot-toast';

const STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT'];

const schema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(10),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});
type FormData = z.infer<typeof schema>;

export default function AddressesPage() {
  const { user, setUser } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addresses: UserAddress[] = user?.addresses || [];

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const refreshUser = async () => {
    try {
      const res = await authApi.me();
      setUser(res.data.data);
    } catch {}
  };

  const openAdd = () => { reset(); setEditingId(null); setShowModal(true); };
  const openEdit = (addr: UserAddress) => {
    setValue('fullName', addr.fullName);
    setValue('phone', addr.phone);
    setValue('street', addr.street);
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('postalCode', addr.postalCode || '');
    setValue('isDefault', addr.isDefault);
    setEditingId(addr.id);
    setShowModal(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await usersApi.updateAddress(editingId, data);
        toast.success('Address updated');
      } else {
        await usersApi.addAddress(data);
        toast.success('Address added');
      }
      await refreshUser();
      setShowModal(false);
      reset();
    } catch {
      toast.error('Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await usersApi.deleteAddress(id);
      toast.success('Address removed');
      await refreshUser();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
          <MapPin size={20} className="text-brand-green" /> My Addresses
        </h2>
        <Button onClick={openAdd} leftIcon={<Plus size={14} />} size="sm">Add Address</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={44} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No saved addresses yet</p>
          <Button onClick={openAdd} leftIcon={<Plus size={14} />} size="sm">Add Your First Address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`p-4 rounded-2xl border-2 transition-colors ${addr.isDefault ? 'border-brand-green bg-brand-green/5' : 'border-gray-100'}`}>
              {addr.isDefault && (
                <span className="inline-flex items-center gap-1 text-xs bg-brand-green text-white px-2 py-0.5 rounded-full mb-2">
                  <Star size={10} className="fill-white" /> Default
                </span>
              )}
              <p className="font-bold text-brand-black text-sm">{addr.fullName}</p>
              <p className="text-gray-500 text-xs mt-1">{addr.phone}</p>
              <p className="text-gray-600 text-sm mt-2">
                {addr.street},<br />{addr.city}, {addr.state}{addr.postalCode ? ` ${addr.postalCode}` : ''}<br />Nigeria
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(addr)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-green border border-brand-green/30 rounded-lg hover:bg-brand-green hover:text-white transition-colors">
                  <Edit size={11} /> Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title={editingId ? 'Edit Address' : 'Add New Address'}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} required />
            <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} required />
          </div>
          <Input label="Street Address" placeholder="123 Sports Avenue, Victoria Island" error={errors.street?.message} {...register('street')} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City / LGA" placeholder="Lagos Island" error={errors.city?.message} {...register('city')} required />
            <Select
              label="State"
              options={STATES.map((s) => ({ value: s, label: s }))}
              placeholder="Select State"
              error={errors.state?.message}
              {...register('state')}
              required
            />
          </div>
          <Input label="Postal Code (optional)" placeholder="100001" {...register('postalCode')} />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" {...register('isDefault')} className="accent-brand-green" />
            Set as default address
          </label>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSubmitting} leftIcon={<MapPin size={14} />}>
              {editingId ? 'Update Address' : 'Save Address'}
            </Button>
            <button type="button" onClick={() => { setShowModal(false); reset(); }}
              className="px-4 py-2.5 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
