import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [AuthModule],
  controllers: [ClientController],
  providers: [ClientService, PrismaService],
})
export class ClientModule { }
