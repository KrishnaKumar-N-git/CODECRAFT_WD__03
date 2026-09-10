import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 animate-scaleUp">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const SkeletonProductCard = () => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
    <div className="w-full h-44 bg-gray-200 rounded-xl animate-shimmer"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
    <div className="h-5 bg-gray-200 rounded w-1/3 animate-shimmer"></div>
    <div className="h-10 bg-gray-200 rounded-xl w-full animate-shimmer"></div>
  </div>
);

export const EmptyState = ({ title = 'No items found', message = 'Check back later or try adjusting your filters.', icon: Icon, action }) => (
  <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm my-6 max-w-md mx-auto">
    {Icon && (
      <div className="w-16 h-16 mx-auto mb-4 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8" />
      </div>
    )}
    <h3 className="text-lg font-extrabold text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-500 mb-6">{message}</p>
    {action}
  </div>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="text-center py-12 px-4 bg-red-50 border border-red-100 rounded-2xl max-w-md mx-auto my-6">
    <p className="text-sm text-red-700 font-semibold mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
      >
        Try Again
      </button>
    )}
  </div>
);

export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
            p === page
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};
