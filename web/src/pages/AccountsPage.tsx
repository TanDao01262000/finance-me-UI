import { useEffect, useState } from 'react'
import type { Account } from '../services/mockApi'
import { fetchAccounts } from '../services/mockApi'

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null)

  useEffect(() => {
    fetchAccounts().then(setAccounts)
  }, [])

  if (!accounts) return <div className="loading">Loading...</div>

  return (
    <div className="list">
      {accounts.map((a) => (
        <div key={a.id} className="list-item">
          <div className="list-item-leading">{iconForType(a.type)}</div>
          <div className="list-item-content">
            <div className="title">{a.name}</div>
            <div className="subtitle">{a.type.toUpperCase()}</div>
          </div>
          <div className="list-item-trailing" style={{ color: a.balance < 0 ? '#d32f2f' : '#00897b' }}>
            ${a.balance.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}

function iconForType(type: string) {
  switch (type) {
    case 'checking':
      return '🏦'
    case 'savings':
      return '🪙'
    case 'credit':
      return '💳'
    default:
      return '💼'
  }
}

