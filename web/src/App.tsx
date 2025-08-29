import { NavLink, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'

import { DashboardPage } from './pages/DashboardPage'
import { AccountsPage } from './pages/AccountsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { BudgetsPage } from './pages/BudgetsPage'

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Finance App</h1>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>Dashboard</NavLink>
          <NavLink to="/accounts" className={({ isActive }) => (isActive ? 'active' : undefined)}>Accounts</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'active' : undefined)}>Transactions</NavLink>
          <NavLink to="/budgets" className={({ isActive }) => (isActive ? 'active' : undefined)}>Budgets</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
        </Routes>
        <Outlet />
      </main>
    </div>
  )
}
