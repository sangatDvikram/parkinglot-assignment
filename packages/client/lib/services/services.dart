import 'dart:async';
import 'dart:convert';
import 'dart:developer';

import 'package:client/constant.dart';
import 'package:http/http.dart' as http;

class Store {
  final List<dynamic> data;

  const Store({
    required this.data,
  });

  factory Store.fromJson(Map<String, dynamic> json) {
    return Store(
      data: json['data'],
    );
  }
}

class ParkingSlot {
  final String slot;

  const ParkingSlot({
    required this.slot,
  });

  factory ParkingSlot.fromJson(Map<String, dynamic> json) {
    return ParkingSlot(
      slot: json['data']['slot'],
    );
  }
}

Future<List<dynamic>> getStoreNames(http.Client client) async {
  var response = await client.get(Uri.parse(FETCH_ALL_STORES));
  if (response.statusCode == 200) {
    var json = jsonDecode(response.body);
    log(json.toString());
    var store = Store.fromJson(json);
    return store.data;
  } else {
    log(response.body.toString());
    throw Exception('Fetching Parking lot failed');
  }
}

Future<ParkingSlot> allocateParking(
    http.Client client, String selectedStore, Map<String, dynamic> body) async {
  var response =
      await client.post(Uri.parse(ALLOCATE_PARKING(selectedStore)), body: body);
  if (response.statusCode == 201) {
    var json = jsonDecode(response.body);
    log(json.toString());
    var slot = ParkingSlot.fromJson(json);
    return slot;
  } else {
    log(response.body.toString());
    throw Exception('Allocating Parking Slot Failed');
  }
}

Future<String> releaseParking(
    http.Client client, String selectedStore, String slotId) async {
  var response =
      await client.put(Uri.parse(RELEASE_PARKING(selectedStore, slotId)));
  if (response.statusCode == 200) {
    return 'success';
  } else {
    log(response.body.toString());
    throw Exception('Releasing Parking Slot Failed');
  }
}
