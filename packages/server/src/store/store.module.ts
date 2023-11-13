import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { DatabaseModule } from '../database/database.module';
import { storeProviders } from './store.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { Parking, ParkingSchema } from './schemas/store.schema';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Parking.name, schema: ParkingSchema }]),
  ],
  controllers: [StoreController],
  providers: [StoreService, ...storeProviders],
})
export class StoreModule {}
