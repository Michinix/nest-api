import { Body, Controller, HttpCode, Ip, Post, Req, Res } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { RegisterBodyDto } from './dto/register-body.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginBodyDto: LoginBodyDto, @Res({ passthrough: true }) res: Response, @Req() req: Request, @Ip() ip: string) {
        return this.authService.login(loginBodyDto, res, req, ip);
    }

    @HttpCode(201)
    @Post('register')
    async register(@Body() registerBodyDto: RegisterBodyDto, @Res({ passthrough: true }) res: Response, @Req() req: Request, @Ip() ip: string) {
        return this.authService.register(registerBodyDto, res, req, ip);
    }

    @Post('refresh-token')
    async refreshToken(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Ip() ip: string) {
        return this.authService.refreshToken(res, req, ip);
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        return this.authService.logout(res, req);
    }

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async handleExpiredSessionsCleanup() {
        await this.authService.deleteExpiredSessions();
    }
}