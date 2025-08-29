import 'dart:async';

class MockService {
  MockService._();
  static final MockService instance = MockService._();

  final List<Map<String, dynamic>> _accounts = [
    {'id': 1, 'name': 'Checking', 'type': 'checking', 'balance': 2450.75, 'currency': 'USD'},
    {'id': 2, 'name': 'Savings', 'type': 'savings', 'balance': 10250.00, 'currency': 'USD'},
    {'id': 3, 'name': 'Credit Card', 'type': 'credit', 'balance': -320.12, 'currency': 'USD'},
  ];

  final List<Map<String, dynamic>> _transactions = [
    {
      'id': 1,
      'account_id': 1,
      'amount': 54.23,
      'category': 'Groceries',
      'description': 'Supermarket',
      'type': 'debit',
      'date': DateTime.now().toIso8601String(),
    },
    {
      'id': 2,
      'account_id': 1,
      'amount': 120.0,
      'category': 'Utilities',
      'description': 'Electric bill',
      'type': 'debit',
      'date': DateTime.now().toIso8601String(),
    },
    {
      'id': 3,
      'account_id': 2,
      'amount': 300.0,
      'category': 'Interest',
      'description': 'Monthly interest',
      'type': 'credit',
      'date': DateTime.now().toIso8601String(),
    },
  ];

  final List<Map<String, dynamic>> _budgets = [
    {'id': 1, 'category': 'Groceries', 'limit': 400.0, 'spent': 154.23},
    {'id': 2, 'category': 'Dining', 'limit': 200.0, 'spent': 45.50},
    {'id': 3, 'category': 'Utilities', 'limit': 250.0, 'spent': 120.0},
  ];

  int _nextTxId = 4;

  Future<Map<String, dynamic>> getSummary() async {
    // Simulate network delay
    await Future<void>.delayed(const Duration(milliseconds: 300));
    final double totalBalance = _accounts.fold(0.0, (p, a) => p + (a['balance'] as num).toDouble());
    final double totalAssets = _accounts
        .where((a) => (a['balance'] as num) >= 0)
        .fold(0.0, (p, a) => p + (a['balance'] as num).toDouble());
    final double totalDebt = _accounts
        .where((a) => (a['balance'] as num) < 0)
        .fold(0.0, (p, a) => p + (-(a['balance'] as num).toDouble()));
    final double mtdSpend = _transactions
        .where((t) => t['type'] == 'debit')
        .fold(0.0, (p, t) => p + (t['amount'] as num).toDouble());

    return {
      'total_balance': double.parse(totalBalance.toStringAsFixed(2)),
      'total_assets': double.parse(totalAssets.toStringAsFixed(2)),
      'total_debt': double.parse(totalDebt.toStringAsFixed(2)),
      'month_to_date_spend': double.parse(mtdSpend.toStringAsFixed(2)),
    };
  }

  Future<List<dynamic>> getAccounts() async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    return List<Map<String, dynamic>>.from(_accounts);
  }

  Future<List<dynamic>> getTransactions({int? accountId, int limit = 50}) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    final filtered = accountId == null
        ? _transactions
        : _transactions.where((t) => t['account_id'] == accountId).toList();
    return List<Map<String, dynamic>>.from(filtered.take(limit));
  }

  Future<void> addDemoTransaction() async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    final tx = {
      'id': _nextTxId++,
      'account_id': 1,
      'amount': 9.99,
      'category': 'Coffee',
      'description': 'Latte',
      'type': 'debit',
      'date': DateTime.now().toIso8601String(),
    };
    _transactions.insert(0, tx);

    // Update balances and budgets
    _accounts.firstWhere((a) => a['id'] == 1)['balance'] =
        (_accounts.firstWhere((a) => a['id'] == 1)['balance'] as num).toDouble() - 9.99;

    final b = _budgets.where((b) => (b['category'] as String).toLowerCase() == 'coffee').toList();
    if (b.isNotEmpty) {
      b.first['spent'] = (b.first['spent'] as num).toDouble() + 9.99;
    }
  }

  Future<List<dynamic>> getBudgets() async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    return List<Map<String, dynamic>>.from(_budgets);
  }

  Future<void> adjustBudget(String category, double newLimit) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    final match = _budgets.where((b) => (b['category'] as String).toLowerCase() == category.toLowerCase());
    if (match.isNotEmpty) {
      match.first['limit'] = newLimit;
    }
  }
}

