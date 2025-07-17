import 'package:flutter/material.dart';
import 'auth_service.dart';
import '../widgets/login_dialog.dart';

/// Call this around any action that needs login.
void requireAuth(BuildContext context, VoidCallback onSuccess) {
  if (AuthService.instance.isLoggedIn) {
    onSuccess();
  } else {
    showDialog(
      context: context,
      builder: (_) => const LoginDialog(),
    );
  }
}
