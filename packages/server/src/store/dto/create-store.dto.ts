import { ParkingLot } from 'src/parking/interfaces/parking.interface';

export class CreateStoreDto {
  readonly name: string;
  storeId: string;
  parkingSlots: Array<ParkingLot>;
}
