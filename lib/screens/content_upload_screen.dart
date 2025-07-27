// screens/content_upload_screen.dart
import 'package:flutter/material.dart';

class ContentUploadScreen extends StatelessWidget {
  const ContentUploadScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('', style: TextStyle(color: Colors.black)),
        actions: [
          TextButton(
            onPressed: () {
              // Handle "Post"
            },
            child: const Text(
              'Post',
              style: TextStyle(
                color: Color(0xFF00C569),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Upload Box
            DottedBorderBox(),

            const SizedBox(height: 20),

            // Uploaded image
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
                height: 360,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),

            const SizedBox(height: 20),

            // Caption input
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: const TextField(
                maxLines: 4,
                decoration: InputDecoration.collapsed(
                  hintText: 'Beautiful morning at crystal mountain\nJust out here making memories 📸✨\n#nature #mountainlover',
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Action row
            Row(
              children: const [
                Icon(Icons.favorite_border, color: Colors.grey),
                SizedBox(width: 8),
                Text('Like', style: TextStyle(color: Colors.grey)),
                SizedBox(width: 24),
                Icon(Icons.chat_bubble_outline, color: Colors.grey),
                SizedBox(width: 8),
                Text('Comment', style: TextStyle(color: Colors.grey)),
              ],
            )
          ],
        ),
      ),
    );
  }
}

// Upload box with dotted border
class DottedBorderBox extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 160,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.grey[400]!,
          width: 2,
          style: BorderStyle.solid,
        ),
      ),
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.cloud_upload, size: 36, color: Colors.grey),
            SizedBox(height: 8),
            Text("click here to upload files",
                style: TextStyle(color: Colors.grey)),
            SizedBox(height: 4),
            Text("Supported formats: JPG, PNG, MP4\nMax file size: 500MB",
                style: TextStyle(color: Colors.grey, fontSize: 12),
                textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
