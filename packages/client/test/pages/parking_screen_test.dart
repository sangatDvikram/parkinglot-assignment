// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:client/pages/parking_sceen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/annotations.dart';

@GenerateMocks([http.Client])
void main() {
  group('test Parking screen', () {
    testWidgets('Check for empty state', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home:ParkingScreen()));

      expect(find.text('Allocated Slot :'), findsOneWidget);
    });
    testWidgets('Dropdown select test', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home:ParkingScreen()));

      final dropdown = find.byKey(const ValueKey('sizeSelectionDropdown'));

      await tester.tap(dropdown);
      await tester.pumpAndSettle();

      final dropdownItem = find.text('Small').last;
      await tester.tap(dropdownItem);
      await tester.pumpAndSettle();
    });
  });
}
