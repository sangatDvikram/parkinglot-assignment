import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AllocateParkingDto } from './dto/allocate-parking.dto';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import { Store } from '../store/interfaces/store.interface';
import { isEmpty } from 'lodash';
import {
  LOG_ACTION_TYPE,
  PARKING_LOT_ALLOTMENT_SEQUENCE,
  PARKING_SLOT_SIZE,
  PARKING_SLOT_SIZE_ALLOTMENT,
} from '../constants';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  ParkingLotAllotment,
  ParkingLotAllotmentDocument,
  ParkingLotAllotmentLog,
} from './schemas/parking.schema';
import { Parking } from 'src/store/schemas/store.schema';

@Injectable()
export class ParkingService {
  constructor(
    @Inject('STORE_MODEL') private storeModel: Model<Store>,
    @InjectConnection() private connection: Connection,
    @InjectModel(Parking.name)
    private parkingLot: Model<Parking>,
    @InjectModel(ParkingLotAllotment.name)
    private parkingLotAllotmentModel: Model<ParkingLotAllotment>,
    @InjectModel(ParkingLotAllotmentLog.name)
    private parkingLotAllotmentLogModel: Model<ParkingLotAllotmentLog>,
  ) {}

  async allocateParkingSlot(
    storeId: string,
    allocateParkingDto: AllocateParkingDto,
  ) {
    const availableSlot = await this.findAvailableSlot(
      storeId,
      allocateParkingDto.size,
    );
    const parkingLot: Partial<ParkingLotAllotmentDocument> = {
      parkingLotId: storeId,
      slotID: availableSlot,
      size: allocateParkingDto.size,
      carNumber: allocateParkingDto.carNumber,
      createdAt: Date.now(),
    };
    const parkingLotAllotment =
      await this.parkingLotAllotmentModel.create(parkingLot);
    await this.parkingLotAllotmentLogModel.create({
      ...parkingLot,
      action: LOG_ACTION_TYPE.allocatedSlot,
    });
    return {
      data: { slot: parkingLotAllotment.slotID },
    };
  }

  async releaseParkingSlot(storeId: string, slotId: string) {
    const allotmentDetails = await this.parkingLotAllotmentModel
      .findOneAndDelete({
        parkingLotId: storeId,
        slotID: slotId,
      })
      .select('-_id')
      .exec();
    if (isEmpty(allotmentDetails)) {
      throw new BadRequestException('Parking/Slot not found');
    }
    const allotementSize = PARKING_SLOT_SIZE_ALLOTMENT[allotmentDetails.size];
    await this.parkingLot.updateOne(
      {
        _id: allotmentDetails.parkingLotId,
      },
      {
        $push: {
          [allotementSize]: { $each: [allotmentDetails.slotID], $sort: 1 },
        },
      },
    );
    await this.parkingLotAllotmentLogModel.create({
      size: allotmentDetails.size,
      slotID: allotmentDetails.slotID,
      parkingLotId: allotmentDetails.parkingLotId,
      carNumber: allotmentDetails.carNumber,
      action: LOG_ACTION_TYPE.deAllocatedSlot,
      createdAt: Date.now(),
    });
    return {
      data: 'success',
    };
  }

  private async findAvailableSlot(storeId, size: PARKING_SLOT_SIZE) {
    const allotementSize = PARKING_SLOT_SIZE_ALLOTMENT[size];
    const currentSizeSequenceIndex = PARKING_LOT_ALLOTMENT_SEQUENCE.findIndex(
      (seq) => seq === size,
    );
    const sequenceComparision = _.slice(
      PARKING_LOT_ALLOTMENT_SEQUENCE,
      currentSizeSequenceIndex + 1,
      PARKING_LOT_ALLOTMENT_SEQUENCE.length,
    );
    const parking = await this.parkingLot
      .findOneAndUpdate(
        {
          _id: storeId,
        },
        {
          $pop: {
            [allotementSize]: -1,
          },
        },
      )
      .select([`${allotementSize}`]);
    const availableSlotList = _.get(parking, allotementSize, []);
    let availableSlot = _.first<string>(availableSlotList);
    if (_.isEmpty(availableSlotList) && _.isEmpty(sequenceComparision)) {
      throw new BadRequestException('No Available Slot found');
    } else if (_.isEmpty(availableSlotList)) {
      availableSlot = await this.findAvailableSlot(
        storeId,
        _.first(sequenceComparision),
      );
    }
    return availableSlot;
  }
}
