import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  @IsInt()
  @Min(3)
  @Max(3)
  readonly totalFloor: number;
  @IsNotEmpty()
  @IsInt()
  @Max(100)
  readonly smallSlotPerFloor: number;

  @IsNotEmpty()
  @IsInt()
  @Max(100)
  readonly mediumSlotPerFloor: number;

  @IsNotEmpty()
  @IsInt()
  @Max(100)
  readonly largeSlotPerFloor: number;

  @IsNotEmpty()
  @IsInt()
  @Max(100)
  readonly xlSlotPerFloor: number;
}
