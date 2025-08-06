import 'package:flutter/material.dart';
import '../constants.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Row(
                      children: [
                        const Icon(Icons.arrow_back,
                            color: kTextPrimary, size: 24),
                        const SizedBox(width: 8),
                        const Text(
                          'Back',
                          style: TextStyle(
                            fontSize: 17,
                            color: kTextPrimary,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Title
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Privacy Policy',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    color: kTextPrimary,
                  ),
                ),
              ),
            ),

            // Divider
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              height: 1,
              color: Colors.grey.shade300,
            ),

            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Privacy Policy Summary Section
                    const Text(
                      'Privacy Policy Summary',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: kTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Main description
                    Text(
                      'Okies collects and uses your personal data to provide a social media experience. This includes basic info like your name, email, and profile picture, as well as content you post, messages, and how you use the app.',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Colors.grey.shade700,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Bullet points
                    _buildBulletPoint(
                      'We collect personal info, posts, messages, and device data.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'We use this data to operate the app, personalize your experience, and improve the service.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'We may share data with other users, service providers, or if legally required.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'You can control your privacy settings and delete your account anytime.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'We protect your data with security measures but cannot guarantee complete safety.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Children under 13 are not allowed to use the app.',
                    ),
                    const SizedBox(height: 24),

                    // Policy update notice
                    Text(
                      'We may update this policy, and you\'ll be notified if major changes happen.',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Colors.grey.shade700,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Questions section
                    const Text(
                      'Questions?',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: kTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Contact info
                    RichText(
                      text: TextSpan(
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                          color: Colors.grey.shade700,
                          height: 1.5,
                        ),
                        children: const [
                          TextSpan(text: 'Contact us at '),
                          TextSpan(
                            text: 'supportokies@gmail.com',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: kTextPrimary,
                            ),
                          ),
                          TextSpan(text: '.'),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 8),
          width: 4,
          height: 4,
          decoration: BoxDecoration(
            color: Colors.grey.shade600,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: Colors.grey.shade700,
              height: 1.5,
            ),
          ),
        ),
      ],
    );
  }
}
