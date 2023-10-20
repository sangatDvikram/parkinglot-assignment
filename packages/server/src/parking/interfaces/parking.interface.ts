import { PARKING_SLOT_SIZE } from 'src/constants';

export interface ParkingLot {
  slotId: string;
  floor: string;
  slotType: PARKING_SLOT_SIZE;
  carNumber: string;
  isAllocated: boolean;
}
