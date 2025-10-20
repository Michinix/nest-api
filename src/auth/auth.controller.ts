import { Body, Controller, HttpCode, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginBody } from './dto/login-body.dto';
import { RegisterBody } from './dto/register-body.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginBody: LoginBody, @Res({ passthrough: true }) res: Response, @Req() req: Request, @Ip() ip: string) {
        return this.authService.login(loginBody, res, req, ip);
    }

    @HttpCode(201)
    @Post('register')
    async register(@Body() registerBody: RegisterBody, @Res({ passthrough: true }) res: Response, @Req() req: Request, @Ip() ip: string) {
        return this.authService.register(registerBody, res, req, ip);
    }

    @UseGuards(JwtRefreshGuard)
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