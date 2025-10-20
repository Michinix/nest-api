import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtRefreshPayload = {
    readonly sub: string;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req?.cookies?.['refreshToken'] || null;
            },
            ignoreExpiration: false,
            secretOrKey: `${configService.get<string>('JWT_REFRESH_TOKEN_SECRET')}`,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtRefreshPayload) {
        const token = req.cookies?.['refreshToken'];
        if (!token) throw new UnauthorizedException('No refresh token provided');

        if (!payload) throw new UnauthorizedException('Invalid refresh token');

        return {
            uuid: payload.sub,
        }
    }
}
