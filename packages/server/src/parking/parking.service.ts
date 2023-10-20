import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AllocateParkingDto } from './dto/allocate-parking.dto';
import { Model } from 'mongoose';
import { Store } from 'src/store/interfaces/store.interface';
import { isEmpty, find } from 'lodash';
import { PARKING_SLOT_SIZE } from 'src/constants';

@Injectable()
export class ParkingService {
  constructor(@Inject('STORE_MODEL') private storeModel: Model<Store>) {}

  async allocateParkingSlot(
    storeId: string,
    allocateParkingDto: AllocateParkingDto,
  ) {
    const storeDetails = await this.storeModel
      .findOne({ storeId: storeId })
      .select(['storeId'])
      .exec();
    if (isEmpty(storeDetails)) {
      throw new BadRequestException('Store not found');
    }
    const availableSlot = await this.findAllocatedSlots(
      storeId,
      allocateParkingDto.size,
    );
    await this.storeModel
      .findOneAndUpdate(
        {
          _id: storeDetails.id,
          'parkingSlots._id': availableSlot._id,
        },
        {
          $set: {
            'parkingSlots.$.isAllocated': true,
            'parkingSlots.$.carNumber': allocateParkingDto.carNumber,
          },
        },
      )
      .exec();
    return {
      data: { slot: availableSlot.slotId },
    };
  }

  async releaseParkingSlot(storeId: string, slotId: string) {
    const storeDetails = await this.storeModel
      .findOne({ storeId: storeId })
      .select(['storeId', 'parkingSlots'])
      .exec();
    if (isEmpty(storeDetails)) {
      throw new BadRequestException('Store not found');
    }
    const currentSlot = find(storeDetails.parkingSlots, {
      slotId: slotId,
      isAllocated: true,
    });
    if (isEmpty(currentSlot)) {
      throw new BadRequestException('Slot is already free');
    }
    await this.storeModel
      .findOneAndUpdate(
        {
          _id: storeDetails.id,
          'parkingSlots._id': currentSlot._id,
        },
        {
          $set: {
            'parkingSlots.$.isAllocated': false,
            'parkingSlots.$.carNumber': '',
          },
        },
      )
      .exec();
    return {
      data: 'success',
    };
  }

  private async findAllocatedSlots(storeId: string, size: PARKING_SLOT_SIZE) {
    const selectedStore = await this.storeModel
      .findOne({
        storeId: storeId,
        'parkingSlots.isAllocated': false,
        'parkingSlots.slotType': size,
      })
      .exec();
    let availableSlot = find(selectedStore.parkingSlots, {
      isAllocated: false,
      slotType: size,
    });
    if (isEmpty(availableSlot) && size === PARKING_SLOT_SIZE.small) {
      availableSlot = await this.findAllocatedSlots(
        storeId,
        PARKING_SLOT_SIZE.medium,
      );
    } else if (isEmpty(availableSlot) && size === PARKING_SLOT_SIZE.medium) {
      availableSlot = await this.findAllocatedSlots(
        storeId,
        PARKING_SLOT_SIZE.large,
      );
    } else if (isEmpty(availableSlot) && size === PARKING_SLOT_SIZE.large) {
      availableSlot = await this.findAllocatedSlots(
        storeId,
        PARKING_SLOT_SIZE.xl,
      );
    }
    return availableSlot;
  }
}
