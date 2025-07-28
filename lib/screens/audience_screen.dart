import 'package:flutter/material.dart';

class AudienceScreen extends StatefulWidget {
  const AudienceScreen({super.key});

  @override
  State<AudienceScreen> createState() => _AudienceScreenState();
}

class _AudienceScreenState extends State<AudienceScreen> {
  final List<Map<String, dynamic>> followers = [
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=1',
      'isFollowing': false,
      'isVerified': false,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=2',
      'isFollowing': true,
      'isVerified': true,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=3',
      'isFollowing': true,
      'isVerified': false,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=4',
      'isFollowing': false,
      'isVerified': false,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=5',
      'isFollowing': false,
      'isVerified': false,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=6',
      'isFollowing': true,
      'isVerified': true,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=7',
      'isFollowing': false,
      'isVerified': false,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=8',
      'isFollowing': true,
      'isVerified': false,
    },
    {
      'name': 'Collins Davidson',
      'username': '@Collinsdavid12',
      'avatar': 'https://picsum.photos/200/200?random=9',
      'isFollowing': false,
      'isVerified': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(
            Icons.arrow_back_ios,
            color: Colors.black,
            size: 20,
          ),
        ),
        title: const Text(
          'Audience',
          style: TextStyle(
            color: Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Followers list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              itemCount: followers.length,
              itemBuilder: (context, index) {
                final follower = followers[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 20),
                  child: Row(
                    children: [
                      // Profile picture
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          image: DecorationImage(
                            image: NetworkImage(follower['avatar']),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16), // Name and username
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  follower['name'],
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.black,
                                  ),
                                ),
                                if (follower['isVerified']) ...[
                                  const SizedBox(width: 4),
                                  const Icon(
                                    Icons.verified,
                                    color: Color(0xFF1DA1F2),
                                    size: 16,
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              follower['username'],
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Follow/Following button
                      Container(
                        height: 36,
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        decoration: BoxDecoration(
                          color: follower['isFollowing']
                              ? Colors.grey[100]
                              : const Color(0xFF00C569),
                          borderRadius: BorderRadius.circular(20),
                          border: follower['isFollowing']
                              ? Border.all(color: Colors.grey[300]!)
                              : null,
                        ),
                        child: Center(
                          child: Text(
                            follower['isFollowing'] ? 'Following' : 'Follow',
                            style: TextStyle(
                              color: follower['isFollowing']
                                  ? Colors.grey[700]
                                  : Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Load more button
          Container(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.refresh,
                  size: 18,
                  color: Colors.grey[600],
                ),
                const SizedBox(width: 8),
                Text(
                  'Load more followers',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),

          // Bottom indicator
          Container(
            width: 134,
            height: 5,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(2.5),
            ),
          ),
        ],
      ),
    );
  }
}
