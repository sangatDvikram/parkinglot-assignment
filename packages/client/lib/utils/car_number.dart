import 'dart:math';

String generateRandomString(int len) {
  var r = Random();
  const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  return List.generate(len, (index) => chars[r.nextInt(chars.length)]).join();
}
String generateRandomNumber(int len) {
  var r = Random();
  const chars = '0123456789';
  return List.generate(len, (index) => chars[r.nextInt(chars.length)]).join();
}
String generateCarNumber() {
  var firstLetter = generateRandomString(2).toUpperCase();
  var secondNumber = generateRandomNumber(2);
  var secondLetter = generateRandomString(2).toUpperCase();
  var lastNumber = generateRandomNumber(4);
  return '$firstLetter-$secondNumber-$secondLetter-$lastNumber';
}
