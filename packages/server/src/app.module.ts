import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { ParkingModule } from './parking/parking.module';

@Module({
  imports: [StoreModule, ParkingModule],
})
export class AppModule {}
