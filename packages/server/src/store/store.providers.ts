import { Connection } from 'mongoose';
import { StoreSchema } from '../schemas/store.schema';
import { MODELS } from 'src/constants';

export const storeProviders = [
  {
    provide: MODELS.store,
    useFactory: (connection: Connection) =>
      connection.model('Store', StoreSchema),
    inject: [MODELS.database],
  },
];
