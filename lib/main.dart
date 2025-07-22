import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/otp_screen.dart';
import 'screens/login_screen.dart';
import 'screens/reset_password_screen.dart';
import 'screens/verify_otp_screen.dart';
import 'screens/onboarding_interests_screen.dart';
import 'screens/setup_profile_screen.dart';
import 'screens/home_screen.dart'; 

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Okies',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        scaffoldBackgroundColor: Colors.white,
        brightness: Brightness.light,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/signup': (context) => const SignupScreen(),
        '/login': (context) => const LoginScreen(),
        '/reset-password': (context) => const ResetPasswordScreen(),
        '/verify-reset-otp': (context) => const VerifyOtpScreen(),
        '/onboarding-interests': (context) => const OnboardingInterestsScreen(),
        '/setup-profile': (context) => const SetupProfileScreen(),
        '/home': (context) => HomeScreen(), 
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/otp') {
          final contact = settings.arguments as String?;
          return MaterialPageRoute(
            builder: (_) => OtpScreen(contact: contact ?? ''),
          );
        }
        return null;
      },
    );
  }
}
