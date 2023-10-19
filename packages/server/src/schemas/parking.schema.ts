import * as mongoose from 'mongoose';

export const ParkingLotSchema = new mongoose.Schema({
  slotId: String,
  floor: Number,
  size: String,
});
