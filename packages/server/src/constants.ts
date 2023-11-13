export const MONGO_CONNECTION_STRING = 'mongodb://0.0.0.0:27017/parking';
export enum PARKING_SLOT_SIZE {
  small = 'SMALL',
  medium = 'MEDIUM',
  large = 'LARGE',
  xl = 'XL',
}

export const PARKING_LOT_ALLOTMENT_SEQUENCE = [
  PARKING_SLOT_SIZE.small,
  PARKING_SLOT_SIZE.medium,
  PARKING_SLOT_SIZE.large,
  PARKING_SLOT_SIZE.xl,
];

export const PARKING_SLOT_SIZE_ALLOTMENT = {
  [PARKING_SLOT_SIZE.small]: 'availableSmallSlots',
  [PARKING_SLOT_SIZE.medium]: 'availableMediumSlots',
  [PARKING_SLOT_SIZE.xl]: 'availableXLSlots',
  [PARKING_SLOT_SIZE.large]: 'availableLargeSlots',
};

export enum LOG_ACTION_TYPE {
  allocatedSlot = 'ALLOCATED_SLOT',
  deAllocatedSlot = 'DEALLOCATED_SLOT',
}
