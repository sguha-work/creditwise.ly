import { db, type Card, type Expense, type Payment } from '../db/db';

export function getCardMetrics(card: Card, expenses: Expense[], payments: Payment[]) {
  const today = new Date();
  
  // Calculate next and last billing dates
  let nextBillDate = new Date(today.getFullYear(), today.getMonth(), card.billingDate);
  let lastBillDate = new Date(today.getFullYear(), today.getMonth(), card.billingDate);

  if (today > nextBillDate) {
    nextBillDate.setMonth(nextBillDate.getMonth() + 1);
  } else {
    lastBillDate.setMonth(lastBillDate.getMonth() - 1);
  }

  let nextPayDate = new Date(today.getFullYear(), today.getMonth(), card.paymentDate);
  if (today > nextPayDate || nextPayDate <= nextBillDate) {
    nextPayDate.setMonth(nextPayDate.getMonth() + 1);
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  
  const currentCycleExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate >= lastBillDate && expDate < nextBillDate;
  });
  
  const amountToPayNext = currentCycleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const availableLimit = Math.max(0, card.totalLimit - totalSpent + totalPaid);
  const currentBalance = card.totalLimit - totalSpent + totalPaid;

  // AMC Waiver logic
  let amcMessageText = null;
  let remainingToWaive = 0;
  let isAmcWaived = false;

  if (card.amc > 0 && card.waiveOffLimit > 0) {
    remainingToWaive = Math.max(0, card.waiveOffLimit - totalSpent);
    if (remainingToWaive > 0) {
      amcMessageText = `Spend ₹${remainingToWaive} more to waive AMC`;
    } else {
      amcMessageText = "AMC Waived! 🎉";
      isAmcWaived = true;
    }
  }

  return {
    nextBillDate,
    lastBillDate,
    nextPayDate,
    totalSpent,
    totalPaid,
    currentCycleExpenses,
    amountToPayNext,
    availableLimit,
    currentBalance,
    amcMessageText,
    remainingToWaive,
    isAmcWaived
  };
}

export async function addCard(data: Card) {
  return await db.cards.add(data);
}

export async function updateCard(id: number, data: Partial<Card>) {
  return await db.cards.update(id, data);
}

export async function deleteCardCascade(card: Card) {
  if (!card.id) return;
  // Cascade delete expenses
  const expenses = await db.expenses.where('cardId').equals(card.id).toArray();
  for (const exp of expenses) {
    await db.expenses.delete(exp.id!);
  }
  
  // Cascade delete payments
  const payments = await db.payments.where('cardId').equals(card.id).toArray();
  for (const pay of payments) {
    await db.payments.delete(pay.id!);
  }
  
  // Delete card
  await db.cards.delete(card.id);
}
