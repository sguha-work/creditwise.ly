import { type Card, db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { CreditCard, CalendarDays, Zap, AlertCircle } from 'lucide-react';

import sbiLogo from '../assets/banks/sbi.svg';
import iciciLogo from '../assets/banks/icici.png';
import axisLogo from '../assets/banks/axis.svg';
import kotakLogo from '../assets/banks/kotak.svg';
import hdfcLogo from '../assets/banks/hdfc.png';

const BANK_LOGOS: Record<string, string> = {
  sbi: sbiLogo,
  icici: iciciLogo,
  axis: axisLogo,
  kotak: kotakLogo,
  hdfc: hdfcLogo
};

function getBankLogo(title: string) {
  const lowerTitle = title.toLowerCase();
  for (const [key, logo] of Object.entries(BANK_LOGOS)) {
    if (lowerTitle.includes(key)) {
      return logo;
    }
  }
  return null;
}

export default function CardThumbnail({ card }: { card: Card }) {
  // Fetch expenses to determine AMC condition and current limits dynamically
  const expenses = useLiveQuery(() => 
    db.expenses.where('cardId').equals(card.id!).toArray()
  );

  const payments = useLiveQuery(() => 
    db.payments.where('cardId').equals(card.id!).toArray()
  );

  // Fallbacks while loading
  if (!expenses || !payments) return <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse h-48"></div>;

  // Calculate total spent since the beginning of the AMC year (simplified to all-time for now, or we can just use all expenses to see if they crossed the limit)
  const totalSpent = expenses.reduce((sum: number, exp) => sum + exp.amount, 0);
  
  // Actually, currentBalance can be computed as:
  // Math.max(0, initial_currentBalance + totalSpent - totalPaid)
  // Let's rely on the DB's `currentBalance` value directly because 
  // AddExpenseModal and AddPaymentModal already mutate it!
  const amountToPayNext = card.currentBalance;
  const availableLimit = Math.max(0, card.totalLimit - card.currentBalance);

  // Date Math for Next Bill Generate Date and Pay Date
  const today = new Date();
  
  let nextBillDate = new Date(today.getFullYear(), today.getMonth(), card.billingDate);
  if (today > nextBillDate) {
    nextBillDate.setMonth(nextBillDate.getMonth() + 1);
  }

  let nextPayDate = new Date(today.getFullYear(), today.getMonth(), card.paymentDate);
  if (today > nextPayDate || nextPayDate <= nextBillDate) {
    // Usually payment date is ~20 days after bill, so it might be next month
    nextPayDate.setMonth(nextPayDate.getMonth() + 1);
  }

  // AMC Waiver logic
  let amcMessage = null;
  if (card.amc > 0 && card.waiveOffLimit > 0) {
    const remainingToWaive = Math.max(0, card.waiveOffLimit - totalSpent);
    if (remainingToWaive > 0) {
      amcMessage = <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="text-sm text-red-200">
          <span className="font-semibold text-red-400">AMC Alert:</span> Spend ₹{remainingToWaive} more to waive off ₹{card.amc} AMC.
        </div>
      </div>;
    } else {
      amcMessage = <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-lg flex items-center gap-3">
        <Zap className="w-5 h-5 text-emerald-500" />
        <span className="text-sm text-emerald-400 font-medium">AMC Waived! 🎉</span>
      </div>;
    }
  }

  const logo = getBankLogo(card.title);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col hover:border-slate-700 transition-colors relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

      <div className="flex items-center gap-4 mb-6 relative">
        <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-center min-w-[3rem] min-h-[3rem]">
          {logo ? (
            <img src={logo} alt={`${card.title} logo`} className="w-8 object-contain" />
          ) : (
            <CreditCard className="w-6 h-6 text-blue-400" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">{card.title}</h3>
          <p className="text-sm text-slate-400">Total Limit: ₹{card.totalLimit}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <p className="text-xs text-slate-400 mb-1">Available Limit</p>
          <p className="text-xl font-semibold text-emerald-400">₹{availableLimit}</p>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <p className="text-xs text-slate-400 mb-1">Amount to Pay</p>
          <p className="text-xl font-semibold text-blue-400">₹{amountToPayNext}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm relative">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-2 text-slate-400">
            <CalendarDays className="w-4 h-4" /> Next Bill:
          </span>
          <span className="font-medium text-slate-200">
            {nextBillDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-2 text-slate-400">
            <CalendarDays className="w-4 h-4" /> Payment Due:
          </span>
          <span className="font-medium text-slate-200">
            {nextPayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {amcMessage}
    </div>
  );
}
