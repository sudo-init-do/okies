/// A tiny in‐memory auth toggler.
class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  bool isLoggedIn = false;

  void login() => isLoggedIn = true;
}
