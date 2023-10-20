import { PARKING_SLOT_SIZE } from 'src/constants';

export interface ParkingLot {
  _id?: string;
  slotId: string;
  floor: string;
  slotType: PARKING_SLOT_SIZE;
  carNumber: string;
  isAllocated: boolean;
}
