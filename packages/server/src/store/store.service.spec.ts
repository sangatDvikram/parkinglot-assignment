import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';
import * as nanoid from 'nanoid';
import { StoreService } from './store.service';
import { DatabaseModule } from '../database/database.module';
import { storeProviders } from './store.providers';
import { CreateStoreDto } from './dto/create-store.dto';

describe('StoreService', () => {
  let service: StoreService;
  const storeDetails: CreateStoreDto = { name: `Store - ${nanoid.nanoid(5)}` };
  let storeId = '';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [StoreService, ...storeProviders],
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
    const response = await service.create(storeDetails);
    expect(response.data.name).toBe(storeDetails.name);
  });

  it('should be bad request for store name', async () => {
    const response = service.create(storeDetails);
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
    storeId = store.storeId;
    const response = await service.findOne(store.storeId);
    expect(response.data.name).toBe(storeDetails.name);
  });

  it('should be bad request for store name', async () => {
    const response = service.remove('123');
    await expect(response).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should delete created store', async () => {
    const response = await service.remove(storeId);
    expect(response.data.name).toBe(storeDetails.name);
    expect(response.data.storeId).toBe(storeId);
  });
});
