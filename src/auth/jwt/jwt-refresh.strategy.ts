import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtRefreshPayload = {
    readonly sub: string;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req?.cookies?.['refreshToken'] || null;
            },
            ignoreExpiration: false,
            secretOrKey: `${configService.get<string>('JWT_REFRESH_TOKEN_SECRET')}`,
        });
    }

    async validate(payload: JwtRefreshPayload) {
        return {
            uuid: payload.sub,
        }
    }
}
