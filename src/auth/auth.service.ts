import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginBodyDto } from './dto/login-body.dto';
import { RegisterBodyDto } from './dto/register-body.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async login(loginBodyDto: LoginBodyDto, res: Response, req: Request, ip: string): Promise<AuthResponseDto> {
        const { email, password } = loginBodyDto;

        const user = await this.prismaService.user.findUnique({ where: { email }, include: { role: true } });

        if (!user) throw new NotFoundException("No account found with this email");

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) throw new UnauthorizedException("Invalid credentials");

        const accessToken = await this.jwtService.signAsync({
            sub: user.uuid,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name
        }, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync({
            sub: user.uuid
        }, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        });

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        await this.prismaService.session.create({
            data: {
                userId: user.id,
                refreshToken: refreshTokenHash,
                ipAddress: ip,
                userAgent: req.headers['user-agent'] ?? 'Unknown',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        })

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            message: "Login successful",
            data: {
                user: {
                    uuid: user.uuid,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role.name,
                    createdAt: user.createdAt,
                }
            }
        };
    }

    async register(registerBodyDto: RegisterBodyDto, res: Response, req: Request, ip: string): Promise<AuthResponseDto> {
        const { firstName, lastName, email, password } = registerBodyDto;

        const existingUser = await this.prismaService.user.findUnique({ where: { email } });

        if (existingUser) throw new UnauthorizedException("An account with this email already exists");

        const hashedPassword = await bcrypt.hash(password, 12);

        await this.prismaService.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: {
                    connect: { name: 'USER' }
                }
            }
        });

        const user = await this.prismaService.user.findUnique({
            where: { email },
            include: {
                role: true,
            }
        });

        if (!user) throw new NotFoundException("No account found with this email");

        const accessToken = await this.jwtService.signAsync({
            sub: user.uuid,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name
        }, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync({
            sub: user.uuid
        }, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        });

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        await this.prismaService.session.create({
            data: {
                userId: user.id,
                refreshToken: refreshTokenHash,
                ipAddress: ip,
                userAgent: req.headers['user-agent'] ?? 'Unknown',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            message: "Registration successful",
            data: {
                user: {
                    uuid: user.uuid,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role.name,
                    createdAt: user.createdAt,
                }
            }
        };
    };

    async refreshToken(res: Response, req: Request, ip: string): Promise<{ message: string }> {
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) throw new UnauthorizedException("No refresh token provided");

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const session = await this.prismaService.session.findFirst({
            where: {
                refreshToken: refreshTokenHash,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                user: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!session) throw new UnauthorizedException("Invalid or expired refresh token");

        await this.prismaService.session.delete({ where: { id: session.id } });

        const newAccessToken = await this.jwtService.signAsync({
            sub: session.user.uuid,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            email: session.user.email,
            role: session.user.role.name
        }, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '15m',
        });

        const newRefreshToken = await this.jwtService.signAsync({
            sub: session.user.uuid
        }, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        });

        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

        await this.prismaService.session.create({
            data: {
                userId: session.user.id,
                refreshToken: newRefreshTokenHash,
                ipAddress: ip,
                userAgent: req.headers['user-agent'] ?? 'Unknown',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
            message: "Token refreshed successfully",
        };
    }

    async logout(res: Response, req: Request): Promise<{ message: string }> {
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
            throw new UnauthorizedException("No refresh token provided");
        }

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        await this.prismaService.session.deleteMany({
            where: { refreshToken: refreshTokenHash }
        });

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return {
            message: "Logout successful",
        };
    }
}
