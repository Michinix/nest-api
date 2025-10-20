import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { CreateSupplier } from './dto/create-supplier.dto';
import { UpdateSupplier } from './dto/update-supplier.dto';
import { SupplierService } from './supplier.service';

@Controller('supplier')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Get()
    async getAll() {
        return await this.supplierService.getAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        return await this.supplierService.getById(id);
    }

    @UseGuards(JwtAccessGuard)
    @Post()
    async create(@Body() createSupplier: CreateSupplier) {
        return await this.supplierService.create(createSupplier);
    }

    @UseGuards(JwtAccessGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateSupplier: UpdateSupplier) {
        return await this.supplierService.update(id, updateSupplier);
    }

    @UseGuards(JwtAccessGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.supplierService.delete(id);
    }
}
