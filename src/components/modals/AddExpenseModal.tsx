import { useState, useEffect } from 'react';
import { db, type Expense } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialExpense?: Expense;
}

export default function AddExpenseModal({ isOpen, onClose, initialExpense }: Props) {
  const navigate = useNavigate();
  const cards = useLiveQuery(() => db.cards.toArray());
  const [formData, setFormData] = useState({
    cardId: '',
    details: '',
    amount: '',
    date: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (initialExpense) {
      setFormData({
        cardId: initialExpense.cardId.toString(),
        details: initialExpense.details,
        amount: initialExpense.amount.toString(),
        date: initialExpense.date,
      });
    } else {
      setFormData({
        cardId: '',
        details: '',
        amount: '',
        date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [initialExpense, isOpen]);

  if (!isOpen) return null;

  if (cards && cards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative p-6 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-100 mb-4">No Cards Found</h2>
          <p className="text-slate-400 mb-6">You need to add a credit card before logging an expense.</p>
          <button 
            onClick={() => {
              onClose();
              navigate('/');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Dashboard to Add Card
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardId) return alert('Please select a card');
    
    if (initialExpense) {
      await db.expenses.update(initialExpense.id!, {
        cardId: parseInt(formData.cardId),
        details: formData.details,
        amount: parseFloat(formData.amount),
        date: formData.date
      });
    } else {
      await db.expenses.add({
        cardId: parseInt(formData.cardId),
        details: formData.details,
        amount: parseFloat(formData.amount),
        date: formData.date
      });
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {initialExpense ? 'Edit Expense' : 'Log an Expense'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Select Card</label>
            <select required name="cardId" value={formData.cardId} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
              <option value="">Select a card...</option>
              {cards?.map(card => (
                <option key={card.id} value={card.id}>{card.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Details</label>
            <input required type="text" name="details" value={formData.details} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Amazon Purchase" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
              <input required type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Date & Time</label>
              <input required type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              {initialExpense ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
