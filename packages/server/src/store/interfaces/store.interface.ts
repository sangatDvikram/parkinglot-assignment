import { Document } from 'mongoose';
import { ParkingLot } from '../../parking/interfaces/parking.interface';

export interface Store extends Document {
  readonly name: string;
  readonly storeId: string;
  readonly parkingSlots: Array<ParkingLot>;
}
