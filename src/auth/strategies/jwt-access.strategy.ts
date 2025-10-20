import { Injectable, UnauthorizedException } from '@nestjs/common';
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
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.['accessToken'] || null;
      },
      ignoreExpiration: false,
      secretOrKey: `${configService.get<string>('JWT_ACCESS_TOKEN_SECRET')}`,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtAccessPayload) {
    const token = req.cookies?.['accessToken'];
    if (!token) throw new UnauthorizedException('No access token provided');

    if (!payload) throw new UnauthorizedException('Invalid access token');

    return {
      uuid: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
    };
  }
}
