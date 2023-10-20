import { PARKING_SLOT_SIZE } from 'src/constants';

export class AllocateParkingDto {
  readonly carNumber: string;
  readonly size: PARKING_SLOT_SIZE;
}
