import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { DatabaseModule } from 'src/database/database.module';
import { parkingProviders } from './parking.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ParkingController],
  providers: [ParkingService, ...parkingProviders],
})
export class ParkingModule {}
