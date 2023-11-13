import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';
import * as nanoid from 'nanoid';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { Parking, ParkingSchema } from './schemas/store.schema';
import { MONGO_CONNECTION_STRING } from '../constants';
import mongoose from 'mongoose';

describe('StoreService', () => {
  let service: StoreService;
  const storeDetails: CreateStoreDto = {
    name: `Store - ${nanoid.nanoid(5)}`,
    totalFloor: 3,
    largeSlotPerFloor: 2,
    mediumSlotPerFloor: 2,
    smallSlotPerFloor: 2,
    xlSlotPerFloor: 2,
  };
  let storeId = '';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(MONGO_CONNECTION_STRING),
        MongooseModule.forFeature([
          { name: Parking.name, schema: ParkingSchema },
        ]),
      ],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get list of stores', async () => {
    const stores = await service.findAll();
    expect(Array.isArray(stores.data)).toBe(true);
  });

  it('should create new store', async () => {
    const response = await service.registerStore(storeDetails);
    expect(response.data.name).toBe(storeDetails.name);
  });

  it('should be bad request for store name', async () => {
    const response = service.registerStore(storeDetails);
    await expect(response).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should get list of stores', async () => {
    const stores = await service.findAll();
    const store = _.find(stores.data, (s) => s.name === storeDetails.name);
    expect(store.name).toBe(storeDetails.name);
  });

  it('should get list of stores by id', async () => {
    const stores = await service.findAll();
    const store = _.find(stores.data, (s) => s.name === storeDetails.name);
    storeId = store.id;
    const response = await service.findOne(store.id);
    expect(response.data.name).toBe(storeDetails.name);
  });

  it('should be bad request for store name', async () => {
    const response = service.remove(new mongoose.Types.ObjectId().toString());
    await expect(response).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should delete created store', async () => {
    const response = await service.remove(storeId);
    expect(response.data.name).toBe(storeDetails.name);
    expect(response.data.id).toBe(storeId);
  });
});
