import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import AddCardModal from '../components/modals/AddCardModal';
import AddExpenseModal from '../components/modals/AddExpenseModal';
import CardThumbnail from '../components/CardThumbnail';

export default function HomePage() {
  const cards = useLiveQuery(() => db.cards.toArray());
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-slate-100">Dashboard</h1>
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex-1 sm:flex-none"
          >
            Add Expense
          </button>
          <button 
            onClick={() => setIsCardModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex-1 sm:flex-none"
          >
            Add New Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards?.map((card) => (
          <CardThumbnail key={card.id} card={card} />
        ))}
        {cards?.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No cards added yet. Click "Add New Card" to get started.
          </div>
        )}
      </div>

      <AddCardModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} />
      <AddExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
    </div>
  );
}
