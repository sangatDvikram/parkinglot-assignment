import { IsNotEmpty } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  readonly name: string;
}
