'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Truck, Edit } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT'
];

export default function AdminDeliveryPage() {
  const [showModal, setShowModal] = useState(false);
  const qc = useQueryClient();

  const { data: zones, isLoading } = useQuery({
    queryKey: ['admin-delivery'],
    queryFn: () => adminApi.getDeliveryZones().then((r) => r.data.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: '', states: '', shippingFee: '', estimatedDays: '3', description: '',
    },
  });

  const createZone = useMutation({
    mutationFn: (data: object) => adminApi.createDeliveryZone(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-delivery'] });
      toast.success('Delivery zone created');
      setShowModal(false);
      reset();
    },
    onError: () => toast.error('Failed to create zone'),
  });

  const onSubmit = (data: { name: string; states: string; shippingFee: string; estimatedDays: string; description: string }) => {
    createZone.mutate({
      name: data.name,
      states: data.states.split(',').map((s) => s.trim()),
      shippingFee: parseFloat(data.shippingFee),
      estimatedDays: parseInt(data.estimatedDays),
      description: data.description,
    });
  };

  return (
    <div className="space-y-5 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Delivery Zones</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green-light transition-colors">
          <Plus size={15} /> Add Zone
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-[#1C2128] border border-white/5 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(zones || []).map((zone: {
            id: string; name: string; states: string[];
            shippingFee: number; estimatedDays: number; description?: string;
          }) => (
            <div key={zone.id} className="bg-[#1C2128] rounded-2xl p-5 border border-white/5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <Truck size={18} className="text-brand-green" />
                </div>
                <button className="p-1.5 text-white/30 hover:text-white transition-colors">
                  <Edit size={13} />
                </button>
              </div>
              <h3 className="font-bold text-white mb-1">{zone.name}</h3>
              {zone.description && <p className="text-white/40 text-xs mb-3">{zone.description}</p>}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-green-400">{formatPrice(zone.shippingFee)}</span>
                <span className="text-white/40 text-xs">{zone.estimatedDays} days</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {zone.states.slice(0, 4).map((state) => (
                  <span key={state} className="text-[10px] bg-white/5 text-white/50 px-2 py-0.5 rounded-full">{state}</span>
                ))}
                {zone.states.length > 4 && (
                  <span className="text-[10px] bg-white/5 text-white/50 px-2 py-0.5 rounded-full">+{zone.states.length - 4} more</span>
                )}
              </div>
            </div>
          ))}
          {(!zones || zones.length === 0) && (
            <div className="col-span-3 py-16 text-center text-white/30">No delivery zones configured</div>
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="Add Delivery Zone">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone Name *</label>
            <input placeholder="e.g. Lagos Delivery" {...register('name', { required: true })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">States (comma separated) *</label>
            <input placeholder="Lagos, Ogun, Oyo" {...register('states', { required: true })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping Fee (₦) *</label>
              <input type="number" placeholder="2500" {...register('shippingFee', { required: true })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Days</label>
              <input type="number" placeholder="3" {...register('estimatedDays')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <input placeholder="Delivery details..." {...register('description')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30" />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Plus size={14} />}>Create Zone</Button>
            <button type="button" onClick={() => { setShowModal(false); reset(); }}
              className="px-4 py-2.5 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
