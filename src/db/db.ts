import Dexie, { type EntityTable } from 'dexie';

export interface Card {
  id?: number;
  title: string;
  billingDate: number;
  paymentDate: number;
  totalLimit: number;
  currentBalance: number;
  amc: number;
  waiveOffLimit: number;
}

export interface Expense {
  id?: number;
  cardId: number;
  details: string;
  amount: number;
  date: string;
}

export interface Payment {
  id?: number;
  cardId: number;
  amount: number;
  date: string;
}

const db = new Dexie('CreditWiselyDB') as Dexie & {
  cards: EntityTable<Card, 'id'>;
  expenses: EntityTable<Expense, 'id'>;
  payments: EntityTable<Payment, 'id'>;
};

db.version(1).stores({
  cards: '++id, title, billingDate, paymentDate, totalLimit, currentBalance, amc, waiveOffLimit',
  expenses: '++id, cardId, date, amount',
  payments: '++id, cardId, date, amount',
});

export { db };
