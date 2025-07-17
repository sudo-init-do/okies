// lib/screens/home_screen.dart

import 'package:flutter/material.dart';
import '../services/auth_gate.dart';
import '../widgets/unread_badge.dart';
import '../widgets/post_card.dart';
import '../widgets/ad_card.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  static const _samplePosts = [
    {
      'avatarUrl': 'https://i.pravatar.cc/150?img=10',
      'username': 'Jemma Ray',
      'timeAgo': '19h ago',
      'caption':
          'Today, I experienced the most blissful ride outside. The air is fresh and it feels amazing...more',
      'imageUrl':
          'https://images.pexels.com/photos/414645/pexels-photo-414645.jpeg',
      'likes': 2900,
      'comments': 13,
      'isVerified': true,
    },
    {
      'avatarUrl': 'https://i.pravatar.cc/150?img=12',
      'username': 'Jemma Ray',
      'timeAgo': '19h ago',
      'caption':
          'Today, I experienced the most blissful ride outside. The air is fresh and it feels amazing...more',
      'imageUrl':
          'https://images.pexels.com/photos/615704/pexels-photo-615704.jpeg',
      'likes': 2900,
      'comments': 13,
      'isVerified': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // make the background crisp white
      backgroundColor: Colors.white,
      // green appbar with centered title
      appBar: AppBar(
        backgroundColor: const Color(0xFF00B050),
        elevation: 0,
        centerTitle: true,
        title: const Text('Home Feed', style: TextStyle(color: Colors.white)),
      ),
      // push content below status bar/notch
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(vertical: 16),
          children: [
            // your posts
            for (var post in _samplePosts) ...[
              PostCard(
                avatarUrl: post['avatarUrl'] as String,
                username: post['username'] as String,
                timeAgo: post['timeAgo'] as String,
                caption: post['caption'] as String,
                imageUrl: post['imageUrl'] as String,
                likes: post['likes'] as int,
                comments: post['comments'] as int,
                isVerified: post['isVerified'] as bool,
              ),
            ],
            const SizedBox(height: 16),
            // your Ad
            const AdCard(
              imageUrl:
                  'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
              storeName: 'MOZY RESTAURANT',
              title: 'Get 50% OFF when you shop with Mozy Chops',
              buttonText: 'Learn More',
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
      // FAB in the middle
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF00B050),
        child: const Icon(Icons.add, size: 32),
        onPressed: () => requireAuth(context, () {
          // TODO: push CreatePostScreen()
        }),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      // bottom nav
      bottomNavigationBar: BottomAppBar(
        // keep it white
        color: Colors.white,
        elevation: 8,
        notchMargin: 6,
        shape: const CircularNotchedRectangle(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: const Icon(Icons.home_outlined, color: Colors.grey),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.live_tv_outlined, color: Colors.grey),
                onPressed: () => requireAuth(context, () {
                  // TODO: LiveScreen
                }),
              ),
              const SizedBox(width: 48), // gap for the FAB
              IconButton(
                icon: const Icon(Icons.search, color: Colors.grey),
                onPressed: () => requireAuth(context, () {
                  // TODO: SearchScreen
                }),
              ),
              Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.mail_outline, color: Colors.grey),
                    onPressed: () => requireAuth(context, () {
                      // TODO: Messages
                    }),
                  ),
                  const Positioned(
                    right: 8,
                    top: 8,
                    child: UnreadBadge(count: 5),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.person_outline, color: Colors.grey),
                onPressed: () => requireAuth(context, () {
                  // TODO: ProfileScreen
                }),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
