import { Injectable, Inject } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { MODELS } from 'src/constants';
import { Model } from 'mongoose';
import { Store } from 'src/interfaces/store.interface';

@Injectable()
export class StoreService {
  
  constructor(@Inject(MODELS.store) private storeModel: Model<Store>) {}

  create(createStoreDto: CreateStoreDto) {
    return 'This action adds a new store';
  }

  findAll() {
    return this.storeModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
