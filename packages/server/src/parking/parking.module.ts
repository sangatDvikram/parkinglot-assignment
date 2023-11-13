import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { DatabaseModule } from '../database/database.module';
import { parkingProviders } from './parking.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { Parking, ParkingSchema } from 'src/store/schemas/store.schema';
import {
  ParkingLotAllotment,
  ParkingLotAllotmentLog,
  ParkingLotAllotmentLogSchema,
  ParkingLotAllotmentSchema,
} from './schemas/parking.schema';

@Module({
  imports: [
    DatabaseModule,
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
  providers: [ParkingService, ...parkingProviders],
})
export class ParkingModule {}
