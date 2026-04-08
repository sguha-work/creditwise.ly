import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { db, type Expense } from '../db/db';
import AddExpenseModal from '../components/modals/AddExpenseModal';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function ManageExpensesPage({ mode }: { mode?: 'monthly' | 'yearly' }) {
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const filteredExpenses = expenses?.filter((expense) => {
    if (!mode) return true;
    const expenseDate = new Date(expense.date);
    if (mode === 'monthly') {
      return expenseDate.getFullYear() === selectedYear && (expenseDate.getMonth() + 1) === selectedMonth;
    }
    if (mode === 'yearly') {
      return expenseDate.getFullYear() === selectedYear;
    }
    return true;
  });

  const totalAmount = filteredExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  const monthlyBreakdown = mode === 'yearly' ? Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthExpenses = filteredExpenses?.filter(expense => new Date(expense.date).getMonth() + 1 === month);
    return {
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      amount: monthExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0
    };
  }) : [];

  const handleDelete = async (expense: Expense) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await db.expenses.delete(expense.id!);
    }
  };

  const openAddModal = () => {
    setExpenseToEdit(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-slate-100">
          {mode === 'monthly' ? 'Monthly Manage Expenses' : mode === 'yearly' ? 'Yearly Manage Expenses' : 'Manage Expenses'}
        </h1>
        <button 
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          Add Expense
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
        >
          {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {mode === 'monthly' && (
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))} 
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        )}
      </div>

      {mode && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">
              {mode === 'monthly' ? 'Month Total' : 'Year Total'}
            </p>
            <p className="text-3xl font-bold text-emerald-400">₹{totalAmount.toLocaleString()}</p>
          </div>
          
          {mode === 'yearly' && (
            <div className="md:col-span-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl overflow-x-auto">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Monthly Breakdown</p>
              <div className="flex gap-6 min-w-max pb-2">
                {monthlyBreakdown.map((mb) => (
                  <div key={mb.name} className="flex flex-col items-center">
                    <div className="text-xs text-slate-500 mb-1">{mb.name}</div>
                    <div className={cn(
                      "text-sm font-semibold",
                      mb.amount > 0 ? "text-slate-200" : "text-slate-700"
                    )}>
                      ₹{mb.amount > 0 ? mb.amount.toLocaleString() : '0'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-slate-300 whitespace-nowrap min-w-max">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Details</th>
              <th className="px-6 py-4 font-medium">Card ID</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredExpenses?.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{expense.details}</td>
                <td className="px-6 py-4">{expense.cardId}</td>
                <td className="px-6 py-4">₹{expense.amount}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openEditModal(expense)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(expense)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!filteredExpenses || filteredExpenses.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No expenses found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialExpense={expenseToEdit}
      />
    </div>
  );
}
