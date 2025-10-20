import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientResponse } from './dto/client-response.dto';
import { CreateClient } from './dto/create-client.dto';
import { UpdateClient } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.client.findMany();
  }

  async getById(id: number): Promise<ClientResponse> {
    const client = await this.prismaService.client.findUnique({
      where: { id },
    });

    if (!client) throw new NotFoundException('Client not found');

    return {
      uuid: client.uuid,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  async create(createClient: CreateClient) {
    const { name, email, phone } = createClient;

    const existingClient = await this.prismaService.client.findUnique({
      where: { email },
    });

    if (existingClient)
      throw new ConflictException('Client with this email already exists');

    await this.prismaService.client.create({
      data: {
        name,
        email,
        phone,
      },
    });

    return { message: 'Client created successfully' };
  }

  async update(id: number, updateClient: UpdateClient) {
    const { name, email, phone } = updateClient;

    const client = await this.prismaService.client.findUnique({
      where: { id },
    });

    if (!client) throw new NotFoundException('Client not found');

    await this.prismaService.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
      },
    });

    return { message: 'Client updated successfully' };
  }

  async delete(id: number) {
    const client = await this.prismaService.client.findUnique({
      where: { id },
    });

    if (!client) throw new NotFoundException('Client not found');

    await this.prismaService.client.delete({
      where: { id },
    });

    return { message: 'Client deleted successfully' };
  }
}
