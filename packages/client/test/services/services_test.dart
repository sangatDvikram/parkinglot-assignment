import 'package:client/services/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mockito/annotations.dart';
import 'dart:convert';

// Generate a MockClient using the Mockito package.
// Create new instances of this class in each test.
@GenerateMocks([http.Client])
void main() {
  group('test All API', () {
    test('returns an Parking lot if the http call completes successfully',
        () async {
      final client = MockClient((request) async {
        final response = {
          "data": [
            {"name": "Sample Store 1", "id": "123"}
          ]
        };
        return http.Response(json.encode(response), 200);
      });

      expect(await getStoreNames(client), isA<List<dynamic>>());
    });

    test('throws an exception if the http call completes with an error', () {
      final client = MockClient((request) async {
        return http.Response('Not Found', 404);
      });
      expect(getStoreNames(client), throwsException);
    });
    test('returns an Parking lot slotId if assignment is success', () async {
      final client = MockClient((request) async {
        final response = {
          "data": {"slot": "123"}
        };
        return http.Response(json.encode(response), 200);
      });

      expect(await allocateParking(client, '123', {"carNumer": '123'}),
          isA<ParkingSlot>());
    });

    test('throws an exception on allocateParking exception', () {
      final client = MockClient((request) async {
        return http.Response('Not Found', 404);
      });
      expect(
          allocateParking(client, '123', {"carNumer": '123'}), throwsException);
    });
    test('Release parking slot', () async {
      final client = MockClient((request) async {
        final response = {"data": 'success'};
        return http.Response(json.encode(response), 200);
      });

      expect(await releaseParking(client, '123', '123'), isA<String>());
    });

    test('Release parking exception', () {
      final client = MockClient((request) async {
        return http.Response('Not Found', 404);
      });
      expect(releaseParking(client, '123', '123'), throwsException);
    });
  });
}
