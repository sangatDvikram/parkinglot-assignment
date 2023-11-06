import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Model } from 'mongoose';
import { Store } from './interfaces/store.interface';
import * as nanoid from 'nanoid';
import * as _ from 'lodash';
import {
  LARGE_CAR_SIZE,
  MEDIUM_CAR_SIZE,
  PARKING_SLOT_SIZE,
  SMALL_CAR_SIZE,
  TOTAL_FLOORS,
  XL_CAR_SIZE,
} from '../constants';
import { generateParkingLot } from './store.utils';

@Injectable()
export class StoreService {
  constructor(@Inject('STORE_MODEL') private storeModel: Model<Store>) {}

  async create(createStoreDto: CreateStoreDto) {
    const id = nanoid.nanoid();
    const { name } = createStoreDto;
    // Check if name exists
    const existingStore = await this.storeModel.findOne({ name }).exec();
    if (!_.isEmpty(existingStore)) {
      throw new BadRequestException('Store name already exists.');
    }

    // Start Processing
    const store: Partial<Store> = {
      name,
      storeId: id,
      parkingSlots: [],
    };
    const floors = new Array(TOTAL_FLOORS);
    const small_cars = new Array(SMALL_CAR_SIZE);
    const medium_cars = new Array(MEDIUM_CAR_SIZE);
    const large_cars = new Array(LARGE_CAR_SIZE);
    const xl_cars = new Array(XL_CAR_SIZE);
    _.forEach(floors, (f, fi) => {
      _.forEach(small_cars, (s, si) => {
        store.parkingSlots.push(
          generateParkingLot(id, fi, si, PARKING_SLOT_SIZE.small),
        );
      });
      _.forEach(medium_cars, (s, si) => {
        store.parkingSlots.push(
          generateParkingLot(id, fi, si, PARKING_SLOT_SIZE.medium),
        );
      });
      _.forEach(large_cars, (s, si) => {
        store.parkingSlots.push(
          generateParkingLot(id, fi, si, PARKING_SLOT_SIZE.large),
        );
      });
      _.forEach(xl_cars, (s, si) => {
        store.parkingSlots.push(
          generateParkingLot(id, fi, si, PARKING_SLOT_SIZE.xl),
        );
      });
    });
    await this.storeModel.create(store);
    return {
      data: {
        storeId: id,
        name: store.name,
      },
    };
  }

  async findAll() {
    const data = await this.storeModel
      .find()
      .select(['-_id', 'name', 'storeId'])
      .exec();
    return {
      data: data,
    };
  }

  async findOne(id: string) {
    const data = await this.storeModel
      .findOne({ storeId: id })
      .select(['name', 'storeId'])
      .exec();
    return {
      data: data,
    };
  }

  async remove(id: string) {
    const data = await this.storeModel
      .findOneAndDelete({ storeId: id })
      .select(['name', 'storeId'])
      .exec();
    if (_.isEmpty(data)) {
      throw new BadRequestException('Store id not found');
    }
    return {
      data: data,
    };
  }
}
