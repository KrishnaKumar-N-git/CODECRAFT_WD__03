import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Store, XCircle } from 'lucide-react';

export const OrderTimeline = ({ orderStatus = 'PENDING', deliveryMethod = 'HOME_DELIVERY', createdAt }) => {
  if (orderStatus === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3 text-red-700 my-4">
        <XCircle className="w-6 h-6 shrink-0" />
        <div>
          <h4 className="text-xs font-bold">Order Cancelled</h4>
          <p className="text-[11px]">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const isPickup = deliveryMethod === 'STORE_PICKUP';

  const homeDeliverySteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'PACKING', label: 'Packing Groceries', icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
  ];

  const pickupSteps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'PACKING', label: 'Packing Groceries', icon: Package },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: Store },
    { key: 'DELIVERED', label: 'Picked Up', icon: CheckCircle2 }
  ];

  const steps = isPickup ? pickupSteps : homeDeliverySteps;

  const getStepStatus = (stepKey, index) => {
    const currentIndex = steps.findIndex((s) => s.key === orderStatus);
    if (index < currentIndex || orderStatus === 'DELIVERED') return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="my-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <h4 className="text-xs font-extrabold text-gray-900 mb-6 uppercase tracking-wider">
        Order Status Timeline
      </h4>

      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 z-0"></div>

        {steps.map((step, idx) => {
          const status = getStepStatus(step.key, idx);
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  status === 'completed'
                    ? 'bg-brand-600 text-white shadow-sm ring-4 ring-brand-50'
                    : status === 'current'
                    ? 'bg-accent text-white ring-4 ring-amber-50 animate-pulse'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs text-center font-bold max-w-[70px] ${
                  status === 'completed' || status === 'current' ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
