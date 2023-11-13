import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { BadRequestException } from '@nestjs/common';
import * as nanoid from 'nanoid';
import * as _ from 'lodash';
import { StoreService } from '../store/store.service';
import { CreateStoreDto } from '../store/dto/create-store.dto';
import { AllocateParkingDto } from './dto/allocate-parking.dto';
import { MONGO_CONNECTION_STRING, PARKING_SLOT_SIZE } from '../constants';
import { MongooseModule } from '@nestjs/mongoose';
import { Parking, ParkingSchema } from '../store/schemas/store.schema';
import {
  ParkingLotAllotment,
  ParkingLotAllotmentLog,
  ParkingLotAllotmentLogSchema,
  ParkingLotAllotmentSchema,
} from './schemas/parking.schema';
import mongoose from 'mongoose';

describe('ParkingService', () => {
  let parkingService: ParkingService;
  let storeService: StoreService;
  const storeDetails: CreateStoreDto = {
    name: `Store - ${nanoid.nanoid(5)}`,
    totalFloor: 3,
    largeSlotPerFloor: 2,
    mediumSlotPerFloor: 2,
    smallSlotPerFloor: 2,
    xlSlotPerFloor: 2,
  };
  let storeId = '';
  const allocatedSlots = {
    [PARKING_SLOT_SIZE.small]: '',
    [PARKING_SLOT_SIZE.medium]: '',
    [PARKING_SLOT_SIZE.large]: '',
    [PARKING_SLOT_SIZE.xl]: '',
  };
  const parkingLotDetails: AllocateParkingDto = {
    carNumber: 'abc',
    size: PARKING_SLOT_SIZE.small,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
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
    }).compile();
    parkingService = module.get<ParkingService>(ParkingService);
  });

  beforeAll(async () => {
    const storeModule: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(MONGO_CONNECTION_STRING),
        MongooseModule.forFeature([
          { name: Parking.name, schema: ParkingSchema },
        ]),
      ],
      providers: [StoreService],
    }).compile();
    storeService = storeModule.get<StoreService>(StoreService);
    const response = await storeService.registerStore(storeDetails);
    storeId = response.data.id;
  });

  afterAll(async () => {
    const storeModule: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(MONGO_CONNECTION_STRING),
        MongooseModule.forFeature([
          { name: Parking.name, schema: ParkingSchema },
        ]),
      ],
      providers: [StoreService],
    }).compile();
    storeService = storeModule.get<StoreService>(StoreService);
    await storeService.remove(storeId);
  });

  it('should be defined', () => {
    expect(parkingService).toBeDefined();
  });

  it('should be store Id to defined', () => {
    expect(storeId).toBeDefined();
  });

  it('should allocate parking slot', async () => {
    const slot = await parkingService.allocateParkingSlot(
      storeId,
      parkingLotDetails,
    );
    allocatedSlots[PARKING_SLOT_SIZE.small] = slot.data.slot;
    expect(slot.data.slot).toBeDefined();
  });

  it('should be bad request for store id', async () => {
    const response = parkingService.allocateParkingSlot(
      new mongoose.Types.ObjectId().toString(),
      parkingLotDetails,
    );
    await expect(response).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should allocate all parking slot', async () => {
    const slot = await parkingService.allocateParkingSlot(storeId, {
      carNumber: nanoid.nanoid(5),
      size: PARKING_SLOT_SIZE.medium,
    });
    allocatedSlots[PARKING_SLOT_SIZE.medium] = slot.data.slot;
    const slot1 = await parkingService.allocateParkingSlot(storeId, {
      carNumber: nanoid.nanoid(5),
      size: PARKING_SLOT_SIZE.xl,
    });
    allocatedSlots[PARKING_SLOT_SIZE.xl] = slot1.data.slot;
    const slot2 = await parkingService.allocateParkingSlot(storeId, {
      carNumber: nanoid.nanoid(5),
      size: PARKING_SLOT_SIZE.large,
    });
    allocatedSlots[PARKING_SLOT_SIZE.large] = slot2.data.slot;
    expect(allocatedSlots[PARKING_SLOT_SIZE.small]).toContain(
      PARKING_SLOT_SIZE.small,
    );
    expect(allocatedSlots[PARKING_SLOT_SIZE.medium]).toContain(
      PARKING_SLOT_SIZE.medium,
    );
    expect(allocatedSlots[PARKING_SLOT_SIZE.xl]).toContain(
      PARKING_SLOT_SIZE.xl,
    );
    expect(allocatedSlots[PARKING_SLOT_SIZE.large]).toContain(
      PARKING_SLOT_SIZE.large,
    );
  });

  it('should allocate medium slot to small vehical', async () => {
    const promises = [];
    for (let index = 1; index < new Array(9).length; index++) {
      promises.push(
        parkingService.allocateParkingSlot(storeId, {
          carNumber: nanoid.nanoid(5),
          size: PARKING_SLOT_SIZE.small,
        }),
      );
    }
    const slot = await Promise.all(promises);
    console.log('slot', slot);
    const last = _.last(slot);
    expect(last.data.slot).toContain(`${PARKING_SLOT_SIZE.medium}`);
  });

  it('should release all parking slot', async () => {
    const success = 'success';
    const slot = await parkingService.releaseParkingSlot(
      storeId,
      allocatedSlots[PARKING_SLOT_SIZE.small],
    );
    const slot1 = await parkingService.releaseParkingSlot(
      storeId,
      allocatedSlots[PARKING_SLOT_SIZE.medium],
    );
    const slot2 = await parkingService.releaseParkingSlot(
      storeId,
      allocatedSlots[PARKING_SLOT_SIZE.large],
    );
    const slot3 = await parkingService.releaseParkingSlot(
      storeId,
      allocatedSlots[PARKING_SLOT_SIZE.xl],
    );
    expect(slot.data).toBe(success);
    expect(slot1.data).toBe(success);
    expect(slot2.data).toBe(success);
    expect(slot3.data).toBe(success);
  });

  it('should release all parking slot', async () => {
    const slot = parkingService.releaseParkingSlot(
      storeId,
      allocatedSlots[PARKING_SLOT_SIZE.small],
    );
    await expect(slot).rejects.toBeInstanceOf(BadRequestException);
  });
});
