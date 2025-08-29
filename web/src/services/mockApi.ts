export type Account = {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'credit' | string;
  balance: number;
  currency: string;
};

export type Transaction = {
  id: number;
  account_id: number;
  amount: number;
  category: string;
  description?: string;
  type: 'debit' | 'credit';
  date: string;
};

export type Budget = {
  id: number;
  category: string;
  limit: number;
  spent: number;
};

const accounts: Account[] = [
  { id: 1, name: 'Checking', type: 'checking', balance: 2450.75, currency: 'USD' },
  { id: 2, name: 'Savings', type: 'savings', balance: 10250.0, currency: 'USD' },
  { id: 3, name: 'Credit Card', type: 'credit', balance: -320.12, currency: 'USD' },
];

const transactions: Transaction[] = [
  { id: 1, account_id: 1, amount: 54.23, category: 'Groceries', description: 'Supermarket', type: 'debit', date: new Date().toISOString() },
  { id: 2, account_id: 1, amount: 120.0, category: 'Utilities', description: 'Electric bill', type: 'debit', date: new Date().toISOString() },
  { id: 3, account_id: 2, amount: 300.0, category: 'Interest', description: 'Monthly interest', type: 'credit', date: new Date().toISOString() },
];

const budgets: Budget[] = [
  { id: 1, category: 'Groceries', limit: 400.0, spent: 154.23 },
  { id: 2, category: 'Dining', limit: 200.0, spent: 45.5 },
  { id: 3, category: 'Utilities', limit: 250.0, spent: 120.0 },
];

let nextTxId = 4;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchSummary() {
  await delay(200);
  const total_balance = Number(accounts.reduce((p, a) => p + a.balance, 0).toFixed(2));
  const total_assets = Number(accounts.filter(a => a.balance >= 0).reduce((p, a) => p + a.balance, 0).toFixed(2));
  const total_debt = Number(accounts.filter(a => a.balance < 0).reduce((p, a) => p + (-a.balance), 0).toFixed(2));
  const month_to_date_spend = Number(transactions.filter(t => t.type === 'debit').reduce((p, t) => p + t.amount, 0).toFixed(2));
  return { total_balance, total_assets, total_debt, month_to_date_spend };
}

export async function fetchAccounts(): Promise<Account[]> {
  await delay(150);
  return accounts.map(a => ({ ...a }));
}

export async function fetchTransactions(opts?: { accountId?: number; limit?: number; }): Promise<Transaction[]> {
  await delay(150);
  const { accountId, limit = 50 } = opts || {};
  const filtered = accountId ? transactions.filter(t => t.account_id === accountId) : transactions;
  return filtered.slice(0, limit).map(t => ({ ...t }));
}

export async function addDemoTransaction() {
  await delay(150);
  const tx: Transaction = {
    id: nextTxId++,
    account_id: 1,
    amount: 9.99,
    category: 'Coffee',
    description: 'Latte',
    type: 'debit',
    date: new Date().toISOString(),
  };
  transactions.unshift(tx);
  const acc = accounts.find(a => a.id === 1)!;
  acc.balance -= 9.99;
  const b = budgets.find(b => b.category.toLowerCase() === 'coffee');
  if (b) b.spent += 9.99;
}

export async function fetchBudgets(): Promise<Budget[]> {
  await delay(150);
  return budgets.map(b => ({ ...b }));
}

export async function adjustBudget(category: string, newLimit: number) {
  await delay(100);
  const b = budgets.find(b => b.category.toLowerCase() === category.toLowerCase());
  if (b) b.limit = newLimit;
}

