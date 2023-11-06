import { Mongoose } from 'mongoose';
import { StoreSchema } from '../store/schemas/store.schema';

export const parkingProviders = [
  {
    provide: 'STORE_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Store', StoreSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
