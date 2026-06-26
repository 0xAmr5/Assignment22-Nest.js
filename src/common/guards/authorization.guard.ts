import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const Roles = this.reflector.get("access_roles_key", context.getHandler()) as string[];

            let req: any;
            if (context.getType() === "http") {
                req = context.switchToHttp().getRequest();
            } 
            else if (context.getType() === "rpc") {
                // req = context.switchToRpc().getContext();
            } 
            else if (context.getType() === "ws") {
                // req = context.switchToWs().getClient();
            }

            if (!Roles.includes(req.user.role)) {
                throw new UnauthorizedException();
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}