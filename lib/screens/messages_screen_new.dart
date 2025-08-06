import 'package:flutter/material.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  final List<Map<String, dynamic>> conversations = [
    {
      'name': 'Emily Parker',
      'message': 'You: Thank you',
      'time': '10:25am',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
    },
    {
      'name': 'James Berk',
      'message': 'I haven\'t received your report yet, wh...',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 3,
      'isRead': false,
    },
    {
      'name': 'George Eborah',
      'message': 'You: Rent receipt sir 📄',
      'time': '10:25am',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
    },
    {
      'name': 'Kelvin Smith',
      'message': 'Warm that gba when you get home...',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 2,
      'isRead': false,
    },
    {
      'name': 'June Perry',
      'message': 'You: How far?',
      'time': '10:25am',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
    },
    {
      'name': 'Kante Ray',
      'message': 'Happy Birthday 🎂',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 3,
      'isRead': false,
    },
    {
      'name': 'Jane Murphy',
      'message': 'HBD 🎂',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 2,
      'isRead': false,
    },
    {
      'name': 'Joy Confidence',
      'message': 'Mummy is trying to reach your line',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 4,
      'isRead': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header with tabs
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  // Tab buttons
                  Row(
                    children: [
                      _buildTabButton('All', isSelected: true),
                      const SizedBox(width: 12),
                      _buildTabButton('Unread', unreadCount: 8),
                      const SizedBox(width: 12),
                      _buildTabButton('Groups'),
                    ],
                  ),

                  const Spacer(),

                  // Action buttons
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(Icons.photo_camera_outlined,
                        color: Colors.grey[600], size: 20),
                  ),

                  const SizedBox(width: 12),

                  Icon(Icons.more_vert, color: Colors.grey[600], size: 24),
                ],
              ),
            ),

            // Conversations list
            Expanded(
              child: ListView.builder(
                padding: EdgeInsets.zero,
                itemCount: conversations.length,
                itemBuilder: (context, index) {
                  final conversation = conversations[index];
                  return _buildConversationItem(conversation);
                },
              ),
            ),
          ],
        ),
      ),

      // Floating Action Button
      floatingActionButton: Container(
        width: 56,
        height: 56,
        decoration: const BoxDecoration(
          color: Color(0xFF00C569),
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),

      // Bottom Navigation
      bottomNavigationBar: Container(
        height: 80,
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(color: Colors.grey[200]!, width: 1),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildBottomNavItem(Icons.home_outlined, 'Home'),
            _buildBottomNavItem(Icons.videocam_outlined, 'Live'),
            const SizedBox(width: 56), // Space for FAB
            _buildBottomNavItem(Icons.card_giftcard_outlined, 'Gifts'),
            _buildBottomNavItem(Icons.person_outline, 'Profile'),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildTabButton(String text,
      {bool isSelected = false, int? unreadCount}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF00C569) : Colors.transparent,
        borderRadius: BorderRadius.circular(25),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            text,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.black,
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
          if (unreadCount != null) ...[
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: const BoxDecoration(
                color: Color(0xFF00C569),
                shape: BoxShape.circle,
              ),
              child: Text(
                unreadCount.toString(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildConversationItem(Map<String, dynamic> conversation) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        children: [
          // Avatar with online indicator
          Stack(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: const BoxDecoration(
                  color: Color(0xFFE5E5EA),
                  shape: BoxShape.circle,
                ),
              ),
              if (conversation['isOnline'])
                Positioned(
                  bottom: 2,
                  right: 2,
                  child: Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: const Color(0xFF00C569),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                  ),
                ),
            ],
          ),

          const SizedBox(width: 16),

          // Conversation details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      conversation['name'],
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    Text(
                      conversation['time'],
                      style: const TextStyle(
                        fontSize: 15,
                        color: Color(0xFF8E8E93),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        conversation['message'],
                        style: TextStyle(
                          fontSize: 15,
                          color: conversation['isRead']
                              ? const Color(0xFF8E8E93)
                              : Colors.black,
                          fontWeight: FontWeight.w400,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),

                    const SizedBox(width: 8),

                    // Read status or unread count
                    if (conversation['unreadCount'] > 0)
                      Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          color: Color(0xFF00C569),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            conversation['unreadCount'].toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      )
                    else if (conversation['isRead'])
                      Icon(
                        Icons.check,
                        color: Colors.grey[400],
                        size: 18,
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavItem(IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 16),
        Icon(
          icon,
          color: Colors.grey[600],
          size: 24,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
