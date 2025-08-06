import 'package:flutter/material.dart';
import '../constants.dart';
import '../widgets/chat_list_item.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  int selectedTabIndex = 0;

  final List<Map<String, dynamic>> conversations = [
    {
      'name': 'Emily Parker',
      'message': 'You: Thank you',
      'time': '10:25am',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
      'hasAttachment': false,
    },
    {
      'name': 'James Berk',
      'message': 'I haven\'t received your report yet, wh...',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 3,
      'isRead': false,
      'hasAttachment': false,
    },
    {
      'name': 'George Eborah',
      'message': 'You: Rent receipt sir',
      'time': '10:25am',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
      'hasAttachment': true,
    },
    {
      'name': 'Kelvin Smith',
      'message': 'Warm that gba when you get home...',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 2,
      'isRead': false,
      'hasAttachment': false,
    },
    {
      'name': 'June Perry',
      'message': 'You: How far?',
      'time': '10:25am',
      'isOnline': false,
      'unreadCount': 0,
      'isRead': true,
      'hasAttachment': false,
    },
    {
      'name': 'Kante Ray',
      'message': 'Happy Birthday 🎂',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 3,
      'isRead': false,
      'hasAttachment': false,
    },
    {
      'name': 'Jane Murphy',
      'message': 'HBD 🎂',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 2,
      'isRead': false,
      'hasAttachment': false,
    },
    {
      'name': 'Joy Confidence',
      'message': 'Mummy is trying to reach your line',
      'time': '10:25am',
      'isOnline': true,
      'unreadCount': 4,
      'isRead': false,
      'hasAttachment': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        centerTitle: false,
        title: const SizedBox.shrink(),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: kDivider),
                color: Colors.white,
              ),
              child: IconButton(
                icon: const Icon(Icons.photo_camera_outlined,
                    size: 20, color: kTextPrimary),
                splashRadius: 18,
                onPressed: () {},
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.more_vert, color: kTextPrimary),
            splashRadius: 20,
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Tabs bar
          _TabsBar(
            selectedIndex: selectedTabIndex,
            onTabSelected: (index) {
              setState(() {
                selectedTabIndex = index;
              });
            },
          ),

          // Chat list
          Expanded(
            child: ListView.separated(
              physics: const BouncingScrollPhysics(),
              itemCount: conversations.length,
              separatorBuilder: (context, index) {
                return Container(
                  margin: const EdgeInsets.only(left: kInsetDividerLeft),
                  height: 1,
                  color: kDivider,
                );
              },
              itemBuilder: (context, index) {
                final conversation = conversations[index];
                return ChatListItem(
                  name: conversation['name'],
                  message: conversation['message'],
                  time: conversation['time'],
                  isOnline: conversation['isOnline'],
                  unreadCount: conversation['unreadCount'],
                  isRead: conversation['isRead'],
                  hasAttachment: conversation['hasAttachment'],
                );
              },
            ),
          ),
        ],
      ),

      // Floating Action Button
      floatingActionButton: Container(
        width: 64,
        height: 64,
        decoration: const BoxDecoration(
          color: kGreen,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 8,
              offset: Offset(0, 4),
            ),
          ],
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
            const SizedBox(width: 64), // Space for FAB
            _buildBottomNavItem(Icons.card_giftcard_outlined, 'Gifts'),
            _buildBottomNavItem(Icons.person_outline, 'Profile'),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildBottomNavItem(IconData icon, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 16),
        Icon(
          icon,
          color: label == 'Home' ? kGreen : Colors.grey[600],
          size: 24,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: label == 'Home' ? kGreen : Colors.grey[600],
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}

class _TabsBar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onTabSelected;

  const _TabsBar({
    required this.selectedIndex,
    required this.onTabSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: kH, vertical: 16),
      child: Row(
        children: [
          _buildTab('All', 0, isSelected: selectedIndex == 0),
          const SizedBox(width: 12),
          _buildTab('Unread', 1,
              unreadCount: 8, isSelected: selectedIndex == 1),
          const SizedBox(width: 12),
          _buildTab('Groups', 2, isSelected: selectedIndex == 2),
        ],
      ),
    );
  }

  Widget _buildTab(String text, int index,
      {bool isSelected = false, int? unreadCount}) {
    return GestureDetector(
      onTap: () => onTabSelected(index),
      child: Container(
        height: 36,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: isSelected ? kGreen : kChipBg,
          borderRadius: BorderRadius.circular(18),
          border: isSelected ? null : Border.all(color: kDivider),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              text,
              style: chipText.copyWith(
                color: isSelected ? Colors.white : kTextPrimary,
              ),
            ),
            if (unreadCount != null) ...[
              const SizedBox(width: 8),
              Container(
                width: 18,
                height: 18,
                decoration: const BoxDecoration(
                  color: kGreen,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    unreadCount.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
