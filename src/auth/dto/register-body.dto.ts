import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterBody {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: 'First name must not be empty.' })
  @IsString({ message: 'First name must be a string.' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: 'Last name must not be empty.' })
  @IsString({ message: 'Last name must be a string.' })
  lastName: string;

  @ApiProperty({ example: 'user@exemple.com' })
  @IsNotEmpty({ message: 'Email must not be empty.' })
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd!' })
  @IsNotEmpty({ message: 'Password must not be empty.' })
  @IsString({ message: 'Password must be a string.' })
  @IsStrongPassword(
    { minLength: 12, minUppercase: 1, minSymbols: 1 },
    {
      message:
        'Password must be at least 12 characters long and contain at least one uppercase letter and one symbol.',
    },
  )
  password: string;
}
