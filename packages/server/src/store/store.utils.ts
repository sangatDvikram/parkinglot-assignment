import { PARKING_SLOT_SIZE } from 'src/constants';
import { ParkingLot } from 'src/parking/interfaces/parking.interface';

export const generateParkingLot = (
  storeId: string,
  floorNumber: number,
  sizeNumber: number,
  type: PARKING_SLOT_SIZE,
): ParkingLot => ({
  slotId: `${storeId}-floor${floorNumber + 1}-${type}${sizeNumber + 1}`,
  floor: `${floorNumber + 1}`,
  slotType: type,
  carNumber: '',
  isAllocated: false,
});
