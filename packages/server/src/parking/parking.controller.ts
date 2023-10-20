import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { AllocateParkingDto } from './dto/allocate-parking.dto';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post(':storeId/allocate-parking-slot')
  allocateParkingSlot(
    @Param('storeId') storeId: string,
    @Body() allocateParkingDto: AllocateParkingDto,
  ) {
    return this.parkingService.allocateParkingSlot(storeId, allocateParkingDto);
  }

  @Put(':storeId/:slotId')
  update(@Param('storeId') storeId: string, @Param('slotId') slotId: string) {
    return this.parkingService.releaseParkingSlot(storeId, slotId);
  }
}
