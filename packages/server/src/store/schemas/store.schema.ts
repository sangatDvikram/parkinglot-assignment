import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ParkingLotSchema } from '../../parking/schemas/parking.schema';

export const StoreSchema = new mongoose.Schema({
  name: { type: String, index: true },
  storeId: { type: String, required: true, uniq: true },
  parkingSlots: [ParkingLotSchema],
});

export type ParkingDocument = HydratedDocument<Parking>;

@Schema()
export class Parking {
  @Prop({ unique: true })
  name: string;

  @Prop()
  totalFloor: number;

  @Prop()
  smallSlotPerFloor: number;

  @Prop()
  mediumSlotPerFloor: number;

  @Prop()
  largeSlotPerFloor: number;

  @Prop()
  xlSlotPerFloor: number;

  @Prop()
  availableSmallSlots: string[];

  @Prop()
  availableMediumSlots: string[];

  @Prop()
  availableLargeSlots: string[];

  @Prop()
  availableXLSlots: string[];
}

export const ParkingSchema = SchemaFactory.createForClass(Parking);
