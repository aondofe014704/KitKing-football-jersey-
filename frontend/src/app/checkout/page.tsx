'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, CreditCard, Building2, Smartphone, ChevronRight, Lock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { ordersApi, paymentsApi, deliveryApi } from '@/lib/api';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import { DeliveryZone } from '@/types/order';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT'
];

const schema = z.object({
  fullName: z.string().min(3, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  paymentMethod: z.enum(['PAYSTACK', 'FLUTTERWAVE', 'BANK_TRANSFER']),
  deliveryZoneId: z.string().optional(),
  notes: z.string().optional(),
});
type CheckoutForm = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: zones } = useQuery<DeliveryZone[]>({
    queryKey: ['delivery-zones'],
    queryFn: () => deliveryApi.getZones().then((r) => r.data.data),
  });

  const subtotal = getTotal();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email || '',
      phone: user?.phone || '',
      paymentMethod: 'PAYSTACK',
    },
  });

  const selectedState = watch('state');
  const paymentMethod = watch('paymentMethod');
  const selectedZoneId = watch('deliveryZoneId');

  // Auto-select delivery zone based on state
  useEffect(() => {
    if (selectedState && zones) {
      const zone = zones.find((z) => z.states.includes(selectedState));
      if (zone) setValue('deliveryZoneId', zone.id);
    }
  }, [selectedState, zones, setValue]);

  const selectedZone = zones?.find((z) => z.id === selectedZoneId);
  const shippingFee = selectedZone?.shippingFee ?? (subtotal >= 50000 ? 0 : 2500);
  const total = subtotal + shippingFee;

  const onSubmit = async (data: CheckoutForm) => {
    if (!isAuthenticated) { router.push('/login?redirect=/checkout'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setIsProcessing(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          country: 'Nigeria',
        },
        paymentMethod: data.paymentMethod,
        deliveryZoneId: data.deliveryZoneId,
        notes: data.notes,
        subtotal,
        shippingFee,
        total,
      };

      const orderRes = await ordersApi.create(orderPayload);
      const order = orderRes.data.data;

      if (data.paymentMethod === 'PAYSTACK') {
        const payRes = await paymentsApi.initializePaystack({
          orderId: order.id,
          amount: total,
          email: data.email,
        });
        const { authorizationUrl } = payRes.data.data;
        clearCart();
        window.location.href = authorizationUrl;
      } else if (data.paymentMethod === 'FLUTTERWAVE') {
        const payRes = await paymentsApi.initializeFlutterwave({
          orderId: order.id,
          amount: total,
          email: data.email,
          name: data.fullName,
          phone: data.phone,
        });
        const { paymentLink } = payRes.data.data;
        clearCart();
        window.location.href = paymentLink;
      } else {
        // Bank transfer
        clearCart();
        router.push(`/dashboard/orders/${order.id}?payment=bank_transfer`);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Order failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <MainLayout>
      <div className="bg-white border-b py-5 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>Cart</span><ChevronRight size={12} />
            <span className={step === 1 ? 'text-brand-green font-semibold' : ''}>Shipping</span>
            <ChevronRight size={12} />
            <span className={step === 2 ? 'text-brand-green font-semibold' : ''}>Payment</span>
          </div>
          <h1 className="text-3xl font-display text-brand-black">Secure Checkout</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-bold text-brand-black text-lg mb-5 flex items-center gap-2">
                  <MapPin size={18} className="text-brand-green" /> Delivery Information
                </h2>
                <div className="space-y-4">
                  <Input label="Full Name" placeholder="John Doe" error={errors.fullName?.message} {...register('fullName')} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Email" type="email" placeholder="email@example.com" error={errors.email?.message} {...register('email')} required />
                    <Input label="Phone" type="tel" placeholder="+234 800 000 0000" error={errors.phone?.message} {...register('phone')} required />
                  </div>
                  <Input label="Street Address" placeholder="123 Sports Avenue, Victoria Island" error={errors.street?.message} {...register('street')} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="City / LGA" placeholder="Lagos Island" error={errors.city?.message} {...register('city')} required />
                    <Select
                      label="State"
                      options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))}
                      placeholder="Select State"
                      error={errors.state?.message}
                      {...register('state')}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Zone Display */}
              {selectedZone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-green-800">{selectedZone.name}</p>
                      <p className="text-green-600 text-sm mt-0.5">
                        Estimated delivery: {selectedZone.estimatedDays} business days
                      </p>
                    </div>
                    <span className="font-bold text-green-700">
                      {selectedZone.shippingFee === 0 ? 'FREE' : formatPrice(selectedZone.shippingFee)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Order Notes */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Order Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  placeholder="Any special instructions for your order..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green resize-none"
                  rows={3}
                  {...register('notes')}
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-bold text-brand-black text-lg mb-5 flex items-center gap-2">
                  <CreditCard size={18} className="text-brand-green" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'PAYSTACK', label: 'Paystack', sub: 'Pay securely with card, bank transfer or USSD', icon: CreditCard, color: 'text-blue-600' },
                    { value: 'FLUTTERWAVE', label: 'Flutterwave', sub: 'Pay with card, mobile money or bank', icon: Smartphone, color: 'text-orange-500' },
                    { value: 'BANK_TRANSFER', label: 'Direct Bank Transfer', sub: 'Transfer to our bank account manually', icon: Building2, color: 'text-gray-600' },
                  ].map((method) => {
                    const Icon = method.icon;
                    const selected = paymentMethod === method.value;
                    return (
                      <label key={method.value} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selected ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" value={method.value} {...register('paymentMethod')} className="mt-1 accent-brand-green" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={method.color} />
                            <span className="font-semibold text-brand-black text-sm">{method.label}</span>
                            {selected && <span className="text-xs bg-brand-green text-white px-2 py-0.5 rounded-full ml-auto">Selected</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{method.sub}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {paymentMethod === 'BANK_TRANSFER' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
                  >
                    <p className="text-sm font-semibold text-blue-800 mb-2">Bank Transfer Details:</p>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Bank:</strong> First Bank Nigeria</p>
                      <p><strong>Account Name:</strong> KitKing Nigeria Ltd</p>
                      <p><strong>Account Number:</strong> 1234567890</p>
                      <p className="text-xs text-blue-600 mt-2">Use your Order Number as payment reference</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
                <h3 className="font-bold text-brand-black mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <Image src={getPrimaryImage(item.product.images)} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-black line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Size: {item.variant.size} · Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-brand-green shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-black text-base border-t pt-2">
                    <span>Total</span>
                    <span className="text-brand-green text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button type="submit" isLoading={isProcessing} fullWidth size="lg" className="mt-4" leftIcon={<Lock size={15} />}>
                  Place Order
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                  <Lock size={11} /> 256-bit SSL Encrypted & Secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </MainLayout>
  );
}
