import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import AddCardModal from '../components/modals/AddCardModal';
import CardThumbnail from '../components/CardThumbnail';

export default function HomePage() {
  const cards = useLiveQuery(() => db.cards.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-100">Dashboard</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add New Card
        </button>
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

      <AddCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
