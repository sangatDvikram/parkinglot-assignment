import * as mongoose from 'mongoose';
import { ParkingLotSchema } from './parking.schema';

export const StoreSchema = new mongoose.Schema({
  name: String,
  storeId: String,
  parkingSlots: [ParkingLotSchema],
});
