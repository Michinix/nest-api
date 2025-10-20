import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateSupplier {
  @ApiProperty({ example: 'Supplier Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'supplier@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsPhoneNumber()
  phone: string;
}
