import * as mongoose from 'mongoose';
import { MONGO_CONNECTION_STRING } from '../constants';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(MONGO_CONNECTION_STRING),
  },
];
