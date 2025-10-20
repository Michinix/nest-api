import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class AuthResponseDto {
  message: string;

  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;
}

class DataDto {
  @ValidateNested()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
