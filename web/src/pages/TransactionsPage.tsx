import { useEffect, useState } from 'react'
import type { Transaction } from '../services/mockApi'
import { fetchTransactions, addDemoTransaction } from '../services/mockApi'

export function TransactionsPage() {
  const [txs, setTxs] = useState<Transaction[] | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchTransactions().then(setTxs)
  }, [])

  if (!txs) return <div className="loading">Loading...</div>

  return (
    <div>
      <div className="toolbar">
        <button disabled={busy} onClick={async () => {
          setBusy(true)
          await addDemoTransaction()
          const data = await fetchTransactions()
          setTxs(data)
          setBusy(false)
        }}>Add</button>
      </div>
      <div className="list">
        {txs.map((t) => {
          const isDebit = t.type === 'debit'
          return (
            <div key={t.id} className="list-item">
              <div className="list-item-leading" style={{ background: isDebit ? '#ffebee' : '#e8f5e9' }}>
                {isDebit ? '−' : '+'}
              </div>
              <div className="list-item-content">
                <div className="title">{t.category}</div>
                <div className="subtitle">{t.description}</div>
              </div>
              <div className="list-item-trailing" style={{ color: isDebit ? '#d32f2f' : '#2e7d32' }}>
                {(isDebit ? '-' : '+')}${t.amount.toFixed(2)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

