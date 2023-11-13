import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parking, ParkingSchema } from './schemas/store.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parking.name, schema: ParkingSchema }]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
