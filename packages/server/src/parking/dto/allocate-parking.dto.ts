import { PARKING_SLOT_SIZE } from '../../constants';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class AllocateParkingDto {
  @IsNotEmpty()
  readonly carNumber: string;

  @IsEnum(PARKING_SLOT_SIZE)
  readonly size: PARKING_SLOT_SIZE;
}
