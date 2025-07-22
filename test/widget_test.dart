import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:network_image_mock/network_image_mock.dart';

import 'package:okies_frontend/widgets/login_dialog.dart';
import 'package:okies_frontend/screens/home_screen.dart';

void main() {
  testWidgets('tapping like shows login dialog', (WidgetTester tester) async {
    // Stub out all NetworkImage calls to avoid real HTTP errors:
    await mockNetworkImagesFor(() async {
      // Build only the HomeScreen (skip splash)
      await tester.pumpWidget(
        MaterialApp(home: HomeScreen()),
      );
      await tester.pumpAndSettle();

      // Find & tap the first heart icon
      final likeButton = find.byIcon(Icons.favorite_border).first;
      expect(likeButton, findsOneWidget);
      await tester.tap(likeButton);
      await tester.pumpAndSettle();

      // Verify the LoginDialog is shown
      expect(find.text('Login'), findsOneWidget);
      expect(find.text('Continue'), findsOneWidget);

      // Dismiss by tapping the close icon
      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();
      expect(find.byType(LoginDialog), findsNothing);
    });
  });
}
