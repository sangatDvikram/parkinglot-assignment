import * as mongoose from 'mongoose';
import { ParkingLotSchema } from 'src/parking/schemas/parking.schema';

export const StoreSchema = new mongoose.Schema({
  name: { type: String, index: true },
  storeId: { type: String, required: true, uniq: true },
  parkingSlots: [ParkingLotSchema],
});
