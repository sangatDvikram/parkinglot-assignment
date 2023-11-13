import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LOG_ACTION_TYPE, PARKING_SLOT_SIZE } from 'src/constants';

export const ParkingLotSchema = new mongoose.Schema({
  slotId: { type: String, unique: true },
  floor: String,
  slotType: { type: String, index: true },
  carNumber: { type: String, index: true },
  isAllocated: { type: Boolean, index: true },
});

export type ParkingLotAllotmentDocument = HydratedDocument<ParkingLotAllotment>;
export type ParkingLotAllotmentLogDocument =
  HydratedDocument<ParkingLotAllotmentLog>;

@Schema()
export class ParkingLotAllotment {
  @Prop({ index: true })
  parkingLotId: string;

  @Prop({ index: true })
  slotID: string;

  @Prop()
  size: PARKING_SLOT_SIZE;

  @Prop()
  carNumber: string;

  @Prop()
  createdAt: number;
}

@Schema()
export class ParkingLotAllotmentLog {
  @Prop({ index: true })
  slotID: string;

  @Prop({ index: true })
  parkingLotId: string;

  @Prop()
  size: PARKING_SLOT_SIZE;

  @Prop()
  carNumber: string;

  @Prop()
  action: LOG_ACTION_TYPE;

  @Prop()
  createdAt: number;
}

export const ParkingLotAllotmentSchema =
  SchemaFactory.createForClass(ParkingLotAllotment);

export const ParkingLotAllotmentLogSchema = SchemaFactory.createForClass(
  ParkingLotAllotmentLog,
);
