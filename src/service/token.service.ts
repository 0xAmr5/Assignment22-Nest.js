import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";
import UserRepository from "../DB/repository/user.repository";

@Injectable()
class TokenService {
    constructor(
        private jwtService: JwtService,
        private readonly userRepo: UserRepository
    ) {}

    GenerateToken = ({ payload, options }: {
        payload: object,
        options?: JwtSignOptions,
    }): Promise<string> => {
        return this.jwtService.signAsync(payload, options)
    };

    VerifyToken = ({ token, options }: {
        options: JwtVerifyOptions,
        token: string
    }): Promise<JwtPayload> => {
        return this.jwtService.verifyAsync(token, options)
    };

    getSignature = async (prefix: string) => {
        let ACCESS_SECRET_KEY = '';
        let REFRESH_SECRET_KEY = '';
        if (prefix == process.env.PREFIX_USER) {
            ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY_USER!
            REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY_USER!
        } else if (prefix == process.env.PREFIX_ADMIN) {
            ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY_ADMIN!
            REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY_ADMIN!
        } else {
            throw new BadRequestException("inValid prefix ")
        }
        return { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY }
    };

    decodeToken_and_fetchUser = async (token: string, secret: string) => {
        const decoded = this.VerifyToken({ token, options: { secret } }) as any
        if (!decoded?.id) {
            throw new BadRequestException("inValid token payload");
        }
        
        const user = await this.userRepo.findOne({ filter: { _id: decoded.id } })
        if (!user) {
            throw new BadRequestException("user not exist ");
        }

        // const revokeToken = await redisService.getValue(redisService.revoked_key({ userId: decoded.id, jti: decoded.jti }))
        // if (revokeToken) {
        //     throw new AppError("inValid token revoked");
        // }
        //

        return { user, decoded }
    }
}

export default TokenService