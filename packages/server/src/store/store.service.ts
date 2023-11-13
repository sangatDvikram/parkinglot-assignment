import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import { PARKING_SLOT_SIZE } from '../constants';
import { InjectModel } from '@nestjs/mongoose';
import { Parking, ParkingDocument } from './schemas/store.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Parking.name) private parkingModel: Model<Parking>,
  ) {}

  async registerStore(createStoreDto: CreateStoreDto) {
    try {
      const storeDetails = createStoreDto;
      const availableMediumSlots = this.generateSlots(
        storeDetails.totalFloor,
        storeDetails.mediumSlotPerFloor,
        PARKING_SLOT_SIZE.medium,
      );
      const availableLargeSlots = this.generateSlots(
        storeDetails.totalFloor,
        storeDetails.largeSlotPerFloor,
        PARKING_SLOT_SIZE.large,
      );
      const availableXLSlots = this.generateSlots(
        storeDetails.totalFloor,
        storeDetails.xlSlotPerFloor,
        PARKING_SLOT_SIZE.xl,
      );
      const availableSmallSlots = this.generateSlots(
        storeDetails.totalFloor,
        storeDetails.smallSlotPerFloor,
        PARKING_SLOT_SIZE.small,
      );
      const parking: Partial<ParkingDocument> = {
        ...storeDetails,
        availableSmallSlots,
        availableLargeSlots,
        availableMediumSlots,
        availableXLSlots,
      };
      const newParking = await this.parkingModel.create(parking);
      return {
        data: {
          name: newParking.name,
          id: newParking._id,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async findAll() {
    const data = await this.parkingModel.find().select(['_id', 'name']).exec();
    return {
      data: _.map(data, (d) => ({
        name: d.name,
        id: d._id,
      })),
    };
  }

  private generateSlots = (
    totalFloor,
    slotsPerFloor,
    slotType: PARKING_SLOT_SIZE,
  ) => {
    const listOfParkingSlots = [];
    _.forEach(new Array(totalFloor), (floor, floorIndex) => {
      _.forEach(new Array(slotsPerFloor), (slot, slotIndex) => {
        const currentSlot = `${floorIndex + 1}-${slotType}${slotIndex + 1}`;
        listOfParkingSlots.push(currentSlot);
      });
    });
    return listOfParkingSlots;
  };

  async findOne(id: string) {
    const data = await this.parkingModel
      .findOne({ _id: id })
      .select(['name', '_id'])
      .exec();
    return {
      data: {
        name: data.name,
        id: data._id,
      },
    };
  }

  async remove(id: string) {
    const data = await this.parkingModel
      .findOneAndDelete({ _id: id })
      .select(['name', '_id'])
      .exec();
    if (_.isEmpty(data)) {
      throw new BadRequestException('Store id not found');
    }
    return {
      data: {
        name: data.name,
        id: data._id,
      },
    };
  }
}
