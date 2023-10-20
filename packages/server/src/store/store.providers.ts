import { Mongoose } from 'mongoose';
import { StoreSchema } from './schemas/store.schema';

export const storeProviders = [
  {
    provide: 'STORE_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Store', StoreSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
