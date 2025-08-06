import 'package:flutter/material.dart';
import '../constants.dart';

class ChatListItem extends StatelessWidget {
  final String name;
  final String message;
  final String time;
  final bool isOnline;
  final int unreadCount;
  final bool isRead;
  final bool hasAttachment;

  const ChatListItem({
    super.key,
    required this.name,
    required this.message,
    required this.time,
    this.isOnline = false,
    this.unreadCount = 0,
    this.isRead = true,
    this.hasAttachment = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        // Navigate to chat conversation screen
        Navigator.pushNamed(
          context,
          '/chat',
          arguments: {
            'contactName': name,
            'isOnline': isOnline,
            'existingMessages': _generateSampleMessages(),
          },
        );
      },
      child: Container(
        height: kRowHeight,
        padding: const EdgeInsets.symmetric(horizontal: kH),
        child: Row(
          children: [
            // Avatar with online indicator
            Stack(
              children: [
                Container(
                  width: kAvatar,
                  height: kAvatar,
                  decoration: const BoxDecoration(
                    color: Color(0xFFE5E5EA),
                    shape: BoxShape.circle,
                  ),
                ),
                if (isOnline)
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: kOnlineDot,
                      height: kOnlineDot,
                      decoration: BoxDecoration(
                        color: kGreen,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                    ),
                  ),
              ],
            ),

            const SizedBox(width: 12),

            // Center column (name and preview)
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    name,
                    style: nameStyle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (hasAttachment) ...[
                        Icon(
                          Icons.description_outlined,
                          size: 16,
                          color: kTextTertiary,
                        ),
                        const SizedBox(width: 6),
                      ],
                      Expanded(
                        child: Text(
                          message,
                          style: unreadCount > 0
                              ? previewUnreadStyle
                              : previewStyle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            // Trailing column (time and status/count)
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  time,
                  style: timeStyle,
                ),
                const SizedBox(height: 4),
                if (unreadCount > 0)
                  Container(
                    width: 24,
                    height: 24,
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
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  )
                else if (isRead)
                  Icon(
                    Icons.done_all,
                    size: 18,
                    color: message.startsWith('You:') ? kGreen : kTextTertiary,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  List<Map<String, dynamic>>? _generateSampleMessages() {
    // Return null for new conversations to show empty state
    if (unreadCount == 0 && message.startsWith('You:')) {
      return [];
    }

    // Generate some sample messages for existing conversations
    return [
      {
        'text': 'Hey there! How are you doing?',
        'isMe': false,
        'time': '10:20am',
        'isRead': true,
      },
      {
        'text': 'I\'m doing great, thanks for asking!',
        'isMe': true,
        'time': '10:22am',
        'isRead': true,
      },
      {
        'text': message.startsWith('You:') ? message.substring(5) : message,
        'isMe': message.startsWith('You:'),
        'time': time,
        'isRead': isRead,
      },
    ];
  }
}
