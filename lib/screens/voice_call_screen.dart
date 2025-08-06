import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math' as math;
import '../constants.dart';

class VoiceCallScreen extends StatefulWidget {
  final String contactName;
  final String? contactImage;

  const VoiceCallScreen({
    super.key,
    required this.contactName,
    this.contactImage,
  });

  @override
  State<VoiceCallScreen> createState() => _VoiceCallScreenState();
}

class _VoiceCallScreenState extends State<VoiceCallScreen>
    with TickerProviderStateMixin {
  bool isConnected = false;
  bool isMuted = false;
  bool isSpeakerOn = false;
  Timer? callTimer;
  Duration callDuration = Duration.zero;
  late AnimationController _waveAnimationController;
  late AnimationController _pulseAnimationController;

  @override
  void initState() {
    super.initState();
    _waveAnimationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _pulseAnimationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    // Simulate connecting after 3 seconds
    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          isConnected = true;
        });
        _startCallTimer();
        _waveAnimationController.repeat();
      }
    });

    _pulseAnimationController.repeat();
  }

  void _startCallTimer() {
    callTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          callDuration = Duration(seconds: callDuration.inSeconds + 1);
        });
      }
    });
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    String minutes = twoDigits(duration.inMinutes);
    String seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Row(
                      children: [
                        const Icon(Icons.arrow_back,
                            color: kTextPrimary, size: 24),
                        const SizedBox(width: 8),
                        const Text(
                          'Back',
                          style: TextStyle(
                            fontSize: 17,
                            color: kTextPrimary,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  const Text(
                    'Voice Call',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w600,
                      color: kTextPrimary,
                    ),
                  ),
                  const Spacer(),
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person_add_outlined,
                        color: kTextPrimary, size: 24),
                  ),
                ],
              ),
            ),

            // Speaker icon (top right)
            Align(
              alignment: Alignment.centerRight,
              child: Padding(
                padding: const EdgeInsets.only(right: 20),
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      isSpeakerOn = !isSpeakerOn;
                    });
                  },
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: isSpeakerOn ? kGreen : Colors.grey[100],
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.volume_up,
                      color: isSpeakerOn ? Colors.white : kTextPrimary,
                      size: 24,
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 40),

            // Profile Image with pulse animation when ringing
            AnimatedBuilder(
              animation: _pulseAnimationController,
              builder: (context, child) {
                return Container(
                  width: isConnected
                      ? 200
                      : 200 + (20 * _pulseAnimationController.value),
                  height: isConnected
                      ? 200
                      : 200 + (20 * _pulseAnimationController.value),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.grey[200],
                    image: widget.contactImage != null
                        ? DecorationImage(
                            image: NetworkImage(widget.contactImage!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: widget.contactImage == null
                      ? Icon(
                          Icons.person,
                          size: 80,
                          color: Colors.grey[400],
                        )
                      : null,
                );
              },
            ),

            const SizedBox(height: 24),

            // Contact Name
            Text(
              widget.contactName,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: kTextPrimary,
              ),
            ),

            const SizedBox(height: 12),

            // Call Status or Timer
            if (isConnected)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  border: Border.all(color: kDivider),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  _formatDuration(callDuration),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: kTextPrimary,
                  ),
                ),
              )
            else
              const Text(
                'Ringing...',
                style: TextStyle(
                  fontSize: 16,
                  color: kTextTertiary,
                  fontWeight: FontWeight.w400,
                ),
              ),

            const Spacer(),

            // Audio Waveform (only when connected)
            if (isConnected)
              Container(
                height: 60,
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: AnimatedBuilder(
                  animation: _waveAnimationController,
                  builder: (context, child) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: List.generate(12, (index) {
                        double height = 4 +
                            (20 *
                                (0.5 +
                                    0.5 *
                                        (1 +
                                            math.sin(index * 0.3 +
                                                _waveAnimationController.value *
                                                    2)) /
                                        2));
                        return Container(
                          width: 3,
                          height: height,
                          decoration: BoxDecoration(
                            color: kTextTertiary,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        );
                      }),
                    );
                  },
                ),
              ),

            const Spacer(),

            // Bottom Controls
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 40),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Video call button
                  GestureDetector(
                    onTap: () {
                      // Handle video call
                    },
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.videocam,
                        color: kTextPrimary,
                        size: 28,
                      ),
                    ),
                  ),

                  // End call button
                  GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                    },
                    child: Container(
                      width: 64,
                      height: 64,
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.call_end,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                  ),

                  // Mute button
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        isMuted = !isMuted;
                      });
                    },
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: isMuted ? Colors.red : Colors.grey[100],
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isMuted ? Icons.mic_off : Icons.mic,
                        color: isMuted ? Colors.white : kTextPrimary,
                        size: 28,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    callTimer?.cancel();
    _waveAnimationController.dispose();
    _pulseAnimationController.dispose();
    super.dispose();
  }
}
