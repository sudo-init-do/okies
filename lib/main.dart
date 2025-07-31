import 'package:flutter/material.dart';
import 'screens/content_upload_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/otp_screen.dart';
import 'screens/login_screen.dart';
import 'screens/reset_password_screen.dart';
import 'screens/verify_otp_screen.dart';
import 'screens/onboarding_interests_screen.dart';
import 'screens/setup_profile_screen.dart';
import 'screens/home_screen.dart';
import 'screens/search_screen.dart';
import 'screens/post_detail_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/audience_screen.dart';
import 'screens/following_screen.dart';
import 'screens/live_screen.dart';
import 'screens/live_streaming_screen.dart';
import 'screens/story_creation_screen.dart';
import 'screens/gift_screen.dart';

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
        '/upload': (context) => const ContentUploadScreen(),
        '/search': (context) => const SearchScreen(),
        '/audience': (context) => const AudienceScreen(),
        '/following': (context) => const FollowingScreen(),
        '/live': (context) => const LiveScreen(),
        '/live-streaming': (context) => const LiveStreamingScreen(),
        '/story-creation': (context) => const StoryCreationScreen(),
        '/gift': (context) => const GiftScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/otp') {
          final contact = settings.arguments as String?;
          return MaterialPageRoute(
            builder: (_) => OtpScreen(contact: contact ?? ''),
          );
        } else if (settings.name == '/post-detail') {
          final post = settings.arguments as Map<String, dynamic>?;
          return MaterialPageRoute(
            builder: (_) => PostDetailScreen(post: post ?? {}),
          );
        } else if (settings.name == '/profile') {
          final profile = settings.arguments as Map<String, dynamic>?;
          return MaterialPageRoute(
            builder: (_) => ProfileScreen(profile: profile ?? {}),
          );
        }
        return null;
      },
    );
  }
}
