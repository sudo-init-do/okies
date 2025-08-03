import 'package:flutter/material.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> conversations = [
    {
      'name': 'Emily Parker',
      'message': 'You: Thank you',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=1',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
    },
    {
      'name': 'James Berk',
      'message': 'I haven\'t received your report yet, wh...',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=2',
      'isOnline': true,
      'unreadCount': 3,
      'isRead': false,
    },
    {
      'name': 'George Eborah',
      'message': 'You: Rent receipt sir 📄',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=3',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
    },
    {
      'name': 'Kelvin Smith',
      'message': 'Warm that gba when you get home...',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=4',
      'isOnline': true,
      'unreadCount': 2,
      'isRead': false,
    },
    {
      'name': 'June Perry',
      'message': 'You: How far?',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=5',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
    },
    {
      'name': 'Kante Ray',
      'message': 'Happy Birthday 🎂',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=6',
      'isOnline': true,
      'unreadCount': 3,
      'isRead': false,
    },
    {
      'name': 'Jane Murphy',
      'message': 'HBD 🎂',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=7',
      'isOnline': true,
      'unreadCount': 2,
      'isRead': false,
    },
    {
      'name': 'Joy Confidence',
      'message': 'Mummy is trying to reach your line',
      'time': '10:25am',
      'avatar': 'https://picsum.photos/150/150?random=8',
      'isOnline': true,
      'unreadCount': 4,
      'isRead': false,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header with tabs
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  // Tab buttons
                  Expanded(
                    child: Row(
                      children: [
                        _buildTabButton('All', 0, isSelected: true),
                        const SizedBox(width: 4),
                        _buildTabButton('Unread', 1, unreadCount: 8),
                        const SizedBox(width: 4),
                        _buildTabButton('Groups', 2),
                      ],
                    ),
                  ),

                  const Spacer(),

                  // Action buttons
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: IconButton(
                      icon: Icon(Icons.photo_camera_outlined,
                          color: Colors.grey[600], size: 16),
                      onPressed: () {},
                      padding: EdgeInsets.zero,
                    ),
                  ),

                  const SizedBox(width: 8),

                  IconButton(
                    icon: Icon(Icons.more_vert,
                        color: Colors.grey[600], size: 20),
                    onPressed: () {},
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),

            // Conversations list
            Expanded(
              child: ListView.builder(
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
        child: IconButton(
          icon: const Icon(Icons.add, color: Colors.white, size: 24),
          onPressed: () {
            // Handle new conversation
          },
        ),
      ),

      // Bottom Navigation
      bottomNavigationBar: Container(
        height: 80,
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildBottomNavItem(Icons.home_outlined, 'Home', false),
            _buildBottomNavItem(Icons.videocam_outlined, 'Live', false),
            Container(), // Empty space for FAB
            _buildBottomNavItem(Icons.card_giftcard_outlined, 'Gifts', false),
            _buildBottomNavItem(Icons.person_outline, 'Profile', false),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildTabButton(String text, int index,
      {bool isSelected = false, int? unreadCount}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF00C569) : Colors.transparent,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            text,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.black,
              fontWeight: FontWeight.w600,
              fontSize: 14,
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
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          // Avatar with online indicator
          Stack(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundImage: NetworkImage(conversation['avatar']),
              ),
              if (conversation['isOnline'])
                Positioned(
                  bottom: 0,
                  right: 0,
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

          const SizedBox(width: 12),

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
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    Text(
                      conversation['time'],
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[500],
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        conversation['message'],
                        style: TextStyle(
                          fontSize: 14,
                          color: conversation['isRead']
                              ? Colors.grey[600]
                              : Colors.black,
                          fontWeight: conversation['isRead']
                              ? FontWeight.w400
                              : FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),

                    const SizedBox(width: 8),

                    // Read status or unread count
                    if (conversation['unreadCount'] > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: const BoxDecoration(
                          color: Color(0xFF00C569),
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          conversation['unreadCount'].toString(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      )
                    else if (conversation['isRead'])
                      Icon(
                        Icons.check,
                        color: Colors.grey[400],
                        size: 16,
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

  Widget _buildBottomNavItem(IconData icon, String label, bool isSelected) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 16),
        Icon(
          icon,
          color: isSelected ? const Color(0xFF00C569) : Colors.grey[600],
          size: 24,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFF00C569) : Colors.grey[600],
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
