import 'package:flutter/material.dart';

class LiveScreen extends StatefulWidget {
  const LiveScreen({super.key});

  @override
  State<LiveScreen> createState() => _LiveScreenState();
}

class _LiveScreenState extends State<LiveScreen> {
  final List<Map<String, dynamic>> liveStreams = [
    {
      'title': 'China Republic',
      'subtitle': 'is going live now',
      'viewers': '147,879k',
      'thumbnail': 'https://picsum.photos/400/300?random=10',
      'avatar': 'https://picsum.photos/100/100?random=10',
      'isLive': true,
      'isVerified': true,
    },
    {
      'title': 'Clara Kent',
      'subtitle': 'is going live now',
      'viewers': '147,879k',
      'thumbnail': 'https://picsum.photos/400/300?random=11',
      'avatar': 'https://picsum.photos/100/100?random=11',
      'isLive': true,
      'isVerified': true,
    },
    {
      'title': 'Cooking with Jaiya',
      'subtitle': 'is live now',
      'viewers': '147,879k',
      'thumbnail': 'https://picsum.photos/400/300?random=12',
      'avatar': 'https://picsum.photos/100/100?random=12',
      'isLive': true,
      'isVerified': true,
    },
    {
      'title': 'TFY Dance crew',
      'subtitle': 'live ended',
      'viewers': '147,879k',
      'thumbnail': 'https://picsum.photos/400/300?random=13',
      'avatar': 'https://picsum.photos/100/100?random=13',
      'isLive': false,
      'isVerified': true,
    },
    {
      'title': 'Military Updates',
      'subtitle': 'is going live now',
      'viewers': '147,879k',
      'thumbnail': 'https://picsum.photos/400/300?random=14',
      'avatar': 'https://picsum.photos/100/100?random=14',
      'isLive': true,
      'isVerified': true,
    },
    {
      'title': 'USA',
      'subtitle': 'is going live now',
      'viewers': '147,879k',
      'thumbnail': 'https://picsum.photos/400/300?random=15',
      'avatar': 'https://picsum.photos/100/100?random=15',
      'isLive': true,
      'isVerified': true,
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
          'Back',
          style: TextStyle(
            color: Colors.black,
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        titleSpacing: 0,
        automaticallyImplyLeading: false,
        centerTitle: false,
      ),
      body: Column(
        children: [
          // Live streams grid
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GridView.builder(
                padding: const EdgeInsets.only(top: 16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 16,
                  childAspectRatio: 0.85,
                ),
                itemCount: liveStreams.length,
                itemBuilder: (context, index) {
                  final stream = liveStreams[index];
                  return Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: Colors.white,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Thumbnail with live indicator
                        Expanded(
                          child: Stack(
                            children: [
                              Container(
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  image: DecorationImage(
                                    image: NetworkImage(stream['thumbnail']),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              // Live indicator
                              if (stream['isLive'])
                                Positioned(
                                  top: 8,
                                  left: 8,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFF3333),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Text(
                                      'LIVE',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              // Viewers count
                              Positioned(
                                bottom: 8,
                                left: 8,
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.people,
                                      color: Colors.white,
                                      size: 14,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      stream['viewers'],
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Join button
                              Positioned(
                                bottom: 8,
                                right: 8,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: stream['isLive']
                                        ? const Color(0xFFFF3333)
                                        : Colors.grey[400],
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Text(
                                    stream['isLive'] ? 'Join' : 'End',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Profile info
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          child: Row(
                            children: [
                              // Avatar
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  image: DecorationImage(
                                    image: NetworkImage(stream['avatar']),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              // Name and subtitle
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Flexible(
                                          child: Text(
                                            stream['title'],
                                            style: const TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.black,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        if (stream['isVerified']) ...[
                                          const SizedBox(width: 4),
                                          const Icon(
                                            Icons.verified,
                                            color: Color(0xFF1DA1F2),
                                            size: 14,
                                          ),
                                        ],
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      stream['subtitle'],
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: stream['isLive']
                                            ? const Color(0xFF00C569)
                                            : Colors.grey[600],
                                        fontWeight: FontWeight.w500,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
          // Go Live button
          Container(
            padding: const EdgeInsets.all(20),
            child: SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/live-streaming');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00C569),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  elevation: 0,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Icon(
                        Icons.videocam,
                        color: Colors.white,
                        size: 16,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Go Live',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
