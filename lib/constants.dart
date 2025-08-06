import 'package:flutter/material.dart';

/// Global configuration for the Okies app.
class AppConfig {
  /// Base URL for all API calls.
  /// Update once your backend is deployed.
  static const String apiBaseUrl = 'https://your-backend-domain.com/api';
}

// Theme tokens for chat/messages screen
const kGreen = Color(0xFF00C569);
const kTextPrimary = Color(0xFF111827); // name
const kTextSecondary = Color(0xFF6B7280); // preview
const kTextTertiary = Color(0xFF9AA0A6); // time, meta
const kChipBg = Color(0xFFF2F4F7);
const kDivider = Color(0xFFE5E7EB);

const kAvatar = 48.0; // avatar diameter
const kOnlineDot = 10.0; // online indicator
const kRowHeight = 76.0; // list row height
const kH = 16.0; // horizontal page padding
const kInsetDividerLeft = 72.0; // divider indent (avatar + spacing)

// Text styles
const nameStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: kTextPrimary,
    height: 1.1);
const previewStyle = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: kTextSecondary,
    height: 1.25);
const previewUnreadStyle = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: kTextPrimary,
    height: 1.25);
const timeStyle =
    TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: kTextTertiary);
const chipText = TextStyle(fontSize: 14, fontWeight: FontWeight.w600);
