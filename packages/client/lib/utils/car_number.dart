import 'dart:math';

String generateRandomString(int len) {
  var r = Random();
  const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  return List.generate(len, (index) => chars[r.nextInt(chars.length)]).join();
}

String generateCarNumber() {
  var rand = Random();
  var firstLetter = generateRandomString(2);
  var secondNumber = rand.nextInt(99);
  var secondLetter = generateRandomString(3);
  var lastNumber = rand.nextInt(9999);
  return '$firstLetter - $secondNumber - $secondLetter - $lastNumber';
}
