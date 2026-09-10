import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const DifferentStoreModal = () => {
  const { storeModalOpen, setStoreModalOpen, confirmClearAndAdd } = useCart();

  return (
    <Modal
      isOpen={storeModalOpen}
      onClose={() => setStoreModalOpen(false)}
      title="Replace Cart Items?"
    >
      <div className="space-y-4 text-center py-2">
        <div className="w-14 h-14 mx-auto bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Your cart contains products from another store. APK Grocery Stores supports ordering from one local store at a time.
        </p>

        <p className="text-xs font-bold text-gray-900">
          Would you like to clear your current cart and add this product instead?
        </p>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => setStoreModalOpen(false)}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmClearAndAdd}
            className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-brand-600/30"
          >
            Clear Cart & Continue
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DifferentStoreModal;
