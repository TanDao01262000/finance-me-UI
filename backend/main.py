from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="Finance App API", version="0.1.0")

# Enable permissive CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------
# In-memory "database"
# -----------------------


class Account(BaseModel):
    id: int
    name: str
    type: str = Field(description="e.g., checking, savings, credit")
    balance: float
    currency: str = "USD"


class TransactionCreate(BaseModel):
    account_id: int
    amount: float
    category: str
    description: Optional[str] = None
    type: str = Field(description="debit or credit", pattern="^(debit|credit)$")
    date: Optional[datetime] = None


class Transaction(BaseModel):
    id: int
    account_id: int
    amount: float
    category: str
    description: Optional[str] = None
    type: str
    date: datetime


class BudgetCreate(BaseModel):
    category: str
    limit: float


class Budget(BaseModel):
    id: int
    category: str
    limit: float
    spent: float


accounts: List[Account] = [
    Account(id=1, name="Checking", type="checking", balance=2450.75),
    Account(id=2, name="Savings", type="savings", balance=10250.00),
    Account(id=3, name="Credit Card", type="credit", balance=-320.12),
]


transactions: List[Transaction] = [
    Transaction(
        id=1,
        account_id=1,
        amount=54.23,
        category="Groceries",
        description="Supermarket",
        type="debit",
        date=datetime.now(timezone.utc),
    ),
    Transaction(
        id=2,
        account_id=1,
        amount=120.0,
        category="Utilities",
        description="Electric bill",
        type="debit",
        date=datetime.now(timezone.utc),
    ),
    Transaction(
        id=3,
        account_id=2,
        amount=300.0,
        category="Interest",
        description="Monthly interest",
        type="credit",
        date=datetime.now(timezone.utc),
    ),
]


budgets: List[Budget] = [
    Budget(id=1, category="Groceries", limit=400.0, spent=154.23),
    Budget(id=2, category="Dining", limit=200.0, spent=45.50),
    Budget(id=3, category="Utilities", limit=250.0, spent=120.0),
]


next_transaction_id = len(transactions) + 1
next_budget_id = len(budgets) + 1


# -----------------------
# Helpers
# -----------------------


def calculate_summary():
    total_balance = sum(a.balance for a in accounts)
    total_assets = sum(a.balance for a in accounts if a.balance >= 0)
    total_debt = sum(-a.balance for a in accounts if a.balance < 0)

    # Month-to-date spending (sum of debits)
    now = datetime.now(timezone.utc)
    month_start = datetime(year=now.year, month=now.month, day=1, tzinfo=timezone.utc)
    mtd_spend = sum(
        t.amount for t in transactions if t.type == "debit" and t.date >= month_start
    )

    return {
        "total_balance": round(total_balance, 2),
        "total_assets": round(total_assets, 2),
        "total_debt": round(total_debt, 2),
        "month_to_date_spend": round(mtd_spend, 2),
    }


# -----------------------
# Routes
# -----------------------


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/summary")
def get_summary():
    return calculate_summary()


@app.get("/accounts", response_model=List[Account])
def get_accounts():
    return accounts


@app.get("/transactions", response_model=List[Transaction])
def get_transactions(
    account_id: Optional[int] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    data = transactions
    if account_id is not None:
        data = [t for t in transactions if t.account_id == account_id]
    return data[offset : offset + limit]


@app.post("/transactions", response_model=Transaction)
def create_transaction(payload: TransactionCreate):
    global next_transaction_id
    if not any(a.id == payload.account_id for a in accounts):
        raise HTTPException(status_code=400, detail="Account does not exist")

    tx = Transaction(
        id=next_transaction_id,
        account_id=payload.account_id,
        amount=payload.amount,
        category=payload.category,
        description=payload.description,
        type=payload.type,
        date=payload.date or datetime.now(timezone.utc),
    )
    next_transaction_id += 1
    transactions.insert(0, tx)

    # Update accounts balance crudely for demo
    for a in accounts:
        if a.id == tx.account_id:
            if tx.type == "debit":
                a.balance -= tx.amount
            else:
                a.balance += tx.amount
            break

    # Update budget spend if category tracked
    for b in budgets:
        if b.category.lower() == tx.category.lower() and tx.type == "debit":
            b.spent += tx.amount
            break

    return tx


@app.get("/budgets", response_model=List[Budget])
def get_budgets():
    return budgets


@app.post("/budgets", response_model=Budget)
def create_budget(payload: BudgetCreate):
    global next_budget_id
    existing = next((b for b in budgets if b.category.lower() == payload.category.lower()), None)
    if existing:
        # Update existing budget limit
        existing.limit = payload.limit
        return existing

    b = Budget(id=next_budget_id, category=payload.category, limit=payload.limit, spent=0.0)
    next_budget_id += 1
    budgets.append(b)
    return b


# Entrypoint for `python -m backend.main`
def run():  # pragma: no cover
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":  # pragma: no cover
    run()

