// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/annotations.dart';
import 'package:client/main.dart';

@GenerateMocks([http.Client])
void main() {
  group('test Main application', () {
    testWidgets('Check for empty state', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      expect(find.text('Select available Parking lot'), findsOneWidget);
    });
    testWidgets('Dropdown select test', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      final dropdown = find.byKey(const ValueKey('parkingLotSelectDropdown'));

      await tester.tap(dropdown);
      await tester.pumpAndSettle();

      final dropdownItem = find.text('First item').last;
      await tester.tap(dropdownItem);
      await tester.pumpAndSettle();
    });
  });
}
