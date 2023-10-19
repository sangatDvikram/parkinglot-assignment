import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreController } from './store/store.controller';
import { ParkingController } from './parking/parking.controller';
import { StoreService } from './store/store.service';
import { ParkingService } from './parking/parking.service';

@Module({
  imports: [],
  controllers: [AppController, StoreController, ParkingController],
  providers: [AppService, StoreService, ParkingService],
})
export class AppModule {}
