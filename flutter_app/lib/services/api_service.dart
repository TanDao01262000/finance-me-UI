import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiService {
  // For Android emulator use http://10.0.2.2:8000
  // For iOS simulator use http://127.0.0.1:8000
  // For device, replace with your machine IP
  final String baseUrl;

  const ApiService({this.baseUrl = 'http://127.0.0.1:8000'});

  Future<Map<String, dynamic>> getSummary() async {
    final response = await http.get(Uri.parse('$baseUrl/summary'));
    _ensureSuccess(response);
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<List<dynamic>> getAccounts() async {
    final response = await http.get(Uri.parse('$baseUrl/accounts'));
    _ensureSuccess(response);
    return jsonDecode(response.body) as List<dynamic>;
  }

  Future<List<dynamic>> getTransactions({int? accountId, int limit = 50}) async {
    final params = <String, String>{'limit': '$limit'};
    if (accountId != null) params['account_id'] = '$accountId';
    final uri = Uri.parse('$baseUrl/transactions').replace(queryParameters: params);
    final response = await http.get(uri);
    _ensureSuccess(response);
    return jsonDecode(response.body) as List<dynamic>;
  }

  Future<List<dynamic>> getBudgets() async {
    final response = await http.get(Uri.parse('$baseUrl/budgets'));
    _ensureSuccess(response);
    return jsonDecode(response.body) as List<dynamic>;
  }

  void _ensureSuccess(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Request failed: ${response.statusCode} ${response.body}');
    }
  }
}

