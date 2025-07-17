
import 'package:http/http.dart' as http;
import '../constants.dart';

/// A simple HTTP client wrapper that uses [AppConfig.apiBaseUrl].
/// When your API is live, add methods here to fetch posts, users, etc.
class ApiService {
  final String _baseUrl = AppConfig.apiBaseUrl;

  Uri _uri(String endpoint) => Uri.parse('$_baseUrl/$endpoint');

  Future<http.Response> get(String endpoint) =>
      http.get(_uri(endpoint));

  Future<http.Response> post(String endpoint, {Map<String, dynamic>? body}) =>
      http.post(_uri(endpoint), body: body);
}
