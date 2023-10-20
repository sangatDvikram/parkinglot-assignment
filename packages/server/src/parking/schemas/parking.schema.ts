import * as mongoose from 'mongoose';

export const ParkingLotSchema = new mongoose.Schema({
  slotId: { type: String, unique: true },
  floor: String,
  slotType: { type: String, index: true },
  carNumber: String,
  isAllocated: Boolean,
});
