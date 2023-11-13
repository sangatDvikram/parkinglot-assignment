import { Test, TestingModule } from '@nestjs/testing';
import { ParkingController } from './parking.controller';
import { BadRequestException } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { Parking, ParkingSchema } from '../store/schemas/store.schema';
import {
  ParkingLotAllotment,
  ParkingLotAllotmentLog,
  ParkingLotAllotmentLogSchema,
  ParkingLotAllotmentSchema,
} from './schemas/parking.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONNECTION_STRING, PARKING_SLOT_SIZE } from '../constants';
import { AllocateParkingDto } from './dto/allocate-parking.dto';
import mongoose from 'mongoose';
describe('ParkingController', () => {
  let controller: ParkingController;
  const parkingLotDetails: AllocateParkingDto = {
    carNumber: 'abc',
    size: PARKING_SLOT_SIZE.small,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(MONGO_CONNECTION_STRING),
        MongooseModule.forFeature([
          { name: Parking.name, schema: ParkingSchema },
        ]),
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
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should allocate parking slot', async () => {
    const response = controller.allocateParkingSlot(
      new mongoose.Types.ObjectId().toString(),
      parkingLotDetails,
    );
    await expect(response).rejects.toBeInstanceOf(BadRequestException);
  });
  it('should allocate parking slot', async () => {
    const response = controller.update(
      new mongoose.Types.ObjectId().toString(),
      '123',
    );
    await expect(response).rejects.toBeInstanceOf(BadRequestException);
  });
});
