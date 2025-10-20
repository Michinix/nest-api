import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplier } from './dto/create-supplier.dto';
import { SupplierResponse } from './dto/supplier-response.dto';
import { UpdateSupplier } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.client.findMany();
  }

  async getById(id: number): Promise<SupplierResponse> {
    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');

    return {
      uuid: supplier.uuid,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    };
  }

  async create(createSupplier: CreateSupplier) {
    const { name, email, phone } = createSupplier;

    const existingSupplier = await this.prismaService.supplier.findUnique({
      where: { email },
    });

    if (existingSupplier)
      throw new ConflictException('Supplier with this email already exists');

    await this.prismaService.supplier.create({
      data: {
        name,
        email,
        phone,
      },
    });

    return { message: 'Supplier created successfully' };
  }

  async update(id: number, updateSupplier: UpdateSupplier) {
    const { name, email, phone } = updateSupplier;

    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.prismaService.supplier.update({
      where: { id },
      data: {
        name,
        email,
        phone,
      },
    });

    return { message: 'Supplier updated successfully' };
  }

  async delete(id: number) {
    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.prismaService.supplier.delete({
      where: { id },
    });

    return { message: 'Supplier deleted successfully' };
  }
}
