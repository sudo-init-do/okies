import 'package:flutter/material.dart';
import '../constants.dart';

class TermsConditionsScreen extends StatelessWidget {
  const TermsConditionsScreen({super.key});

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
                  'Terms & Conditions',
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
                    // Terms and Conditions Summary Section
                    const Text(
                      'Terms and Conditions Summary',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: kTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Main description
                    Text(
                      'By using Okies, you agree to follow these basic rules:',
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
                      'Age Requirement: You must be 13+ to use the app.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Account: Keep your info accurate and your login secure.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Content: You can post, but don\'t share anything illegal, harmful, or offensive. We may remove content that breaks the rules.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Respect Others: No bullying, impersonation, spamming, or hacking.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Ownership: You own your content, but we can use it to run the app (e.g., display your posts).',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Our Rights: We own our logo, app design, and branding.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Termination: We can suspend or delete accounts that break the rules.',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'No Guarantees: We try to keep things running smoothly, but the app is provided "as is."',
                    ),
                    const SizedBox(height: 12),

                    _buildBulletPoint(
                      'Liability: We\'re not responsible for any damages from using the app.',
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
                          TextSpan(text: 'Reach out to us at '),
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
