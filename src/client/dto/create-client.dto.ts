import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateClient {
    @ApiProperty({ example: 'Client Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'client@example.com' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()
    @IsPhoneNumber()
    phone: string;
}