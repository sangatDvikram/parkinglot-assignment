import { Document } from 'mongoose';

export interface ParkingLot extends Document {
  readonly slotId: string;
  readonly floor: number;
  readonly size: string;
}
export interface Store extends Document {
  readonly name: string;
  readonly storeId: string;
  readonly parkingSlots: Array<ParkingLot>;
}
