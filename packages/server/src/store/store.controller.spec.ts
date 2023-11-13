import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import * as _ from 'lodash';
import { StoreService } from './store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Parking, ParkingSchema } from './schemas/store.schema';
import { MONGO_CONNECTION_STRING } from '../constants';
import { nanoid } from 'nanoid';
import { CreateStoreDto } from './dto/create-store.dto';

describe('StoreController', () => {
  let controller: StoreController;
  const storeDetails: CreateStoreDto = {
    name: `Store - ${nanoid(5)}`,
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
      controllers: [StoreController],
      providers: [StoreService],
    }).compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get list of stores', async () => {
    const stores = await controller.findAll();
    expect(Array.isArray(stores.data)).toBe(true);
  });
  it('should create parking', async () => {
    const response = await controller.create(storeDetails);
    expect(response.data.name).toBe(storeDetails.name);
  });
  it('should get list of stores by id', async () => {
    const stores = await controller.findAll();
    const store = _.find(stores.data, (s) => s.name === storeDetails.name);
    storeId = store.id;
    const response = await controller.findOne(store.id);
    expect(response.data.name).toBe(storeDetails.name);
  });
  it('should delete created store', async () => {
    const response = await controller.remove(storeId);
    expect(response.data.name).toBe(storeDetails.name);
    expect(response.data.id).toBe(storeId);
  });
});
