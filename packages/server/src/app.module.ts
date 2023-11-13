import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { ParkingModule } from './parking/parking.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONNECTION_STRING } from './constants';

@Module({
  imports: [
    StoreModule,
    ParkingModule,
    MongooseModule.forRoot(MONGO_CONNECTION_STRING),
  ],
})
export class AppModule {}
