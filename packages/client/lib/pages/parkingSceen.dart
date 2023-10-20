import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:http/http.dart';

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

class ParkingScreen extends StatefulWidget {
  const ParkingScreen({super.key});

  @override
  State<ParkingScreen> createState() => _ParkingScreenState();
}

class _ParkingScreenState extends State<ParkingScreen> {
  final carNumberController = TextEditingController(text: 'TN 75 AA 7106');
  final slotIdController = TextEditingController(text: 'Slot1');
  var selectedSize = 'SMALL';
  var allocatedSlot = '';
  var allocating = false;
  var releasing = false;
  void _dropDownSelected(dynamic? selectedValue) {
    log(selectedValue.toString());
    if (selectedValue is String) {
      setState(() {
        selectedSize = selectedValue;
      });
    }
  }

  void _onAllocateParkingSlot() async {
    final selectedStore = ModalRoute.of(context)!.settings.arguments;
    setState(() {
      allocating = true;
    });
    try {
      var response = await post(
          Uri.http(
              'localhost:3000', 'parking/$selectedStore/allocate-parking-slot'),
          body: {"carNumber": carNumberController.text, "size": selectedSize});
      var json = jsonDecode(response.body);
      var slot = ParkingSlot.fromJson(json);
      setState(() {
        allocatedSlot = slot.slot;
        allocating = false;
      });
    } catch (e) {
      log(e.toString());
      setState(() {
        allocating = false;
      });
    }
  }

  void _onReleaseParkingSlot() async {
    final selectedStore = ModalRoute.of(context)!.settings.arguments;
    setState(() {
      releasing = true;
    });
    try {
      String slotID = slotIdController.text;
      var response = await put(
          Uri.http(
              'localhost:3000', 'parking/$selectedStore/$slotID'),
          );
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Slot released successfully')));
      }
      setState(() {
        releasing = false;
      });
    } catch (e) {
      log(e.toString());
      setState(() {
        releasing = false;
      });
    }
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    carNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Perform Action'),
      ),
      body: Center(
        child: ListView(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  TextField(
                    controller: carNumberController,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      labelText: 'Enter Car Number',
                    ),
                  ),
                  SizedBox(
                    height: 16,
                  ),
                  DropdownButton(
                    items: const [
                      DropdownMenuItem(
                        child: Text('Small'),
                        value: 'SMALL',
                      ),
                      DropdownMenuItem(
                        child: Text('Medium'),
                        value: 'MEDIUM',
                      ),
                      DropdownMenuItem(
                        child: Text('Large'),
                        value: 'LARGE',
                      ),
                      DropdownMenuItem(
                        child: Text('XL'),
                        value: 'XL',
                      )
                    ],
                    onChanged: _dropDownSelected,
                    value: selectedSize,
                    isExpanded: true,
                  ),
                  SizedBox(
                    height: 16,
                  ),
                  ElevatedButton.icon(
                      onPressed: _onAllocateParkingSlot,
                      icon: allocating
                          ? Container(
                              width: 20,
                              height: 20,
                              padding: const EdgeInsets.all(2.0),
                              child: const CircularProgressIndicator(
                                strokeWidth: 2,
                              ),
                            )
                          : const Icon(Icons.drive_eta),
                      label: Text('Allocate Parking slot')),
                  SizedBox(
                    height: 16,
                  ),
                  Text('Allocated Slot : $allocatedSlot')
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  TextField(
                      controller: slotIdController,
                      decoration: const InputDecoration(
                        border: UnderlineInputBorder(),
                        labelText: 'Enter Slot ID',
                      )),
                  SizedBox(
                    height: 16,
                  ),
                  ElevatedButton.icon(
                      onPressed: _onReleaseParkingSlot,
                      icon: releasing
                          ? Container(
                              width: 20,
                              height: 20,
                              padding: const EdgeInsets.all(2.0),
                              child: const CircularProgressIndicator(
                                strokeWidth: 2,
                              ),
                            )
                          : const Icon(Icons.drive_eta),
                      label: Text('Release Parking slot')),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
