import { Document } from 'mongoose';
import { ParkingLot } from 'src/parking/interfaces/parking.interface';

export interface Store extends Document {
  readonly name: string;
  readonly storeId: string;
  readonly parkingSlots: Array<ParkingLot>;
}
