import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  HomeScreen({super.key});

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
      'hasNewStory': false,
    },
  ];

  final List<Map<String, dynamic>> posts = [
    {
      'userImage': 'https://picsum.photos/150/150?random=10',
      'userName': 'Jemma Ray',
      'timeAgo': '19 hours ago',
      'postImage': 'https://picsum.photos/600/400?random=11',
      'caption':
          'Today, I experienced the most blissful ride outside. The air is fresh and it feels amazing... more',
      'likes': '2.1k',
      'comments': '45',
      'shares': '12',
      'isVerified': true,
    },
    {
      'userImage': 'https://picsum.photos/150/150?random=12',
      'userName': 'Jemma Ray',
      'timeAgo': '1 day ago',
      'postImage': 'https://picsum.photos/600/400?random=13',
      'caption':
          'Today, I experienced the most blissful ride outside. The air is fresh and it feels amazing... more',
      'likes': '1.8k',
      'comments': '42',
      'shares': '15',
      'isVerified': true,
    },
  ];

  final Map<String, dynamic> adPost = {
    'brandName': 'MOZY RESTAURANT',
    'adText': 'Paid advertisement',
    'postImage': 'https://picsum.photos/600/400?random=18',
    'offerText': 'Get 50% OFF when you shop with Mozy Chops',
    'buttonText': 'Learn More',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black, size: 24),
          onPressed: () {},
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Colors.black, size: 24),
            onPressed: () {},
          ),
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.favorite_border,
                    color: Colors.black, size: 24),
                onPressed: () {},
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
          IconButton(
            icon:
                const Icon(Icons.send_outlined, color: Colors.black, size: 24),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Stories Section
            Container(
              height: 110,
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: stories.length,
                itemBuilder: (context, index) {
                  final story = stories[index];
                  return Container(
                    margin: const EdgeInsets.only(right: 16),
                    width: 70,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 66,
                          height: 66,
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
                                        begin: Alignment.topCenter,
                                        end: Alignment.bottomCenter,
                                      )
                                    : null,
                            color: story['isAddStory'] == true
                                ? Colors.grey[300]
                                : story['hasNewStory'] == false
                                    ? Colors.grey[300]
                                    : null,
                          ),
                          padding: const EdgeInsets.all(2),
                          child: Container(
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                            ),
                            padding: const EdgeInsets.all(2),
                            child: story['isAddStory'] == true
                                ? Container(
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: Colors.grey[300]!,
                                        width: 1,
                                      ),
                                    ),
                                    child: const CircleAvatar(
                                      radius: 28,
                                      backgroundColor: Colors.white,
                                      child: Icon(Icons.add,
                                          color: Colors.grey, size: 20),
                                    ),
                                  )
                                : CircleAvatar(
                                    radius: 28,
                                    backgroundImage:
                                        NetworkImage(story['image']),
                                    onBackgroundImageError:
                                        (exception, stackTrace) {},
                                  ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        SizedBox(
                          width: 70,
                          child: Text(
                            story['name'],
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w400,
                              color: Colors.black87,
                            ),
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                            maxLines: 1,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Posts Section
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: posts.length + 1, // +1 for ad
              itemBuilder: (context, index) {
                // Insert ad after first post
                if (index == 1) {
                  return _buildAdCard();
                }

                // Adjust index for posts
                final postIndex = index > 1 ? index - 1 : index;
                if (postIndex >= posts.length) return const SizedBox();

                final post = posts[postIndex];
                return _buildPostCard(post);
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 8,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Colors.black,
          unselectedItemColor: Colors.grey[600],
          showSelectedLabels: false,
          showUnselectedLabels: false,
          elevation: 0,
          backgroundColor: Colors.white,
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.home, size: 28),
              label: '',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.video_library_outlined, size: 28),
              label: '',
            ),
            BottomNavigationBarItem(
              icon: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF00B050), Color(0xFF00D35C)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF00B050).withOpacity(0.3),
                      spreadRadius: 1,
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 18),
              ),
              label: '',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.calendar_month_outlined, size: 28),
              label: '',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.person_outline, size: 28),
              label: '',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPostCard(Map<String, dynamic> post) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: const BoxDecoration(
        color: Colors.white,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Post Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundImage: NetworkImage(post['userImage']),
                  onBackgroundImageError: (exception, stackTrace) {},
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            post['userName'],
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 15,
                              color: Colors.black,
                            ),
                          ),
                          if (post['isVerified'] == true) ...[
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
                        post['timeAgo'],
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon:
                      Icon(Icons.more_vert, color: Colors.grey[600], size: 20),
                  onPressed: () {},
                  splashRadius: 20,
                ),
              ],
            ),
          ),

          // Post Image
          Image.network(
            post['postImage'],
            width: double.infinity,
            height: 400,
            fit: BoxFit.cover,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              return Container(
                height: 400,
                color: Colors.grey[100],
                child: Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Colors.grey[400]!,
                    ),
                  ),
                ),
              );
            },
            errorBuilder: (context, error, stackTrace) {
              return Container(
                height: 400,
                color: Colors.grey[200],
                child: const Center(
                  child: Icon(Icons.image_not_supported,
                      color: Colors.grey, size: 50),
                ),
              );
            },
          ),

          // Post Actions
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () {},
                  child: Row(
                    children: [
                      const Icon(Icons.favorite_border,
                          size: 26, color: Colors.black),
                      const SizedBox(width: 6),
                      Text(
                        post['likes'],
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                GestureDetector(
                  onTap: () {},
                  child: Row(
                    children: [
                      const Icon(Icons.chat_bubble_outline,
                          size: 26, color: Colors.black),
                      const SizedBox(width: 6),
                      Text(
                        post['comments'],
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                GestureDetector(
                  onTap: () {},
                  child: Row(
                    children: [
                      const Icon(Icons.share_outlined,
                          size: 26, color: Colors.black),
                      const SizedBox(width: 6),
                      Text(
                        post['shares'],
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                GestureDetector(
                  onTap: () {},
                  child: const Icon(Icons.bookmark_border,
                      size: 26, color: Colors.black),
                ),
              ],
            ),
          ),

          // Post Caption
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              post['caption'],
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black,
                height: 1.3,
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildAdCard() {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: const BoxDecoration(
        color: Colors.white,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Ad Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF5722),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Center(
                    child: Text(
                      'M',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        adPost['brandName'],
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 15,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        adPost['adText'],
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon:
                      Icon(Icons.more_vert, color: Colors.grey[600], size: 20),
                  onPressed: () {},
                  splashRadius: 20,
                ),
              ],
            ),
          ),

          // Ad Content
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              adPost['offerText'],
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
                height: 1.3,
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Learn More Button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.black,
                  side: const BorderSide(color: Colors.grey),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: Text(
                  adPost['buttonText'],
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
