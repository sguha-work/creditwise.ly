import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Tags, Pencil, Trash2, Plus, Wallet } from 'lucide-react';
import { db, type Category } from '../db/db';
import AddCategoryModal from '../components/modals/AddCategoryModal';

const BUDGET_MODE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const BUDGET_MODE_COLORS: Record<string, string> = {
  monthly: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  yearly: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
};

function fmtPreview(n: number) {
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '₹' + n.toFixed(0);
}

function getBudgetPreviews(category: Category): string | null {
  const { budgetAmount: amt, budgetMode: mode } = category;
  if (amt == null || !mode) return null;
  if (mode === 'monthly') {
    return `≈ ${fmtPreview(amt / (52 / 12))}/wk · ${fmtPreview(amt / 30)}/day`;
  }
  // yearly
  return `≈ ${fmtPreview(amt / 12)}/mo · ${fmtPreview(amt / 52)}/wk · ${fmtPreview(amt / 365)}/day`;
}

export default function ManageCategoriesPage() {
  const categories = useLiveQuery(() => db.categories.toArray());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | undefined>(undefined);

  const openAddModal = () => {
    setCategoryToEdit(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete category "${category.title}"? Expenses using this category will lose their category assignment.`)) return;
    await db.categories.delete(category.id!);
    const expensesWithCategory = await db.expenses.where('categoryId').equals(category.id!).toArray();
    for (const expense of expensesWithCategory) {
      await db.expenses.update(expense.id!, { categoryId: undefined });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Manage Categories</h1>
          <p className="text-slate-400 mt-1 text-sm">Organise your expenses into categories with optional budgets.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {categories && categories.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Tags className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No categories yet</h3>
          <p className="text-slate-500 mb-6 text-sm">Create categories to organise your expenses and track budgets.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Category
          </button>
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const previews = getBudgetPreviews(category);
            return (
              <div
                key={category.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <Tags className="w-4 h-4 text-violet-400" />
                    </span>
                    <h3 className="font-semibold text-slate-100 truncate">{category.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-800"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">{category.description}</p>
                )}

                {category.budgetAmount != null && category.budgetMode ? (
                  <div className="mt-auto space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-slate-200">
                        ₹{category.budgetAmount.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${BUDGET_MODE_COLORS[category.budgetMode] ?? ''}`}>
                        {BUDGET_MODE_LABELS[category.budgetMode] ?? category.budgetMode}
                      </span>
                    </div>
                    {previews && (
                      <p className="text-xs text-slate-500 pl-5">{previews}</p>
                    )}
                  </div>
                ) : (
                  <div className="mt-auto">
                    <span className="text-xs text-slate-600 italic">No budget set</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategory={categoryToEdit}
      />
    </div>
  );
}
