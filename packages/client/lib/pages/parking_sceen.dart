import 'dart:convert';
import 'dart:developer';

import 'package:client/utils/car_number.dart';
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
  final carNumberController = TextEditingController(text: generateCarNumber());
  final slotIdController = TextEditingController(text: '');
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
              '10.0.2.2:3000', 'parking/$selectedStore/allocate-parking-slot'),
          body: {"carNumber": carNumberController.text, "size": selectedSize});
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).clearSnackBars();
      if (response.statusCode == 201) {
        var json = jsonDecode(response.body);
        var slot = ParkingSlot.fromJson(json);
        setState(() {
          allocatedSlot = slot.slot;
          allocating = false;
        });
        carNumberController.text = generateCarNumber();
        slotIdController.text = slot.slot;
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Slot assignment success')));
      } else {
        log(response.statusCode.toString());
        log(response.body.toString());
        setState(() {
          allocating = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Slot assignment failed')));
      }
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
        Uri.http('10.0.2.2:3000', 'parking/$selectedStore/$slotID'),
      );
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).clearSnackBars();
      if (response.statusCode == 200) {
        slotIdController.text = "";
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Slot released successfully')));
      } else {
        log(response.body.toString());
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Slot released failed')));
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
        title: const Text('Perform Action'),
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
                  const SizedBox(
                    height: 16,
                  ),
                  DropdownButton(
                    items: const [
                      DropdownMenuItem(
                        value: 'SMALL',
                        child: Text('Small'),
                      ),
                      DropdownMenuItem(
                        value: 'MEDIUM',
                        child: Text('Medium'),
                      ),
                      DropdownMenuItem(
                        value: 'LARGE',
                        child: Text('Large'),
                      ),
                      DropdownMenuItem(
                        value: 'XL',
                        child: Text('XL'),
                      )
                    ],
                    onChanged: _dropDownSelected,
                    value: selectedSize,
                    isExpanded: true,
                  ),
                  const SizedBox(
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
                      label: const Text('Allocate Parking slot')),
                  const SizedBox(
                    height: 16,
                  ),
                  SelectableText('Allocated Slot : $allocatedSlot')
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
                  const SizedBox(
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
                      label: const Text('Release Parking slot')),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
