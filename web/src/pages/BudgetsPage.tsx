import { useEffect, useState } from 'react'
import type { Budget } from '../services/mockApi'
import { fetchBudgets, adjustBudget } from '../services/mockApi'

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[] | null>(null)

  useEffect(() => {
    fetchBudgets().then(setBudgets)
  }, [])

  if (!budgets) return <div className="loading">Loading...</div>

  return (
    <div className="list">
      {budgets.map((b) => {
        const pct = Math.max(0, Math.min(1, b.spent / (b.limit || 1)))
        return (
          <div key={b.id} className="list-item">
            <div className="list-item-content" style={{ width: '100%' }}>
              <div className="title">{b.category}</div>
              <div className="subtitle">${b.spent.toFixed(2)} / ${b.limit.toFixed(2)}</div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${Math.round(pct * 100)}%`, background: pct > 0.9 ? '#d32f2f' : '#00897b' }} />
              </div>
            </div>
            <div className="list-item-trailing">
              <button onClick={async () => {
                await adjustBudget(b.category, b.limit + 50)
                const data = await fetchBudgets()
                setBudgets(data)
              }}>+50</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

