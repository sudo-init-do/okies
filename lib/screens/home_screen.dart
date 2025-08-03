import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  int _selectedIndex = 0;
  late ScrollController _scrollController;
  bool _showStories = true;

  final List<Map<String, dynamic>> stories = [
    {
      'name': 'Add Story',
      'image': '',
      'isAddStory': true,
    },
    {
      'name': 'Sonara',
      'image': 'https://picsum.photos/150/150?random=1',
      'hasNewStory': true,
    },
    {
      'name': 'Julien',
      'image': 'https://picsum.photos/150/150?random=2',
      'hasNewStory': true,
    },
    {
      'name': 'Mariane',
      'image': 'https://picsum.photos/150/150?random=3',
      'hasNewStory': true,
    },
    {
      'name': 'Alex',
      'image': 'https://picsum.photos/150/150?random=4',
      'hasNewStory': false,
    },
  ];

  final List<Map<String, dynamic>> posts = [
    {
      'userImage': 'https://picsum.photos/150/150?random=10',
      'userName': 'Jemma Ray',
      'timeAgo': '19 hours ago',
      'postImage': 'https://picsum.photos/500/800?random=11',
      'caption':
          'Today, I experienced the most blissful ride outside. The air is fresh and it feels amazing... more',
      'likes': '2.1k',
      'comments': '45',
      'gifts': '12',
      'isVerified': true,
      'hasAutoSlider': true,
    },
    {
      'userImage': 'https://picsum.photos/150/150?random=12',
      'userName': 'Jemma Ray',
      'timeAgo': '1 day ago',
      'postImage': 'https://picsum.photos/500/800?random=13',
      'caption':
          'Today, I experienced the most blissful ride outside. The air is fresh and it feels amazing... more',
      'likes': '1.8k',
      'comments': '42',
      'gifts': '8',
      'isVerified': true,
      'hasAutoSlider': false,
    },
    {
      'userImage': 'https://picsum.photos/150/150?random=14',
      'userName': 'Mike Johnson',
      'timeAgo': '2 days ago',
      'postImage': 'https://picsum.photos/500/800?random=15',
      'caption':
          'Beautiful sunset today! Nature never fails to amaze me with its incredible colors.',
      'likes': '3.2k',
      'comments': '67',
      'gifts': '23',
      'isVerified': false,
      'hasAutoSlider': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();

    // Listen to scroll changes to control stories visibility
    _scrollController.addListener(() {
      if (_scrollController.hasClients) {
        final offset = _scrollController.offset;
        final shouldShowStories = offset < 20;

        if (shouldShowStories != _showStories) {
          setState(() {
            _showStories = shouldShowStories;
          });
        }
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            _buildTopBar(),

            // Stories Section (Animated)
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              height: _showStories ? 100 : 0,
              child: _showStories
                  ? _buildStoriesSection()
                  : const SizedBox.shrink(),
            ),

            // Feed Section
            Expanded(
              child: CustomScrollView(
                controller: _scrollController,
                slivers: [
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        // Insert ad after first post
                        if (index == 1) {
                          return _buildAdCard();
                        }

                        // Adjust index for posts
                        final postIndex = index > 1 ? index - 1 : index;
                        if (postIndex >= posts.length) return null;

                        final post = posts[postIndex];
                        return _buildFeedPostCard(post);
                      },
                      childCount: posts.length + 1, // +1 for ad
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
      floatingActionButton: _buildFloatingActionButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: Colors.white,
      child: Row(
        children: [
          // Okies Logo (Circular)
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.grey[300]!, width: 1),
            ),
            child: ClipOval(
              child: Image.asset(
                'assets/images/OkiesHome.png',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    decoration: const BoxDecoration(
                      color: Color(0xFF00B050),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        'O',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const Spacer(),

          // Right Icons
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.search, color: Colors.black, size: 24),
                onPressed: () {
                  Navigator.pushNamed(context, '/search');
                },
                splashRadius: 20,
              ),
              const SizedBox(width: 4),
              Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.favorite_border,
                        color: Colors.black, size: 24),
                    onPressed: () {},
                    splashRadius: 20,
                  ),
                  Positioned(
                    right: 8,
                    top: 8,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 4),
              IconButton(
                icon: const Icon(Icons.chat_bubble_outline,
                    color: Colors.black, size: 24),
                onPressed: () {
                  Navigator.pushNamed(context, '/messages');
                },
                splashRadius: 20,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStoriesSection() {
    return Container(
      height: 100,
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: stories.length,
        itemBuilder: (context, index) {
          final story = stories[index];
          return Container(
            margin: const EdgeInsets.only(right: 16),
            width: 70,
            child: GestureDetector(
              onTap: () {
                if (story['isAddStory'] == true) {
                  Navigator.pushNamed(context, '/story-creation');
                }
                // Handle other story taps here if needed
              },
              child: Column(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: story['isAddStory'] == true
                          ? null
                          : story['hasNewStory'] == true
                              ? const LinearGradient(
                                  colors: [
                                    Color(0xFFE1306C),
                                    Color(0xFFFD1D1D),
                                    Color(0xFFF77737)
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                )
                              : null,
                      border: story['isAddStory'] == true
                          ? Border.all(color: Colors.grey[300]!, width: 2)
                          : story['hasNewStory'] == false
                              ? Border.all(color: Colors.grey[300]!, width: 2)
                              : null,
                    ),
                    child: Container(
                      margin: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                      ),
                      child: Container(
                        margin: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          image: story['isAddStory'] != true
                              ? DecorationImage(
                                  image: NetworkImage(story['image']),
                                  fit: BoxFit.cover,
                                )
                              : null,
                        ),
                        child: story['isAddStory'] == true
                            ? Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.grey[100],
                                ),
                                child: const Icon(
                                  Icons.add,
                                  color: Colors.grey,
                                  size: 24,
                                ),
                              )
                            : null,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    story['name'],
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Colors.black87,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeedPostCard(Map<String, dynamic> post) {
    return Container(
      width: double.infinity,
      height: MediaQuery.of(context).size.height -
          (_showStories ? 200 : 100), // Adjust for top bar and stories
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Background Image
          Image.network(
            post['postImage'],
            fit: BoxFit.cover,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              return Container(
                color: Colors.grey[900],
                child: const Center(
                  child: CircularProgressIndicator(color: Colors.white),
                ),
              );
            },
            errorBuilder: (context, error, stackTrace) {
              return Container(
                color: Colors.grey[800],
                child: const Center(
                  child: Icon(Icons.image_not_supported,
                      color: Colors.white, size: 50),
                ),
              );
            },
          ),

          // Gradient Overlay (bottom)
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 200,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.3),
                    Colors.black.withOpacity(0.7),
                  ],
                ),
              ),
            ),
          ),

          // Right Side Engagement Buttons
          Positioned(
            right: 16,
            bottom: 120,
            child: Column(
              children: [
                _buildEngagementButton(Icons.favorite, post['likes'],
                    isLike: true),
                const SizedBox(height: 24),
                _buildEngagementButton(Icons.comment, post['comments']),
                const SizedBox(height: 24),
                _buildEngagementButton(Icons.card_giftcard, post['gifts'],
                    isGift: true),
                const SizedBox(height: 24),
                GestureDetector(
                  onTap: () {
                    // Handle bookmark tap
                  },
                  child: Container(
                    width: 50,
                    height: 50,
                    child: Icon(
                      Icons.bookmark,
                      color: Colors.white,
                      size: 28,
                      shadows: [
                        Shadow(
                          color: Colors.black.withOpacity(0.5),
                          offset: const Offset(0, 1),
                          blurRadius: 3,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Bottom Left User Info & Caption
          Positioned(
            bottom: 24,
            left: 16,
            right: 80, // Leave space for engagement buttons
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User Info Row
                GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, '/profile', arguments: {
                      'profile': {
                        'userName': post['userName'],
                        'userImage': post['userImage'],
                        'isVerified': post['isVerified'],
                      },
                      'isOwnProfile': false, // This is a public profile view
                    });
                  },
                  child: Row(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: CircleAvatar(
                          radius: 18,
                          backgroundImage: NetworkImage(post['userImage']),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Row(
                          children: [
                            Text(
                              post['userName'],
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                shadows: [
                                  Shadow(
                                    color: Colors.black,
                                    offset: Offset(0, 1),
                                    blurRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                            if (post['isVerified'] == true) ...[
                              const SizedBox(width: 6),
                              const Icon(
                                Icons.verified,
                                color: Color(0xFF1DA1F2),
                                size: 16,
                              ),
                            ],
                            const SizedBox(width: 12),
                            Text(
                              post['timeAgo'],
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                shadows: [
                                  Shadow(
                                    color: Colors.black.withOpacity(0.5),
                                    offset: const Offset(0, 1),
                                    blurRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Caption
                Text(
                  post['caption'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w400,
                    height: 1.4,
                    shadows: [
                      Shadow(
                        color: Colors.black,
                        offset: Offset(0, 1),
                        blurRadius: 2,
                      ),
                    ],
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),

                // Auto Slider Label (if applicable)
                if (post['hasAutoSlider'] == true) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: const Text(
                      'Auto Slider',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEngagementButton(IconData icon, String count,
      {bool isLike = false, bool isGift = false}) {
    return GestureDetector(
      onTap: () {
        // Handle engagement button tap
        if (isLike) {
          // Handle like action
        } else if (isGift) {
          // Handle gift action
        } else {
          // Handle comment action
        }
      },
      child: Column(
        children: [
          Icon(
            icon,
            color: isLike
                ? Colors.red[400]
                : (isGift ? Colors.amber[400] : Colors.white),
            size: 28,
            shadows: [
              Shadow(
                color: Colors.black.withOpacity(0.5),
                offset: const Offset(0, 1),
                blurRadius: 3,
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            count,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w600,
              shadows: [
                Shadow(
                  color: Colors.black,
                  offset: Offset(0, 1),
                  blurRadius: 3,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdCard() {
    return Container(
      width: double.infinity,
      height: MediaQuery.of(context).size.height -
          (_showStories ? 200 : 100), // Adjust for top bar and stories
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Ad Image
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Image.network(
              'https://picsum.photos/400/200?random=99',
              width: double.infinity,
              height: 220,
              fit: BoxFit.cover,
            ),
          ),

          // Ad Content
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF5722),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Center(
                        child: Text(
                          'M',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'MOZY RESTAURANT',
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 17,
                              color: Colors.black,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Paid advertisement',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.more_horiz,
                          color: Colors.grey, size: 24),
                      onPressed: () {},
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  'Get 50% OFF when you shop with Mozy Chops',
                  style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00C569),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      elevation: 2,
                    ),
                    child: const Text(
                      'Learn More',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFloatingActionButton() {
    return Container(
      width: 56,
      height: 56,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF00C569), Color(0xFF00D35C)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF00C569).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.pushNamed(context, '/upload');
          },
          borderRadius: BorderRadius.circular(28),
          child: const Icon(
            Icons.add,
            color: Colors.white,
            size: 28,
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return BottomAppBar(
      color: Colors.white,
      elevation: 8,
      notchMargin: 8,
      shape: const CircularNotchedRectangle(),
      child: Container(
        height: 60,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Left side icons
            Row(
              children: [
                _buildNavItem(Icons.home_outlined, Icons.home, 0),
                const SizedBox(width: 32),
                _buildNavItem(Icons.videocam_outlined, Icons.videocam, 1),
              ],
            ),

            // Right side icons
            Row(
              children: [
                _buildNavItem(
                    Icons.card_giftcard_outlined, Icons.card_giftcard, 3),
                const SizedBox(width: 32),
                _buildNavItem(Icons.person_outline, Icons.person, 4),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData outlinedIcon, IconData filledIcon, int index) {
    final bool isSelected = _selectedIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });

        // Handle navigation based on index
        if (index == 1) {
          Navigator.pushNamed(context, '/live');
        } else if (index == 3) {
          Navigator.pushNamed(context, '/gift');
        } else if (index == 4) {
          Navigator.pushNamed(context, '/profile', arguments: {
            'profile': {
              'userName': 'Kelly Jnr.',
              'userImage': 'https://picsum.photos/120/120?random=1',
              'isVerified': true,
            },
            'isOwnProfile': true,
          });
        }
      },
      child: Container(
        padding: const EdgeInsets.all(8),
        child: Icon(
          isSelected ? filledIcon : outlinedIcon,
          size: 28,
          color: isSelected ? const Color(0xFF00C569) : Colors.grey[600],
        ),
      ),
    );
  }
}
