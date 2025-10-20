import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtAccessPayload = {
    readonly sub: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: string;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req?.cookies?.['accessToken'] || null;
            },
            ignoreExpiration: false,
            secretOrKey: `${configService.get<string>('JWT_ACCESS_TOKEN_SECRET')}`,
        });
    }

    async validate(payload: JwtAccessPayload) {
        return {
            uuid: payload.sub,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
        }
    }
}
