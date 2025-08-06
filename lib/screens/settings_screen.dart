import 'package:flutter/material.dart';
import '../constants.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
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

            // Settings Title
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Settings',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: kTextPrimary,
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Settings List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _buildSettingsItem(
                    icon: Icons.security,
                    iconColor: const Color(0xFF4CAF50),
                    title: 'Privacy & Security',
                    subtitle: 'Manage your account security',
                    onTap: () {
                      Navigator.pushNamed(context, '/privacy-security');
                    },
                  ),
                  _buildSettingsItem(
                    icon: Icons.account_balance_wallet,
                    iconColor: const Color(0xFF2196F3),
                    title: 'My wallet',
                    subtitle: 'Payment method & Earnings history',
                    onTap: () {
                      Navigator.pushNamed(context, '/my-wallet');
                    },
                  ),
                  _buildSettingsItem(
                    icon: Icons.palette,
                    iconColor: const Color(0xFF4CAF50),
                    title: 'Theme',
                    subtitle: 'Personalize your theme',
                    onTap: () {
                      // Navigate to Theme settings
                    },
                  ),
                  _buildSettingsItem(
                    icon: Icons.notifications_outlined,
                    iconColor: const Color(0xFF4CAF50),
                    title: 'Notifications',
                    subtitle: 'Customize notification settings',
                    onTap: () {
                      Navigator.pushNamed(context, '/notifications');
                    },
                  ),
                  _buildSettingsItem(
                    icon: Icons.help_outline,
                    iconColor: const Color(0xFF4CAF50),
                    title: 'Help & Support',
                    subtitle: 'Get help & contact support',
                    onTap: () {
                      Navigator.pushNamed(context, '/help-support');
                    },
                  ),
                  _buildSettingsItem(
                    icon: Icons.language,
                    iconColor: const Color(0xFF4CAF50),
                    title: 'Language preference',
                    subtitle: 'Choose a language',
                    onTap: () {
                      Navigator.pushNamed(context, '/language');
                    },
                  ),
                  _buildSettingsItem(
                    icon: Icons.privacy_tip_outlined,
                    iconColor: const Color(0xFF2196F3),
                    title: 'Privacy Policy',
                    subtitle: 'Get to know about us',
                    onTap: () {
                      Navigator.pushNamed(context, '/privacy-policy');
                    },
                  ),
                  _buildSettingsItem(
                    icon: Icons.description_outlined,
                    iconColor: const Color(0xFFFFC107),
                    title: 'Terms & Conditions',
                    subtitle: 'Keep updated with our terms and conditions',
                    onTap: () {
                      Navigator.pushNamed(context, '/terms-conditions');
                    },
                    isLast: true,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    bool isLast = false,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: isLast ? 0 : 16),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FA),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFFE5E7EB),
                width: 0.5,
              ),
            ),
            child: Row(
              children: [
                // Icon container
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: iconColor,
                    size: 24,
                  ),
                ),

                const SizedBox(width: 16),

                // Title and subtitle
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: kTextPrimary,
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: kTextSecondary,
                          height: 1.3,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                // Arrow icon
                const Icon(
                  Icons.chevron_right,
                  color: kTextTertiary,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
