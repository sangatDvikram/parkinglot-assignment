import 'dart:convert';
import 'dart:core';
import 'dart:developer';
import 'package:client/pages/parking_sceen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:lodash_flutter/lodash_flutter.dart';

void main() {
  runApp(const MyApp());
}

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

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Parking Application',
      routes: {
        '/parking': (context) => const ParkingScreen(),
      },
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a blue toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Parking lot allotment system'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  List<DropdownMenuItem<dynamic>> storeNames = [];
  String selectedStore = '';
  @override
  void initState() {
    super.initState();
    _getStoreNames(context);
  }

  void _getStoreNames(BuildContext context) async {
    var response = await get(Uri.http('10.0.2.2:3000', 'store'));
    List<DropdownMenuItem<dynamic>> storeNamesLocal = [];
    if (!context.mounted) return;
    if (response.statusCode == 200) {
      var json = jsonDecode(response.body);
      log(json.toString());
      var store = Store.fromJson(json);
      var firstElement = LodashFlutter.first(store.data);
      for (var element in store.data) {
        storeNamesLocal.add(DropdownMenuItem(
          value: element['id'],
          child: Text(element['name']),
        ));
      }

      setState(() {
        selectedStore = firstElement['id'];
        storeNames = storeNamesLocal;
      });
    } else {
      log(response.body.toString());
      ScaffoldMessenger.of(context).clearSnackBars();
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Getting store details failed")));
    }
  }

  void _dropDownSelected(dynamic? selectedValue) {
    log(selectedValue.toString());
    if (selectedValue is String) {
      setState(() {
        selectedStore = selectedValue;
      });
    }
  }

  void _moveToParkingScreen() {
    const routeName = '/parking';
    Navigator.pushNamed(
      context,
      routeName,
      arguments: selectedStore,
    );
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // TRY THIS: Try changing the color here to a specific color (to
        // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
        // change color while the other colors stay the same.
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          //
          // TRY THIS: Invoke "debug painting" (choose the "Toggle Debug Paint"
          // action in the IDE, or press "p" in the console), to see the
          // wireframe for each widget.
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Select available Store',
            ),
            DropdownButton(
              items: storeNames,
              hint: const Text('Select store'),
              onChanged: _dropDownSelected,
              value: selectedStore,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _moveToParkingScreen,
        tooltip: 'Start Parking allotment',
        child: const Icon(Icons.arrow_forward),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
