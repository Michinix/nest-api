import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { ClientService } from './client.service';
import { CreateClient } from './dto/create-client.dto';
import { UpdateClient } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Get()
    async getAll() {
        return await this.clientService.getAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        return await this.clientService.getById(id);
    }

    @UseGuards(JwtAccessGuard)
    @Post()
    async create(@Body() createClient: CreateClient) {
        return await this.clientService.create(createClient);
    }

    @UseGuards(JwtAccessGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateClient: UpdateClient) {
        return await this.clientService.update(id, updateClient);
    }

    @UseGuards(JwtAccessGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.clientService.delete(id);
    }
}
