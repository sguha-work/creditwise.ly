import React, { useState, useEffect } from 'react';
import { db, type Card } from '../../db/db';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialCard?: Card;
}

export default function AddCardModal({ isOpen, onClose, initialCard }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    billingDate: '',
    paymentDate: '',
    totalLimit: '',
    currentBalance: '',
    amc: '0',
    waiveOffLimit: '0',
  });

  useEffect(() => {
    if (initialCard) {
      setFormData({
        title: initialCard.title,
        billingDate: initialCard.billingDate.toString(),
        paymentDate: initialCard.paymentDate.toString(),
        totalLimit: initialCard.totalLimit.toString(),
        currentBalance: initialCard.currentBalance.toString(),
        amc: initialCard.amc.toString(),
        waiveOffLimit: initialCard.waiveOffLimit.toString(),
      });
    } else {
      setFormData({
        title: '',
        billingDate: '',
        paymentDate: '',
        totalLimit: '',
        currentBalance: '',
        amc: '0',
        waiveOffLimit: '0',
      });
    }
  }, [initialCard, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialCard) {
      await db.cards.update(initialCard.id!, {
        title: formData.title,
        billingDate: parseInt(formData.billingDate),
        paymentDate: parseInt(formData.paymentDate),
        totalLimit: parseFloat(formData.totalLimit),
        currentBalance: parseFloat(formData.currentBalance),
        amc: parseFloat(formData.amc),
        waiveOffLimit: parseFloat(formData.waiveOffLimit)
      });
    } else {
      await db.cards.add({
        title: formData.title,
        billingDate: parseInt(formData.billingDate),
        paymentDate: parseInt(formData.paymentDate),
        totalLimit: parseFloat(formData.totalLimit),
        currentBalance: parseFloat(formData.currentBalance),
        amc: parseFloat(formData.amc),
        waiveOffLimit: parseFloat(formData.waiveOffLimit)
      });
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {initialCard ? 'Edit Card' : 'Add New Card'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Card Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Billing Date (1-31)</label>
              <input required type="number" min="1" max="31" name="billingDate" value={formData.billingDate} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Payment Date (1-31)</label>
              <input required type="number" min="1" max="31" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Total Limit</label>
              <input required type="number" name="totalLimit" value={formData.totalLimit} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Current Balance</label>
              <input required type="number" name="currentBalance" value={formData.currentBalance} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">AMC</label>
              <input required type="number" name="amc" value={formData.amc} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Spent to Waive AMC</label>
              <input required type="number" name="waiveOffLimit" value={formData.waiveOffLimit} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              {initialCard ? 'Update Card' : 'Save Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
