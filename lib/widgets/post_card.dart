import 'package:flutter/material.dart';
import '../services/auth_gate.dart';

class PostCard extends StatelessWidget {
  // … same fields as before …
  final String avatarUrl, username, timeAgo, caption, imageUrl;
  final int likes, comments;
  final bool isVerified;

  const PostCard({
    super.key,
    required this.avatarUrl,
    required this.username,
    required this.timeAgo,
    required this.caption,
    required this.imageUrl,
    required this.likes,
    required this.comments,
    required this.isVerified,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          leading: CircleAvatar(backgroundImage: NetworkImage(avatarUrl)),
          title: Row(
            children: [
              Text(username),
              if (isVerified)
                const Padding(
                  padding: EdgeInsets.only(left: 4),
                  child: Icon(Icons.check_circle, size: 16, color: Colors.blue),
                ),
            ],
          ),
          subtitle: Text(timeAgo),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(caption),
        ),
        const SizedBox(height: 8),
        Image.network(imageUrl, fit: BoxFit.cover),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.favorite_border),
                onPressed: () => requireAuth(context, () {
                  debugPrint('❤️ liked');
                }),
              ),
              Text('$likes'),
              const SizedBox(width: 16),
              IconButton(
                icon: const Icon(Icons.chat_bubble_outline),
                onPressed: () => requireAuth(context, () {
                  // TODO: navigate to comments
                }),
              ),
              Text('$comments'),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.card_giftcard),
                onPressed: () => requireAuth(context, () {
                  // TODO: gift action
                }),
              ),
            ],
          ),
        ),
        const Divider(),
      ],
    );
  }
}
