import 'package:flutter/material.dart';

class OnboardingInterestsScreen extends StatefulWidget {
  const OnboardingInterestsScreen({super.key});

  @override
  State<OnboardingInterestsScreen> createState() => _OnboardingInterestsScreenState();
}

class _OnboardingInterestsScreenState extends State<OnboardingInterestsScreen> {
  final List<String> allInterests = [
    'Music', 'Movies', 'Gaming', 'Sports', 'Photography', 'Fashion',
    'Nature', 'Innovation', 'News & Culture', 'Architecture', 'Travel',
    'Tech', 'Animals', 'Food & Drink'
  ];

  final List<String> selectedInterests = [];

  void toggleInterest(String interest) {
    setState(() {
      if (selectedInterests.contains(interest)) {
        selectedInterests.remove(interest);
      } else {
        if (selectedInterests.length < 8) {
          selectedInterests.add(interest);
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final screenWidth = size.width;
    final horizontalPadding = screenWidth < 400 ? 16.0 : 24.0;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: horizontalPadding, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Back Button
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: const Row(
                  children: [
                    Icon(Icons.arrow_back, color: Colors.black87),
                    SizedBox(width: 8),
                    Text('Back', style: TextStyle(fontSize: 16, color: Colors.black87)),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Title
              const Text(
                "Tell Us What You're Into",
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.black),
              ),
              const SizedBox(height: 12),

              // Subtitle
              const Text(
                "Select your favorites so we can recommend the best options",
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 16),

              // Counter
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF16A34A),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${selectedInterests.length}/8',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                ),
              ),
              const SizedBox(height: 16),

              // Interest Chips
              Expanded(
                child: Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: allInterests.map((interest) {
                    final isSelected = selectedInterests.contains(interest);
                    return GestureDetector(
                      onTap: () => toggleInterest(interest),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF16A34A) : Colors.white,
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF16A34A) : Colors.grey.shade300,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              interest,
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.black87,
                                fontSize: 15,
                              ),
                            ),
                            if (isSelected)
                              const Padding(
                                padding: EdgeInsets.only(left: 8),
                                child: Icon(Icons.close, color: Colors.white, size: 18),
                              ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              // Continue Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: selectedInterests.isNotEmpty
                      ? () => Navigator.pushNamed(context, '/setup-profile')
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF16A34A),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Continue',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
