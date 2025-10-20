import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;
}
