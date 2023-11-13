import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parking, ParkingSchema } from '../store/schemas/store.schema';
import {
  ParkingLotAllotment,
  ParkingLotAllotmentLog,
  ParkingLotAllotmentLogSchema,
  ParkingLotAllotmentSchema,
} from './schemas/parking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parking.name, schema: ParkingSchema }]),
    MongooseModule.forFeature([
      { name: ParkingLotAllotment.name, schema: ParkingLotAllotmentSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: ParkingLotAllotmentLog.name,
        schema: ParkingLotAllotmentLogSchema,
      },
    ]),
  ],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
