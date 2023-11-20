const FETCH_ALL_STORES = 'http://10.0.2.2:3000/store';
String ALLOCATE_PARKING(String selectedStore) {
  return 'http://10.0.2.2:3000/parking/$selectedStore/allocate-parking-slot';
}

String RELEASE_PARKING(String selectedStore, String slotId) {
  return 'http://10.0.2.2:3000/parking/$selectedStore/$slotId';
}
