import { Injectable, CanActivate, ExecutionContext, BadGatewayException, HttpException } from '@nestjs/common';
import TokenService from '../../service/token.service';
import { Reflector } from '@nestjs/core';
import { TokenEnum } from '../../common/enum/token.enum';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly tokenService: TokenService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const tokenType = this.reflector.get("token_type_key", context.getHandler());

        let req: any;
        let authorization: string = "";

        if (context.getType() === "http") {
            req = context.switchToHttp().getRequest();
            authorization = req.headers.authorization;
        } 
        else if (context.getType() === "rpc") {
            // req = context.switchToRpc().getContext();
            // authorization = ...
        } 
        else if (context.getType() === "ws") {
            // req = context.switchToWs().getClient();
            // authorization = ...
        }

        if (!authorization) {
            throw new BadGatewayException("token not found");
        }

        const [prefix, token] = authorization.split(" ");
        if (!token || !prefix) {
            throw new BadGatewayException("token not exist or prefix");
        }

        const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = await this.tokenService.getSignature(prefix);
        let secret = tokenType == TokenEnum.access_token ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY;

        try {
            var { decoded, user } = await this.tokenService.decodeToken_and_fetchUser(token, secret);
        } catch (error) {
            throw new HttpException({ message: "invalid token", error }, 400);
        }

        req.user = user;
        req.decoded = decoded;

        return true;
    }
}