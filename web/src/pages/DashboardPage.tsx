import { useEffect, useState } from 'react'
import { fetchSummary } from '../services/mockApi'

type Summary = {
  total_balance: number
  total_assets: number
  total_debt: number
  month_to_date_spend: number
}

export function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    fetchSummary().then(setSummary)
  }, [])

  if (!summary) return <div className="loading">Loading...</div>

  return (
    <div className="grid">
      <MetricCard label="Total Balance" value={summary.total_balance} color="#00897b" />
      <MetricCard label="Assets" value={summary.total_assets} color="#2e7d32" />
      <MetricCard label="Debt" value={summary.total_debt} color="#d32f2f" />
      <MetricCard label="MTD Spend" value={summary.month_to_date_spend} color="#ef6c00" />
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="card-label">{label}</div>
      <div className="card-value">${value.toFixed(2)}</div>
    </div>
  )
}

