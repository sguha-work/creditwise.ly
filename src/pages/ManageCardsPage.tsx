import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Card } from '../db/db';
import AddCardModal from '../components/modals/AddCardModal';

export default function ManageCardsPage() {
  const cards = useLiveQuery(() => db.cards.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | undefined>(undefined);

  const handleDelete = async (card: Card) => {
    if (confirm('Are you sure you want to delete this card? This will also delete ALL related expenses and payments!')) {
      // Cascade delete expenses
      const expenses = await db.expenses.where('cardId').equals(card.id!).toArray();
      for (const exp of expenses) {
        await db.expenses.delete(exp.id!);
      }
      
      // Cascade delete payments
      const payments = await db.payments.where('cardId').equals(card.id!).toArray();
      for (const pay of payments) {
        await db.payments.delete(pay.id!);
      }
      
      // Delete card
      await db.cards.delete(card.id!);
    }
  };

  const openAddModal = () => {
    setCardToEdit(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (card: Card) => {
    setCardToEdit(card);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-100">Manage Cards</h1>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add New Card
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Total Limit</th>
              <th className="px-6 py-4 font-medium">Current Balance</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {cards?.map((card) => (
              <tr key={card.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">{card.title}</td>
                <td className="px-6 py-4">₹{card.totalLimit}</td>
                <td className="px-6 py-4">₹{card.currentBalance}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openEditModal(card)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(card)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!cards || cards.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No cards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialCard={cardToEdit}
      />
    </div>
  );
}
